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
  creditoEstimado?: number
  origem?: 'diagnostico' | 'simulador' | 'site'
  status?: 'novo' | 'em_atendimento' | 'ganho' | 'perdido'
}

export interface AdminUser {
  id: string
  nome: string
  email: string
  criadoEm: string
}

const LEADS_STORAGE_KEY = 'ccg_leads_db_v1'
const ADMIN_AUTH_KEY = 'ccg_admin_session_v1'
const ADMIN_USERS_KEY = 'ccg_admin_users_v1'

const ADMIN_DEFAULT: AdminUser = {
  id: 'admin_guilherme',
  nome: 'Guilherme Bravo',
  email: 'luiz.guilherme@cconsultingroup.com.br',
  criadoEm: '2026-05-01T00:00:00.000Z',
}

// Seed inicial caso não existam leads cadastrados, para que o parceiro possa ver e testar a exportação imediatamente
const SEED_LEADS: LeadConsorcio[] = [
  {
    id: 'lead_seed_1',
    criadoEm: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    nome: 'Carlos Eduardo Mendes',
    telefone: '(81) 99876-5432',
    objetivo: 'Comprar um bem',
    tipoBem: 'Imóvel',
    faixaValor: 'R$ 150 mil a R$ 500 mil',
    prazoContemplacao: 'O quanto antes (lance)',
    parcelaOrcamento: 'R$ 1.500 a R$ 5.000',
    urgencia: 'Este mês',
    creditoEstimado: 300000,
    origem: 'diagnostico',
    status: 'novo',
  },
  {
    id: 'lead_seed_2',
    criadoEm: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    nome: 'Mariana Silveira',
    telefone: '(81) 98123-4567',
    objetivo: 'Trocar de bem',
    tipoBem: 'Carro',
    faixaValor: 'R$ 50 mil a R$ 150 mil',
    prazoContemplacao: '12 a 24 meses',
    parcelaOrcamento: 'R$ 500 a R$ 1.500',
    urgencia: 'Esta semana',
    creditoEstimado: 100000,
    origem: 'diagnostico',
    status: 'em_atendimento',
  },
]

export const LeadService = {
  getLeads(): LeadConsorcio[] {
    try {
      const data = localStorage.getItem(LEADS_STORAGE_KEY)
      if (!data) {
        localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(SEED_LEADS))
        return SEED_LEADS
      }
      return JSON.parse(data)
    } catch (err) {
      console.error('Erro ao ler leads do storage:', err)
      return []
    }
  },

  salvarLead(lead: Omit<LeadConsorcio, 'id' | 'criadoEm'>): LeadConsorcio {
    const leads = this.getLeads()
    const novoLead: LeadConsorcio = {
      ...lead,
      id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      criadoEm: new Date().toISOString(),
      status: 'novo',
    }
    const atualizados = [novoLead, ...leads]
    try {
      localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(atualizados))
    } catch (err) {
      console.error('Erro ao salvar lead:', err)
    }
    return novoLead
  },

  atualizarStatus(id: string, status: LeadConsorcio['status']): void {
    const leads = this.getLeads()
    const atualizados = leads.map((l) => (l.id === id ? { ...l, status } : l))
    try {
      localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(atualizados))
    } catch (err) {
      console.error('Erro ao atualizar status do lead:', err)
    }
  },

  removerLead(id: string): void {
    const leads = this.getLeads()
    const atualizados = leads.filter((l) => l.id !== id)
    try {
      localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(atualizados))
    } catch (err) {
      console.error('Erro ao remover lead:', err)
    }
  },

  exportarCSV(leads: LeadConsorcio[]): void {
    const cabecalhos = [
      'Data/Hora',
      'Nome',
      'WhatsApp/Telefone',
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
  getAdminCadastrado(): AdminUser {
    try {
      const data = localStorage.getItem(ADMIN_USERS_KEY)
      if (!data) {
        localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(ADMIN_DEFAULT))
        return ADMIN_DEFAULT
      }
      return JSON.parse(data)
    } catch {
      return ADMIN_DEFAULT
    }
  },

  getUsuarioAtual(): AdminUser | null {
    try {
      const data = localStorage.getItem(ADMIN_AUTH_KEY)
      if (!data) return null
      return JSON.parse(data)
    } catch {
      return null
    }
  },

  login(email: string, senha?: string): { sucesso: boolean; mensagem?: string; user?: AdminUser } {
    const admin = this.getAdminCadastrado()
    const emailNormalizado = email.trim().toLowerCase()
    const emailAdmin = admin.email.toLowerCase()

    if (emailNormalizado !== emailAdmin) {
      return {
        sucesso: false,
        mensagem:
          'E-mail não autorizado para a Área do Parceiro. Apenas administradores credenciados podem acessar.',
      }
    }

    // Se a senha foi informada ou senha provisória padrão
    // Armazena sessão
    localStorage.setItem(ADMIN_AUTH_KEY, JSON.stringify(admin))
    return { sucesso: true, user: admin }
  },

  solicitarRedefinicaoSenha(email: string): {
    sucesso: boolean
    mensagem: string
    tokenSimulado?: string
  } {
    const admin = this.getAdminCadastrado()
    const emailNormalizado = email.trim().toLowerCase()
    const emailAdmin = admin.email.toLowerCase()

    if (emailNormalizado !== emailAdmin) {
      return {
        sucesso: false,
        mensagem: 'E-mail não localizado no cadastro de parceiros credenciados.',
      }
    }

    const tokenSimulado = Math.random().toString(36).substring(2, 8).toUpperCase()
    return {
      sucesso: true,
      mensagem: `Link e instruções de redefinição enviados com sucesso para ${admin.email}.`,
      tokenSimulado,
    }
  },

  logout(): void {
    localStorage.removeItem(ADMIN_AUTH_KEY)
  },
}
