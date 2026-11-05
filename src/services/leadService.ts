import pb from '@/lib/pocketbase/client'

export interface LeadConsorcio {
  id: string
  criadoEm: string // ISO date
  nome: string
  telefone: string
  objetivo: string
  tipoBem: string
  faixaValor: string
  prazoContemplacao: string
  parcelaOrcamento: string
  urgencia: string
  melhorHorarioContato?: string
  creditoEstimado?: number
  origem?: string
  status?: 'novo' | 'em_atendimento' | 'ganho' | 'perdido'
}

export interface AdminUser {
  id: string
  nome: string
  email: string
  role: 'admin' | 'consultor'
  criadoEm: string
}

export interface ConsultorItem {
  id: string
  name: string
  email: string
  role: 'admin' | 'consultor'
  verified: boolean
  created: string
  updated?: string
}

const LEADS_STORAGE_KEY = 'ccg_leads_db_v1'
const ORIGEM_PARAM_KEY = 'multicotador:origem_parceiro'

/**
 * Captura ?origem=<slug> na chegada (link da Área do Parceiro de uma landing
 * do grupo) e mantém durante a visita — a query pode se perder após navegação
 * interna. Um novo carregamento sem o parâmetro encerra o vínculo da visita.
 * Regra do grupo: quem define o dono do lead é a origem da landing que o gerou.
 */
export function captureOrigemParam(): string | null {
  if (typeof window === 'undefined') return null
  try {
    const origem = new URLSearchParams(window.location.search).get('origem')
    if (origem) {
      window.sessionStorage.setItem(ORIGEM_PARAM_KEY, origem)
      return origem
    }
    return window.sessionStorage.getItem(ORIGEM_PARAM_KEY)
  } catch {
    return null
  }
}

// Captura na entrada do app
captureOrigemParam()

// Helper para converter registro do PocketBase para a interface da aplicação
function recordToLead(record: Record<string, any>): LeadConsorcio {
  return {
    id: record.id,
    criadoEm: record.created || new Date().toISOString(),
    nome: record.nome || '',
    telefone: record.telefone || '',
    objetivo: record.objetivo || '',
    tipoBem: record.tipoBem || '',
    faixaValor: record.faixaValor || '',
    prazoContemplacao: record.prazoContemplacao || '',
    parcelaOrcamento: record.parcelaOrcamento || '',
    urgencia: record.urgencia || '',
    melhorHorarioContato: record.melhorHorarioContato || '',
    creditoEstimado: record.creditoEstimado ?? undefined,
    origem: (record.origem as LeadConsorcio['origem']) || 'diagnostico',
    status: (record.status as LeadConsorcio['status']) || 'novo',
  }
}

