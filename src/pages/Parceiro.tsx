import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AuthService, LeadService, LeadConsorcio, AdminUser } from '@/services/leadService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'

const AZUL = '#0A1F38'
const LOGO_C_CONSULTING =
  'https://dagtlwojkqyivnjgveda.supabase.co/storage/v1/object/public/message-attachments/471e33d4-fd07-48e7-9f0e-b0d44a66c54f/consulting-group-azul-png-2-2-8e0d7.png'

export default function ParceiroPage() {
  const [searchParams] = useSearchParams()
  const tokenUrl = searchParams.get('token')

  const [user, setUser] = useState<AdminUser | null>(null)
  const [emailInput, setEmailInput] = useState('luiz.guilherme@cconsultingroup.com.br')
  const [senhaInput, setSenhaInput] = useState('')
  const [carregandoLogin, setCarregandoLogin] = useState(false)
  const [carregandoLeads, setCarregandoLeads] = useState(false)
  const [erroLogin, setErroLogin] = useState<string | null>(null)
  const [leads, setLeads] = useState<LeadConsorcio[]>([])
  const [filtroTexto, setFiltroTexto] = useState('')
  const [filtroBem, setFiltroBem] = useState('todos')
  const [filtroStatus, setFiltroStatus] = useState('todos')

  // Modal Esqueci Minha Senha / Redefinição
  const [modalResetAberto, setModalResetAberto] = useState(Boolean(tokenUrl))
  const [emailReset, setEmailReset] = useState('luiz.guilherme@cconsultingroup.com.br')
  const [tokenResetInput, setTokenResetInput] = useState(tokenUrl || '')
  const [novaSenha, setNovaSenha] = useState('')
  const [etapaReset, setEtapaReset] = useState<'solicitar' | 'confirmar'>(
    tokenUrl ? 'confirmar' : 'solicitar',
  )
  const [enviandoReset, setEnviandoReset] = useState(false)
  const [mensagemReset, setMensagemReset] = useState<{
    tipo: 'sucesso' | 'erro' | 'aviso'
    texto: string
  } | null>(null)

  // Modal Detalhes do Lead
  const [leadSelecionado, setLeadSelecionado] = useState<LeadConsorcio | null>(null)

  const carregarLeads = async () => {
    setCarregandoLeads(true)
    try {
      const dados = await LeadService.getLeads()
      setLeads(dados)
    } catch (err) {
      console.error('Erro ao listar leads:', err)
    } finally {
      setCarregandoLeads(false)
    }
  }

  useEffect(() => {
    const session = AuthService.getUsuarioAtual()
    if (session) {
      setUser(session)
      carregarLeads()
    }
  }, [])

  // Sincroniza se o token vier na URL (ex.: usuário clicou no link recebido no e-mail)
  useEffect(() => {
    if (tokenUrl) {
      setTokenResetInput(tokenUrl)
      setEtapaReset('confirmar')
      setModalResetAberto(true)
    }
  }, [tokenUrl])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErroLogin(null)
    setCarregandoLogin(true)
    try {
      const res = await AuthService.login(emailInput, senhaInput)
      if (res.sucesso && res.user) {
        setUser(res.user)
        await carregarLeads()
      } else {
        setErroLogin(res.mensagem || 'E-mail ou senha inválidos.')
      }
    } finally {
      setCarregandoLogin(false)
    }
  }

  const handleLogout = () => {
    AuthService.logout()
    setUser(null)
    setLeads([])
  }

  const handleSolicitarReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setMensagemReset(null)
    setEnviandoReset(true)
    try {
      const res = await AuthService.solicitarRedefinicaoSenha(emailReset)
      if (res.sucesso) {
        setMensagemReset({ tipo: 'sucesso', texto: res.mensagem })
      } else if (res.requerSmtp) {
        setMensagemReset({
          tipo: 'aviso',
          texto: res.mensagem,
        })
      } else {
        setMensagemReset({ tipo: 'erro', texto: res.mensagem })
      }
    } finally {
      setEnviandoReset(false)
    }
  }

  const handleConfirmarReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setMensagemReset(null)
    if (!tokenResetInput.trim()) {
      setMensagemReset({ tipo: 'erro', texto: 'Informe o token recebido no e-mail.' })
      return
    }
    if (novaSenha.length < 8) {
      setMensagemReset({ tipo: 'erro', texto: 'A nova senha deve ter no mínimo 8 caracteres.' })
      return
    }

    setEnviandoReset(true)
    try {
      const res = await AuthService.confirmarRedefinicaoSenha(tokenResetInput.trim(), novaSenha)
      if (res.sucesso) {
        setMensagemReset({ tipo: 'sucesso', texto: res.mensagem })
        setSenhaInput(novaSenha)
        setTimeout(() => {
          setModalResetAberto(false)
          setEtapaReset('solicitar')
        }, 2500)
      } else {
        setMensagemReset({ tipo: 'erro', texto: res.mensagem })
      }
    } finally {
      setEnviandoReset(false)
    }
  }

  const handleAtualizarStatus = async (id: string, novoStatus: LeadConsorcio['status']) => {
    // Atualização otimista
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: novoStatus } : l)))
    if (leadSelecionado && leadSelecionado.id === id) {
      setLeadSelecionado((prev) => (prev ? { ...prev, status: novoStatus } : null))
    }
    try {
      await LeadService.atualizarStatus(id, novoStatus)
    } catch {
      await carregarLeads()
    }
  }

  const handleExcluirLead = async (id: string) => {
    if (window.confirm('Tem certeza que deseja remover este lead do banco de dados?')) {
      setLeads((prev) => prev.filter((l) => l.id !== id))
      if (leadSelecionado?.id === id) setLeadSelecionado(null)
      try {
        await LeadService.removerLead(id)
      } catch {
        await carregarLeads()
      }
    }
  }

  const leadsFiltrados = leads.filter((lead) => {
    const bateTexto =
      !filtroTexto ||
      lead.nome?.toLowerCase().includes(filtroTexto.toLowerCase()) ||
      lead.telefone?.includes(filtroTexto) ||
      lead.objetivo?.toLowerCase().includes(filtroTexto.toLowerCase())
    const bateBem = filtroBem === 'todos' || lead.tipoBem?.toLowerCase() === filtroBem.toLowerCase()
    const bateStatus = filtroStatus === 'todos' || (lead.status || 'novo') === filtroStatus
    return bateTexto && bateBem && bateStatus
  })

  // Se não estiver logado, exibe tela de login
  if (!user) {
    return (
      <div className="min-h-screen bg-[#f3f6f9] flex flex-col justify-between">
        {/* Cabeçalho simples */}
        <header className="border-b border-gray-200 bg-white shadow-sm">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex items-center rounded-md bg-white p-1">
                <img
                  src={LOGO_C_CONSULTING}
                  alt="C Consulting Group"
                  className="h-9 w-auto object-contain"
                />
              </div>
            </Link>
            <Link to="/" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              ← Voltar ao site
            </Link>
          </div>
        </header>

        {/* Card de Login */}
        <div className="mx-auto w-full max-w-md px-4 py-12">
          <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
            <div className="text-center">
              <div
                className="mx-auto flex h-12 w-12 items-center justify-center rounded-full text-white text-xl font-bold"
                style={{ background: AZUL }}
              >
                🔐
              </div>
              <h1 className="mt-4 text-2xl font-bold" style={{ color: AZUL }}>
                Área do Parceiro
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Acesso exclusivo para administradores e consultores credenciados da C Consulting
                Group.
              </p>
            </div>

            {/* Status do Backend PocketBase Conectado */}
            <div className="mt-5 rounded border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900">
              <p className="font-semibold flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
                Backend PocketBase Ativo (Skip Cloud)
              </p>
              <p className="mt-1 text-[11px] text-emerald-800 leading-relaxed">
                Autenticação e leads integrados diretamente com o banco de dados. Os novos leads do
                diagnóstico caem nesta área em tempo real.
              </p>
            </div>

            {erroLogin && (
              <div className="mt-4 rounded bg-red-50 p-3 text-xs font-medium text-red-700 border border-red-200">
                {erroLogin}
              </div>
            )}

            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <div>
                <Label htmlFor="login-email" className="text-xs font-semibold text-gray-700">
                  E-mail corporativo
                </Label>
                <Input
                  id="login-email"
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="luiz.guilherme@cconsultingroup.com.br"
                  className="mt-1"
                />
                <p className="mt-1 text-[11px] text-gray-400">
                  Administrador: <strong>luiz.guilherme@cconsultingroup.com.br</strong>
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="login-senha" className="text-xs font-semibold text-gray-700">
                    Senha de acesso
                  </Label>
                  <button
                    type="button"
                    onClick={() => {
                      setMensagemReset(null)
                      setEmailReset(emailInput)
                      setModalResetAberto(true)
                    }}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Esqueci minha senha
                  </button>
                </div>
                <Input
                  id="login-senha"
                  type="password"
                  value={senhaInput}
                  onChange={(e) => setSenhaInput(e.target.value)}
                  placeholder="Digite sua senha de acesso"
                  className="mt-1"
                />
                <p className="mt-1 text-[11px] text-gray-400">
                  Primeiro acesso do Guilherme? A senha inicial é{' '}
                  <code className="font-mono bg-gray-100 px-1 py-0.5 rounded text-gray-700">
                    CConsulting@2026
                  </code>
                  .
                </p>
              </div>

              <Button
                type="submit"
                disabled={carregandoLogin}
                className="w-full rounded-sm font-semibold text-white shadow-sm"
                style={{ background: AZUL }}
              >
                {carregandoLogin ? 'Autenticando no banco...' : 'Entrar na Área do Parceiro'}
              </Button>
            </form>

            <div className="mt-6 border-t border-gray-100 pt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  setMensagemReset(null)
                  setEmailReset(emailInput)
                  setModalResetAberto(true)
                }}
                className="text-xs text-gray-500 hover:text-gray-800"
              >
                Precisa redefinir sua senha por e-mail? Clique aqui
              </button>
            </div>
          </div>
        </div>

        {/* Modal de Redefinição de Senha */}
        <Dialog open={modalResetAberto} onOpenChange={setModalResetAberto}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle style={{ color: AZUL }}>Redefinir senha do parceiro</DialogTitle>
              <DialogDescription className="text-xs text-gray-500">
                {etapaReset === 'solicitar'
                  ? 'Informe seu e-mail de login para disparar as instruções de redefinição via PocketBase.'
                  : 'Digite o token recebido no seu e-mail e escolha uma nova senha.'}
              </DialogDescription>
            </DialogHeader>

            {etapaReset === 'solicitar' ? (
              <form onSubmit={handleSolicitarReset} className="space-y-4 pt-2">
                <div>
                  <Label htmlFor="reset-email" className="text-xs font-medium">
                    E-mail corporativo cadastrado
                  </Label>
                  <Input
                    id="reset-email"
                    type="email"
                    required
                    value={emailReset}
                    onChange={(e) => setEmailReset(e.target.value)}
                    placeholder="luiz.guilherme@cconsultingroup.com.br"
                    className="mt-1"
                  />
                </div>

                {mensagemReset && (
                  <div
                    className={`rounded p-3 text-xs leading-relaxed ${
                      mensagemReset.tipo === 'sucesso'
                        ? 'bg-green-50 text-green-800 border border-green-200'
                        : mensagemReset.tipo === 'aviso'
                          ? 'bg-amber-50 text-amber-900 border border-amber-200'
                          : 'bg-red-50 text-red-800 border border-red-200'
                    }`}
                  >
                    {mensagemReset.texto}
                  </div>
                )}

                <div className="rounded bg-blue-50/70 p-2.5 text-[11px] text-blue-900 border border-blue-100 space-y-1">
                  <p className="font-semibold">ℹ️ Como funciona a redefinição nativa:</p>
                  <p>
                    O backend PocketBase dispara um token seguro para o e-mail cadastrado. Quando
                    você receber o link ou token, clique abaixo para inserir a nova senha.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setEtapaReset('confirmar')}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Já tenho um token de redefinição
                  </button>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setModalResetAberto(false)}
                    >
                      Fechar
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      disabled={enviandoReset}
                      style={{ background: AZUL }}
                      className="text-white"
                    >
                      {enviandoReset ? 'Enviando...' : 'Enviar link de redefinição'}
                    </Button>
                  </div>
                </div>
              </form>
            ) : (
              <form onSubmit={handleConfirmarReset} className="space-y-4 pt-2">
                <div>
                  <Label htmlFor="reset-token" className="text-xs font-medium">
                    Token de segurança (recebido por e-mail)
                  </Label>
                  <Input
                    id="reset-token"
                    type="text"
                    required
                    value={tokenResetInput}
                    onChange={(e) => setTokenResetInput(e.target.value)}
                    placeholder="Cole o token do e-mail"
                    className="mt-1 font-mono text-xs"
                  />
                </div>

                <div>
                  <Label htmlFor="nova-senha" className="text-xs font-medium">
                    Nova senha (mínimo 8 caracteres)
                  </Label>
                  <Input
                    id="nova-senha"
                    type="password"
                    required
                    minLength={8}
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    placeholder="Digite sua nova senha"
                    className="mt-1"
                  />
                </div>

                {mensagemReset && (
                  <div
                    className={`rounded p-3 text-xs ${
                      mensagemReset.tipo === 'sucesso'
                        ? 'bg-green-50 text-green-800 border border-green-200'
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}
                  >
                    {mensagemReset.texto}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMensagemReset(null)
                      setEtapaReset('solicitar')
                    }}
                    className="text-xs text-gray-500 hover:text-gray-800"
                  >
                    ← Voltar para envio
                  </button>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setModalResetAberto(false)}
                    >
                      Fechar
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      disabled={enviandoReset}
                      style={{ background: AZUL }}
                      className="text-white"
                    >
                      {enviandoReset ? 'Salvando...' : 'Definir nova senha'}
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* Rodapé simples */}
        <footer className="py-4 text-center text-xs text-gray-400">
          C Consulting Group · Gestão de Leads com PocketBase (Skip Cloud)
        </footer>
      </div>
    )
  }

  // Visualização com usuário logado
  return (
    <div className="min-h-screen bg-[#f3f6f9]">
      {/* Topo do Painel */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center">
              <img
                src={LOGO_C_CONSULTING}
                alt="C Consulting Group"
                className="h-8 w-auto object-contain"
              />
            </Link>
            <div className="hidden sm:block border-l border-gray-200 pl-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold" style={{ color: AZUL }}>
                  Painel do Parceiro
                </span>
                <Badge
                  variant="secondary"
                  className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200"
                >
                  ● Banco PocketBase Conectado
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-semibold text-gray-800">{user.nome}</div>
              <div className="text-[11px] text-gray-500">{user.email}</div>
            </div>
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-xs text-gray-600">
                Ver Site
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="text-xs text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
            >
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Banner de Boas-vindas e Ações */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold" style={{ color: AZUL }}>
                  Leads de Consórcio
                </h1>
                <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
                  {leads.length} {leads.length === 1 ? 'lead no banco' : 'leads no banco'}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-600">
                Todo cliente que responde o diagnóstico no site é cadastrado automaticamente no
                banco de dados e sincronizado aqui.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={carregarLeads}
                disabled={carregandoLeads}
                className="text-xs text-gray-700"
              >
                {carregandoLeads ? 'Atualizando...' : '🔄 Atualizar'}
              </Button>
              <Button
                onClick={() => LeadService.exportarCSV(leadsFiltrados)}
                className="gap-2 text-white font-medium shadow-sm"
                style={{ background: '#107c41' }} // Verde Excel
              >
                <span>📥</span> Exportar Leads (Excel / CSV)
              </Button>
            </div>
          </div>

          {/* Barra de filtros */}
          <div className="mt-6 grid grid-cols-1 gap-3 border-t border-gray-100 pt-4 sm:grid-cols-4">
            <div className="sm:col-span-2">
              <Input
                placeholder="Buscar por nome, telefone ou objetivo..."
                value={filtroTexto}
                onChange={(e) => setFiltroTexto(e.target.value)}
                className="h-9 text-xs"
              />
            </div>
            <div>
              <select
                value={filtroBem}
                onChange={(e) => setFiltroBem(e.target.value)}
                className="h-9 w-full rounded-md border border-gray-200 bg-white px-3 text-xs text-gray-700 shadow-sm"
              >
                <option value="todos">Todos os tipos de bem</option>
                <option value="imóvel">Imóvel</option>
                <option value="carro">Carro</option>
                <option value="moto">Moto</option>
                <option value="serviços / outro">Serviços / outro</option>
              </select>
            </div>
            <div>
              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className="h-9 w-full rounded-md border border-gray-200 bg-white px-3 text-xs text-gray-700 shadow-sm"
              >
                <option value="todos">Todos os status</option>
                <option value="novo">Novo</option>
                <option value="em_atendimento">Em Atendimento</option>
                <option value="ganho">Fechado / Ganho</option>
                <option value="perdido">Perdido</option>
              </select>
            </div>
          </div>
        </div>

        {/* Listagem de Leads */}
        <div className="mt-6 rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
          {leadsFiltrados.length === 0 ? (
            <div className="py-16 text-center">
              <div className="text-4xl">📋</div>
              <h3 className="mt-3 text-base font-bold text-gray-700">Nenhum lead encontrado</h3>
              <p className="mt-1 text-sm text-gray-500">
                {leads.length === 0
                  ? 'Ainda não há respostas no diagnóstico. Os novos leads aparecerão aqui em tempo real.'
                  : 'Nenhum lead corresponde aos filtros selecionados.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-gray-200 bg-gray-50 text-gray-600 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Data/Hora</th>
                    <th className="py-3 px-4">Cliente</th>
                    <th className="py-3 px-4">WhatsApp</th>
                    <th className="py-3 px-4">Bem & Valor</th>
                    <th className="py-3 px-4">Contemplação / Prazo</th>
                    <th className="py-3 px-4">Parcela Desejada</th>
                    <th className="py-3 px-4">Urgência</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {leadsFiltrados.map((lead) => {
                    const dataFormatada = new Date(lead.criadoEm).toLocaleString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                    const whatsNumero = lead.telefone.replace(/\D/g, '')

                    return (
                      <tr key={lead.id} className="hover:bg-blue-50/40 transition-colors">
                        <td className="py-3 px-4 whitespace-nowrap text-gray-500 font-mono text-[11px]">
                          {dataFormatada}
                        </td>
                        <td className="py-3 px-4 font-semibold text-gray-900 whitespace-nowrap">
                          {lead.nome || 'Não informado'}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {lead.telefone ? (
                            <a
                              href={`https://wa.me/55${whatsNumero}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 font-medium text-emerald-700 hover:text-emerald-800 hover:underline"
                            >
                              <span>💬</span> {lead.telefone}
                            </a>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-gray-900">{lead.tipoBem}</span>
                          <span className="block text-[11px] text-gray-500">{lead.faixaValor}</span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{lead.prazoContemplacao}</td>
                        <td className="py-3 px-4 font-medium text-gray-800">
                          {lead.parcelaOrcamento}
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-block rounded bg-gray-100 px-2 py-0.5 text-[10px] text-gray-700">
                            {lead.urgencia}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={lead.status || 'novo'}
                            onChange={(e) =>
                              handleAtualizarStatus(
                                lead.id,
                                e.target.value as LeadConsorcio['status'],
                              )
                            }
                            className={`rounded border px-2 py-1 text-[11px] font-medium shadow-sm ${
                              (lead.status || 'novo') === 'novo'
                                ? 'border-blue-300 bg-blue-50 text-blue-800'
                                : lead.status === 'em_atendimento'
                                  ? 'border-amber-300 bg-amber-50 text-amber-800'
                                  : lead.status === 'ganho'
                                    ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                                    : 'border-gray-300 bg-gray-100 text-gray-600'
                            }`}
                          >
                            <option value="novo">Novo</option>
                            <option value="em_atendimento">Em Atendimento</option>
                            <option value="ganho">Fechado / Ganho</option>
                            <option value="perdido">Perdido</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs text-blue-700 hover:text-blue-900"
                            onClick={() => setLeadSelecionado(lead)}
                          >
                            Ver detalhes
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs text-red-500 hover:text-red-700"
                            onClick={() => handleExcluirLead(lead.id)}
                          >
                            ✕
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Modal de Detalhes do Lead */}
      <Dialog
        open={Boolean(leadSelecionado)}
        onOpenChange={(aberto) => !aberto && setLeadSelecionado(null)}
      >
        {leadSelecionado && (
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle style={{ color: AZUL }}>Detalhes do Lead de Consórcio</DialogTitle>
              <DialogDescription className="text-xs text-gray-500">
                Respostas completas fornecidas no diagnóstico do site e salvas no PocketBase
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-2 text-xs">
              <div className="grid grid-cols-2 gap-3 rounded bg-gray-50 p-4 border border-gray-100">
                <div>
                  <span className="font-semibold text-gray-500 block">Nome do Cliente:</span>
                  <span className="text-sm font-bold text-gray-900">{leadSelecionado.nome}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-500 block">WhatsApp:</span>
                  <span className="text-sm font-bold text-emerald-700">
                    {leadSelecionado.telefone}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-gray-500 block">Data de Cadastro:</span>
                  <span className="text-gray-700">
                    {new Date(leadSelecionado.criadoEm).toLocaleString('pt-BR')}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-gray-500 block">Status:</span>
                  <span className="capitalize font-semibold text-gray-800">
                    {leadSelecionado.status || 'novo'}
                  </span>
                </div>
              </div>

              <div className="space-y-2 border-t border-gray-200 pt-3">
                <h4 className="font-bold text-gray-800 text-sm">Respostas do Diagnóstico:</h4>
                <div className="grid grid-cols-2 gap-2 text-gray-700">
                  <div className="p-2 rounded border bg-white">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">
                      Objetivo
                    </span>
                    <span className="font-medium">{leadSelecionado.objetivo}</span>
                  </div>
                  <div className="p-2 rounded border bg-white">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">
                      Tipo de Bem
                    </span>
                    <span className="font-medium">{leadSelecionado.tipoBem}</span>
                  </div>
                  <div className="p-2 rounded border bg-white">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">
                      Faixa de Valor
                    </span>
                    <span className="font-medium">{leadSelecionado.faixaValor}</span>
                  </div>
                  <div className="p-2 rounded border bg-white">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">
                      Contemplação
                    </span>
                    <span className="font-medium">{leadSelecionado.prazoContemplacao}</span>
                  </div>
                  <div className="p-2 rounded border bg-white">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">
                      Parcela no Orçamento
                    </span>
                    <span className="font-medium">{leadSelecionado.parcelaOrcamento}</span>
                  </div>
                  <div className="p-2 rounded border bg-white">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">
                      Decisão / Urgência
                    </span>
                    <span className="font-medium">{leadSelecionado.urgencia}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-gray-200 pt-3">
                <Button variant="outline" size="sm" onClick={() => setLeadSelecionado(null)}>
                  Fechar
                </Button>
                {leadSelecionado.telefone && (
                  <a
                    href={`https://wa.me/55${leadSelecionado.telefone.replace(/\D/g, '')}?text=${encodeURIComponent(
                      `Olá ${leadSelecionado.nome}! Sou o Guilherme da C Consulting Group. Vi seu diagnóstico de consórcio para ${leadSelecionado.tipoBem} (${leadSelecionado.faixaValor}) e separei as melhores cartas da Embracon, Mapfre e Porto Seguro para você. Podemos conversar?`,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                    >
                      💬 Chamar no WhatsApp
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
