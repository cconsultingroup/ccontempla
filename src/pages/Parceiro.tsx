import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  AuthService,
  LeadService,
  LeadConsorcio,
  AdminUser,
  ConsultorItem,
} from '@/services/leadService'
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

  // Gestão de Consultores (Exclusivo Administrador)
  const [consultores, setConsultores] = useState<ConsultorItem[]>([])
  const [carregandoConsultores, setCarregandoConsultores] = useState(false)
  const [modalNovoConsultor, setModalNovoConsultor] = useState(false)
  const [novoNome, setNovoNome] = useState('')
  const [novoEmail, setNovoEmail] = useState('')
  const [novaSenhaConsultor, setNovaSenhaConsultor] = useState('')
  const [salvandoNovoConsultor, setSalvandoNovoConsultor] = useState(false)
  const [erroNovoConsultor, setErroNovoConsultor] = useState<string | null>(null)

  // Modal Redefinir Senha de Consultor (Direto pelo painel, sem SMTP)
  const [consultorParaReset, setConsultorParaReset] = useState<ConsultorItem | null>(null)
  const [senhaRedefinidaManual, setSenhaRedefinidaManual] = useState('')
  const [salvandoResetManual, setSalvandoResetManual] = useState(false)
  const [mensagemResetManual, setMensagemResetManual] = useState<{
    tipo: 'sucesso' | 'erro'
    texto: string
  } | null>(null)

  // Feedback geral de operações de consultores
  const [alertaConsultores, setAlertaConsultores] = useState<{
    tipo: 'sucesso' | 'erro'
    texto: string
  } | null>(null)

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

  const carregarConsultores = async () => {
    setCarregandoConsultores(true)
    try {
      const lista = await AuthService.listarConsultores()
      setConsultores(lista)
    } catch (err) {
      console.error('Erro ao carregar consultores:', err)
    } finally {
      setCarregandoConsultores(false)
    }
  }

  useEffect(() => {
    const session = AuthService.getUsuarioAtual()
    if (session) {
      setUser(session)
      carregarLeads()
      if (session.role === 'admin') {
        carregarConsultores()
      }
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
        if (res.user.role === 'admin') {
          await carregarConsultores()
        }
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
    setConsultores([])
  }

  const handleCriarConsultor = async (e: React.FormEvent) => {
    e.preventDefault()
    setErroNovoConsultor(null)

    if (!novoNome.trim()) {
      setErroNovoConsultor('Informe o nome completo do consultor.')
      return
    }
    if (!novoEmail.trim() || !novoEmail.includes('@')) {
      setErroNovoConsultor('Informe um e-mail válido.')
      return
    }
    if (novaSenhaConsultor.length < 8) {
      setErroNovoConsultor('A senha inicial deve conter pelo menos 8 caracteres.')
      return
    }

    setSalvandoNovoConsultor(true)
    try {
      const res = await AuthService.criarConsultor({
        nome: novoNome,
        email: novoEmail,
        senhaInicial: novaSenhaConsultor,
      })
      if (res.sucesso) {
        setAlertaConsultores({
          tipo: 'sucesso',
          texto: `Consultor ${novoNome} (${novoEmail}) cadastrado com sucesso! Senha inicial pronta para uso.`,
        })
        setNovoNome('')
        setNovoEmail('')
        setNovaSenhaConsultor('')
        setModalNovoConsultor(false)
        await carregarConsultores()
      } else {
        setErroNovoConsultor(res.mensagem)
      }
    } finally {
      setSalvandoNovoConsultor(false)
    }
  }

  const handleExecutarResetManual = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!consultorParaReset) return
    setMensagemResetManual(null)

    if (senhaRedefinidaManual.length < 8) {
      setMensagemResetManual({
        tipo: 'erro',
        texto: 'A nova senha deve ter no mínimo 8 caracteres.',
      })
      return
    }

    setSalvandoResetManual(true)
    try {
      const res = await AuthService.redefinirSenhaConsultor(
        consultorParaReset.id,
        senhaRedefinidaManual,
      )
      if (res.sucesso) {
        setMensagemResetManual({
          tipo: 'sucesso',
          texto: res.mensagem,
        })
        setAlertaConsultores({
          tipo: 'sucesso',
          texto: `Senha de ${consultorParaReset.name} redefinida com sucesso! O consultor já pode logar com a nova senha.`,
        })
        setTimeout(() => {
          setConsultorParaReset(null)
          setSenhaRedefinidaManual('')
          setMensagemResetManual(null)
        }, 1800)
      } else {
        setMensagemResetManual({ tipo: 'erro', texto: res.mensagem })
      }
    } finally {
      setSalvandoResetManual(false)
    }
  }

  const handleExcluirConsultor = async (consultor: ConsultorItem) => {
    if (consultor.email === 'luiz.guilherme@cconsultingroup.com.br') {
      alert('Não é permitido excluir a conta do administrador principal.')
      return
    }
    if (user && consultor.id === user.id) {
      alert('Você não pode excluir sua própria conta.')
      return
    }

    const confirmou = window.confirm(
      `Tem certeza que deseja excluir o acesso de "${consultor.name}" (${consultor.email})? Esta ação não pode ser desfeita.`,
    )
    if (!confirmou) return

    try {
      const res = await AuthService.excluirConsultor(consultor.id)
      if (res.sucesso) {
        setAlertaConsultores({
          tipo: 'sucesso',
          texto: `Consultor ${consultor.name} removido com sucesso.`,
        })
        await carregarConsultores()
      } else {
        setAlertaConsultores({ tipo: 'erro', texto: res.mensagem })
      }
    } catch (err: any) {
      setAlertaConsultores({
        tipo: 'erro',
        texto: err?.message || 'Erro ao remover consultor.',
      })
    }
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
                  Senha do administrador Guilherme:{' '}
                  <code className="font-mono bg-gray-100 px-1 py-0.5 rounded text-gray-700">
                    Pna20020
                  </code>
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

                <div className="rounded bg-amber-50 p-3 text-[11px] text-amber-950 border border-amber-200 space-y-1.5">
                  <p className="font-semibold flex items-center gap-1.5">
                    <span>⚠️</span> Aviso sobre redefinição por e-mail:
                  </p>
                  <p className="leading-relaxed">
                    O envio de e-mails automáticos requer a configuração do servidor SMTP no Skip
                    Cloud. Caso não receba o e-mail,{' '}
                    <strong>solicite ao administrador (Guilherme Bravo)</strong> a redefinição
                    direta da sua senha pelo painel, sem depender de e-mail.
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
              <div className="flex items-center gap-1.5 justify-end">
                <span className="text-xs font-semibold text-gray-800">{user.nome}</span>
                {user.role === 'admin' ? (
                  <Badge className="bg-[#0A1F38] text-[10px] text-white">Administrador</Badge>
                ) : (
                  <Badge variant="outline" className="text-[10px] text-gray-600 border-gray-300">
                    Consultor
                  </Badge>
                )}
              </div>
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
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8">
        {/* SEÇÃO EXCLUSIVA DO ADMINISTRADOR: GERENCIAR CONSULTORES */}
        {user.role === 'admin' && (
          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">👥</span>
                  <h2 className="text-lg font-bold" style={{ color: AZUL }}>
                    Gerenciar Consultores da Área do Parceiro
                  </h2>
                  <Badge className="bg-blue-100 text-blue-800 text-[10px] hover:bg-blue-100">
                    Acesso Admin
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-gray-600">
                  Crie novos logins de consultores, redefina senhas diretamente pelo painel (sem
                  depender de e-mail/SMTP) e gerencie quem pode acessar esta área.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={carregarConsultores}
                  disabled={carregandoConsultores}
                  className="text-xs text-gray-700"
                >
                  {carregandoConsultores ? 'Carregando...' : '🔄 Atualizar'}
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    setErroNovoConsultor(null)
                    setModalNovoConsultor(true)
                  }}
                  className="text-xs font-semibold text-white shadow-sm gap-1.5"
                  style={{ background: AZUL }}
                >
                  <span>＋</span> Novo Consultor
                </Button>
              </div>
            </div>

            {/* Mensagem de alerta de sucesso/erro para operações de consultores */}
            {alertaConsultores && (
              <div
                className={`mt-4 rounded p-3 text-xs flex items-center justify-between ${
                  alertaConsultores.tipo === 'sucesso'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                <span>{alertaConsultores.texto}</span>
                <button
                  type="button"
                  onClick={() => setAlertaConsultores(null)}
                  className="font-bold ml-2 hover:opacity-75"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Tabela de Consultores */}
            <div className="mt-4 overflow-x-auto rounded border border-gray-100">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-600 font-semibold uppercase tracking-wider border-b border-gray-200">
                  <tr>
                    <th className="py-2.5 px-4">Nome do Consultor</th>
                    <th className="py-2.5 px-4">E-mail de Login</th>
                    <th className="py-2.5 px-4">Função / Perfil</th>
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4">Cadastrado em</th>
                    <th className="py-2.5 px-4 text-right">Ações Rápidas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {consultores.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-gray-500">
                        {carregandoConsultores
                          ? 'Carregando lista de consultores...'
                          : 'Nenhum usuário encontrado.'}
                      </td>
                    </tr>
                  ) : (
                    consultores.map((c) => {
                      const isMainAdmin = c.email === 'luiz.guilherme@cconsultingroup.com.br'
                      const isSelf = c.id === user.id
                      const criadoFormatado = c.created
                        ? new Date(c.created).toLocaleDateString('pt-BR')
                        : '—'

                      return (
                        <tr key={c.id} className="hover:bg-gray-50/70 transition-colors">
                          <td className="py-3 px-4 font-semibold text-gray-900 whitespace-nowrap">
                            {c.name || 'Sem nome'}
                            {isMainAdmin && (
                              <span className="ml-2 text-[10px] font-normal text-gray-400">
                                (Você / Dono)
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-gray-600 font-mono text-[11px] whitespace-nowrap">
                            {c.email}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            {c.role === 'admin' || isMainAdmin ? (
                              <Badge className="bg-[#0A1F38] text-[10px] text-white">
                                Administrador
                              </Badge>
                            ) : (
                              <Badge
                                variant="secondary"
                                className="bg-gray-100 text-[10px] text-gray-700"
                              >
                                Consultor
                              </Badge>
                            )}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
                              Ativo
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-500 text-[11px] whitespace-nowrap">
                            {criadoFormatado}
                          </td>
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-1.5">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setConsultorParaReset(c)
                                  setSenhaRedefinidaManual('')
                                  setMensagemResetManual(null)
                                }}
                                className="h-7 text-[11px] border-blue-200 text-blue-700 hover:bg-blue-50"
                              >
                                🔑 Redefinir Senha
                              </Button>

                              {!isMainAdmin && !isSelf && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleExcluirConsultor(c)}
                                  className="h-7 text-[11px] text-red-600 hover:text-red-800 hover:bg-red-50"
                                >
                                  Excluir
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
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
                    <th className="py-3 px-4">Melhor Horário</th>
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
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="inline-block rounded bg-blue-50 border border-blue-100 px-2 py-0.5 text-[11px] font-medium text-blue-800">
                            🕐 {lead.melhorHorarioContato || 'Não informado'}
                          </span>
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

      {/* Modal: Novo Consultor */}
      <Dialog open={modalNovoConsultor} onOpenChange={setModalNovoConsultor}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle style={{ color: AZUL }}>Cadastrar Novo Consultor</DialogTitle>
            <DialogDescription className="text-xs text-gray-500">
              O consultor receberá acesso imediato à Área do Parceiro com a senha inicial definida
              aqui, sem precisar depender de e-mail de ativação.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCriarConsultor} className="space-y-4 pt-2">
            {erroNovoConsultor && (
              <div className="rounded bg-red-50 p-2.5 text-xs text-red-700 border border-red-200">
                {erroNovoConsultor}
              </div>
            )}

            <div>
              <Label htmlFor="novo-nome" className="text-xs font-semibold text-gray-700">
                Nome completo
              </Label>
              <Input
                id="novo-nome"
                type="text"
                required
                value={novoNome}
                onChange={(e) => setNovoNome(e.target.value)}
                placeholder="Ex: João da Silva"
                className="mt-1 text-xs"
              />
            </div>

            <div>
              <Label htmlFor="novo-email" className="text-xs font-semibold text-gray-700">
                E-mail corporativo de login
              </Label>
              <Input
                id="novo-email"
                type="email"
                required
                value={novoEmail}
                onChange={(e) => setNovoEmail(e.target.value)}
                placeholder="Ex: joao@cconsultingroup.com.br"
                className="mt-1 text-xs"
              />
            </div>

            <div>
              <Label htmlFor="nova-senha-consultor" className="text-xs font-semibold text-gray-700">
                Senha inicial de acesso (mínimo 8 caracteres)
              </Label>
              <Input
                id="nova-senha-consultor"
                type="text"
                required
                minLength={8}
                value={novaSenhaConsultor}
                onChange={(e) => setNovaSenhaConsultor(e.target.value)}
                placeholder="Ex: Consultor@2026"
                className="mt-1 text-xs font-mono"
              />
              <p className="mt-1 text-[11px] text-gray-400">
                Você pode passar esta senha diretamente para o consultor.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setModalNovoConsultor(false)}
                disabled={salvandoNovoConsultor}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={salvandoNovoConsultor}
                style={{ background: AZUL }}
                className="text-white font-semibold"
              >
                {salvandoNovoConsultor ? 'Salvando...' : 'Cadastrar Consultor'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal: Redefinir Senha do Consultor pelo Painel Admin */}
      <Dialog
        open={Boolean(consultorParaReset)}
        onOpenChange={(aberto) => !aberto && setConsultorParaReset(null)}
      >
        {consultorParaReset && (
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle style={{ color: AZUL }}>Redefinir Senha do Consultor</DialogTitle>
              <DialogDescription className="text-xs text-gray-500">
                Defina uma nova senha para <strong>{consultorParaReset.name}</strong> (
                {consultorParaReset.email}). A alteração tem efeito imediato e dispensa e-mail/SMTP.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleExecutarResetManual} className="space-y-4 pt-2">
              {mensagemResetManual && (
                <div
                  className={`rounded p-2.5 text-xs ${
                    mensagemResetManual.tipo === 'sucesso'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {mensagemResetManual.texto}
                </div>
              )}

              <div>
                <Label htmlFor="nova-senha-manual" className="text-xs font-semibold text-gray-700">
                  Nova senha (mínimo 8 caracteres)
                </Label>
                <Input
                  id="nova-senha-manual"
                  type="text"
                  required
                  minLength={8}
                  value={senhaRedefinidaManual}
                  onChange={(e) => setSenhaRedefinidaManual(e.target.value)}
                  placeholder="Digite a nova senha do consultor"
                  className="mt-1 text-xs font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setConsultorParaReset(null)}
                  disabled={salvandoResetManual}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={salvandoResetManual}
                  style={{ background: AZUL }}
                  className="text-white font-semibold"
                >
                  {salvandoResetManual ? 'Salvando...' : 'Salvar Nova Senha'}
                </Button>
              </div>
            </form>
          </DialogContent>
        )}
      </Dialog>

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
                  <div className="col-span-2 p-2.5 rounded border border-blue-200 bg-blue-50/60">
                    <span className="text-[10px] uppercase font-bold text-blue-700 block">
                      🕐 Melhor Horário para Contato
                    </span>
                    <span className="font-semibold text-blue-950 text-xs">
                      {leadSelecionado.melhorHorarioContato || 'Não informado pelo cliente'}
                    </span>
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
                      `Olá ${leadSelecionado.nome}! Sou o Guilherme da C Consulting Group. Vi seu diagnóstico de consórcio para ${leadSelecionado.tipoBem} (${leadSelecionado.faixaValor}) e que você prefere contato no horário: ${leadSelecionado.melhorHorarioContato || 'horário comercial'}. Separei as melhores cartas da Embracon, Mapfre e Porto Seguro para você. Podemos conversar?`,
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