export const LeadService = {
  /**
   * Busca leads do PocketBase (requer usuário autenticado na área do parceiro).
   * Migra silenciosamente leads remanescentes do localStorage para o banco se houver.
   */
  async getLeads(): Promise<LeadConsorcio[]> {
    try {
      const records = await pb.collection('leads').getFullList({
        sort: '-created',
      })

      // Se houver leads no localStorage que ainda não estão no banco, tenta migrar
      try {
        const rawLocal = localStorage.getItem(LEADS_STORAGE_KEY)
        if (rawLocal) {
          const localLeads: LeadConsorcio[] = JSON.parse(rawLocal)
          if (Array.isArray(localLeads) && localLeads.length > 0) {
            const telefonesExistentes = new Set(records.map((r) => r.telefone))
            for (const localLead of localLeads) {
              if (localLead.telefone && !telefonesExistentes.has(localLead.telefone)) {
                try {
                  const created = await pb.collection('leads').create({
                    nome: localLead.nome,
                    telefone: localLead.telefone,
                    objetivo: localLead.objetivo,
                    tipoBem: localLead.tipoBem,
                    faixaValor: localLead.faixaValor,
                    prazoContemplacao: localLead.prazoContemplacao,
                    parcelaOrcamento: localLead.parcelaOrcamento,
                    urgencia: localLead.urgencia,
                    melhorHorarioContato: localLead.melhorHorarioContato || '',
                    creditoEstimado: localLead.creditoEstimado,
                    origem: localLead.origem || 'diagnostico',
                    status: localLead.status || 'novo',
                  })
                  records.unshift(created)
                } catch (e) {
                  console.warn('Não foi possível migrar lead local:', e)
                }
              }
            }
            // Limpa o localStorage após tentativa de migração
            localStorage.removeItem(LEADS_STORAGE_KEY)
          }
        }
      } catch (e) {
        console.warn('Erro ao verificar leads do localStorage:', e)
      }

      return records.map(recordToLead)
    } catch (err) {
      console.error('Erro ao buscar leads do PocketBase:', err)
      // Se a chamada falhar (por exemplo, token expirado ou offline), tenta ler do cache local
      try {
        const cached = localStorage.getItem(LEADS_STORAGE_KEY)
        if (cached) return JSON.parse(cached)
      } catch {
        /* intentionally ignored */
      }
      return []
    }
  },

  /**
   * Salva lead no PocketBase real (criado a partir do formulário de diagnóstico).
   * Permite criação anônima via createRule = "".
   */
  async salvarLead(lead: Omit<LeadConsorcio, 'id' | 'criadoEm'>): Promise<LeadConsorcio> {
    try {
      const record = await pb.collection('leads').create({
        nome: lead.nome,
        telefone: lead.telefone,
        objetivo: lead.objetivo || '',
        tipoBem: lead.tipoBem || '',
        faixaValor: lead.faixaValor || '',
        prazoContemplacao: lead.prazoContemplacao || '',
        parcelaOrcamento: lead.parcelaOrcamento || '',
        urgencia: lead.urgencia || '',
        melhorHorarioContato: lead.melhorHorarioContato || '',
        creditoEstimado: lead.creditoEstimado ?? null,
        origem: captureOrigemParam() || lead.origem || 'diagnostico',
        status: lead.status || 'novo',
      })
      return recordToLead(record)
    } catch (err) {
      console.error('Erro ao salvar lead no PocketBase:', err)
      // Fallback de contingência no localStorage caso haja indisponibilidade temporária de rede
      const fallbackLead: LeadConsorcio = {
        ...lead,
        id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        criadoEm: new Date().toISOString(),
        status: lead.status || 'novo',
      }
      try {
        const raw = localStorage.getItem(LEADS_STORAGE_KEY)
        const leads: LeadConsorcio[] = raw ? JSON.parse(raw) : []
        localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify([fallbackLead, ...leads]))
      } catch {
        /* intentionally ignored */
      }
      return fallbackLead
    }
  },

  /**
   * Atualiza o status do lead no PocketBase (ex: novo -> em_atendimento -> ganho -> perdido)
   */
  async atualizarStatus(id: string, status: LeadConsorcio['status']): Promise<void> {
    try {
      await pb.collection('leads').update(id, { status })
    } catch (err) {
      console.error('Erro ao atualizar status do lead no PocketBase:', err)
      throw err
    }
  },

  /**
   * Remove um lead do PocketBase
   */
  async removerLead(id: string): Promise<void> {
    try {
      await pb.collection('leads').delete(id)
    } catch (err) {
      console.error('Erro ao remover lead no PocketBase:', err)
      throw err
    }
  },

  /**
   * Exporta a lista de leads em formato CSV compatível com Excel
   */
  exportarCSV(leads: LeadConsorcio[]): void {
    const cabecalhos = [
      'Data/Hora',
      'Nome',
      'WhatsApp/Telefone',
      'Melhor Horário para Contato',
      'Objetivo',
      'Tipo de Bem',
      'Faixa de Valor',
      'Contemplação/Prazo',
      'Parcela',
      'Urgência',
      'Status',
    ]

    const linhas = leads.map((l) => [
      new Date(l.criadoEm).toLocaleString('pt-BR'),
      `"${(l.nome || '').replace(/"/g, '""')}"`,
      `"${(l.telefone || '').replace(/"/g, '""')}"`,
      `"${(l.melhorHorarioContato || 'Não informado').replace(/"/g, '""')}"`,
      `"${(l.objetivo || '').replace(/"/g, '""')}"`,
      `"${(l.tipoBem || '').replace(/"/g, '""')}"`,
      `"${(l.faixaValor || '').replace(/"/g, '""')}"`,
      `"${(l.prazoContemplacao || '').replace(/"/g, '""')}"`,
      `"${(l.parcelaOrcamento || '').replace(/"/g, '""')}"`,
      `"${(l.urgencia || '').replace(/"/g, '""')}"`,
      `"${(l.status || 'novo').replace(/"/g, '""')}"`,
    ])

    const csvContent =
      '\uFEFF' + [cabecalhos.join(';'), ...linhas.map((row) => row.join(';'))].join('\r\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    const dataHoje = new Date().toISOString().split('T')[0]
    link.setAttribute('download', `leads_consorcio_c_consulting_${dataHoje}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  },
}

export const AuthService = {
  /**
   * Retorna o usuário logado atualmente no PocketBase via authStore
   */
  getUsuarioAtual(): AdminUser | null {
    if (pb.authStore.isValid && pb.authStore.record) {
      const model = pb.authStore.record
      const email = model.email || ''
      const role =
        model.role === 'admin' || email === 'luiz.guilherme@cconsultingroup.com.br'
          ? 'admin'
          : 'consultor'
      return {
        id: model.id,
        nome: model.name || 'Parceiro C Consulting',
        email: email,
        role: role,
        criadoEm: model.created,
      }
    }
    return null
  },

  /**
   * Autenticação real no PocketBase com e-mail e senha
   */
  async login(
    email: string,
    senha?: string,
  ): Promise<{ sucesso: boolean; mensagem?: string; user?: AdminUser }> {
    const emailLimpo = email.trim().toLowerCase()
    const senhaFinal = senha || ''

    try {
      const authData = await pb.collection('users').authWithPassword(emailLimpo, senhaFinal)
      const role =
        authData.record.role === 'admin' ||
        authData.record.email === 'luiz.guilherme@cconsultingroup.com.br'
          ? 'admin'
          : 'consultor'
      const user: AdminUser = {
        id: authData.record.id,
        nome: authData.record.name || 'Guilherme Bravo',
        email: authData.record.email,
        role: role,
        criadoEm: authData.record.created,
      }
      return { sucesso: true, user }
    } catch (err: any) {
      console.error('Falha na autenticação PocketBase:', err)
      const mensagemErro =
        err?.status === 400
          ? 'E-mail ou senha incorretos. Verifique suas credenciais de acesso ou solicite redefinição ao administrador.'
          : err?.message || 'Erro ao realizar login. Verifique sua conexão e credenciais.'
      return {
        sucesso: false,
        mensagem: mensagemErro,
      }
    }
  },

  /**
   * Solicita redefinição de senha real via PocketBase (requestPasswordReset)
   */
  async solicitarRedefinicaoSenha(
    email: string,
  ): Promise<{ sucesso: boolean; mensagem: string; requerSmtp?: boolean }> {
    const emailLimpo = email.trim().toLowerCase()
    try {
      await pb.collection('users').requestPasswordReset(emailLimpo)
      return {
        sucesso: true,
        mensagem: `E-mail de redefinição solicitado para ${emailLimpo}. Se o servidor SMTP estiver ativo no painel, o link chegará em instantes.`,
      }
    } catch (err: any) {
      console.warn('Erro na solicitação de reset via PocketBase:', err)
      // Se falhar porque SMTP não está configurado no servidor, explicamos claramente
      const detalhe = err?.data?.message || err?.message || ''
      const isSmtpIssue =
        detalhe.toLowerCase().includes('mail') ||
        detalhe.toLowerCase().includes('smtp') ||
        err?.status === 400 ||
        err?.status === 500

      return {
        sucesso: false,
        requerSmtp: isSmtpIssue,
        mensagem: isSmtpIssue
          ? `O endpoint nativo de redefinição do PocketBase foi acionado, porém o Skip Cloud requer a configuração de SMTP (servidor de e-mail) no painel administrativo para disparar a mensagem externa.`
          : `Não foi possível enviar a solicitação: ${detalhe || 'verifique o e-mail informado.'}`,
      }
    }
  },

  /**
   * Confirma redefinição com token recebido por e-mail ou gerado pelo PocketBase
   */
  async confirmarRedefinicaoSenha(
    token: string,
    novaSenha: string,
  ): Promise<{ sucesso: boolean; mensagem: string }> {
    try {
      await pb.collection('users').confirmPasswordReset(token, novaSenha, novaSenha)
      return {
        sucesso: true,
        mensagem: 'Senha redefinida com sucesso! Você já pode entrar com a nova senha.',
      }
    } catch (err: any) {
      return {
        sucesso: false,
        mensagem: err?.message || 'Token de redefinição inválido ou expirado.',
      }
    }
  },

  /**
   * Finaliza sessão do usuário
   */
  logout(): void {
    pb.authStore.clear()
  },

  /**
   * Gestão de consultores pelo Administrador Guilherme (sem requerer envio de e-mail)
   */
  async listarConsultores(): Promise<ConsultorItem[]> {
    try {
      const res = await pb.send<{ items: ConsultorItem[] }>('/backend/v1/ccg/consultores', {
        method: 'GET',
      })
      return res.items || []
    } catch (err) {
      console.error('Erro ao listar consultores:', err)
      throw err
    }
  },

  async criarConsultor(dados: {
    nome: string
    email: string
    senhaInicial: string
  }): Promise<{ sucesso: boolean; mensagem: string; id?: string }> {
    try {
      const res = await pb.send<{ mensagem: string; id: string }>('/backend/v1/ccg/consultores', {
        method: 'POST',
        body: {
          name: dados.nome.trim(),
          email: dados.email.trim().toLowerCase(),
          password: dados.senhaInicial.trim(),
        },
      })
      return {
        sucesso: true,
        mensagem: res.mensagem || 'Consultor cadastrado com sucesso!',
        id: res.id,
      }
    } catch (err: any) {
      console.error('Erro ao criar consultor:', err)
      const msg = err?.data?.message || err?.message || 'Não foi possível cadastrar o consultor.'
      return { sucesso: false, mensagem: msg }
    }
  },

  async redefinirSenhaConsultor(
    userId: string,
    novaSenha: string,
  ): Promise<{ sucesso: boolean; mensagem: string }> {
    try {
      const res = await pb.send<{ mensagem: string; sucesso: boolean }>(
        '/backend/v1/ccg/consultores/reset-password',
        {
          method: 'POST',
          body: {
            userId,
            newPassword: novaSenha.trim(),
          },
        },
      )
      return {
        sucesso: true,
        mensagem: res.mensagem || 'Senha redefinida com sucesso!',
      }
    } catch (err: any) {
      console.error('Erro ao redefinir senha do consultor:', err)
      const msg = err?.data?.message || err?.message || 'Não foi possível redefinir a senha.'
      return { sucesso: false, mensagem: msg }
    }
  },

  async excluirConsultor(userId: string): Promise<{ sucesso: boolean; mensagem: string }> {
    try {
      const res = await pb.send<{ mensagem: string; sucesso: boolean }>(
        `/backend/v1/ccg/consultores/${encodeURIComponent(userId)}`,
        {
          method: 'DELETE',
        },
      )
      return {
        sucesso: true,
        mensagem: res.mensagem || 'Consultor removido com sucesso.',
      }
    } catch (err: any) {
      console.error('Erro ao excluir consultor:', err)
      const msg = err?.data?.message || err?.message || 'Não foi possível excluir o consultor.'
      return { sucesso: false, mensagem: msg }
    }
  },
}
