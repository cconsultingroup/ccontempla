import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AuthService, AdminUser } from '@/services/leadService'

const AZUL = '#0A1F38'

interface PartnerLoginModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (user: AdminUser) => void
}

export function PartnerLoginModal({ open, onOpenChange, onSuccess }: PartnerLoginModalProps) {
  const [email, setEmail] = useState('luiz.guilherme@cconsultingroup.com.br')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  // Resetar erro ao abrir/fechar
  useEffect(() => {
    if (open) {
      setErro(null)
      // Se não houver email preenchido, define padrão do admin
      if (!email) {
        setEmail('luiz.guilherme@cconsultingroup.com.br')
      }
    }
  }, [open, email])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro(null)

    if (!email.trim()) {
      setErro('Informe seu e-mail corporativo.')
      return
    }

    if (!senha) {
      setErro('Informe sua senha de acesso.')
      return
    }

    setLoading(true)
    try {
      const res = await AuthService.login(email, senha)
      if (res.sucesso && res.user) {
        onOpenChange(false)
        setSenha('')
        onSuccess(res.user)
      } else {
        setErro(
          res.mensagem ||
            'E-mail ou senha inválidos. Verifique suas credenciais de acesso ou solicite ao administrador.',
        )
      }
    } catch (err: any) {
      setErro(err?.message || 'Falha na conexão com o servidor de autenticação.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6 sm:p-7">
        <DialogHeader className="text-center sm:text-center">
          <div
            className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-full text-white text-lg shadow-sm"
            style={{ background: AZUL }}
          >
            🤖
          </div>
          <div className="mx-auto mb-1 inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-[11px] font-mono font-bold text-blue-900">
            CRM Jarvis · Área do Parceiro
          </div>
          <DialogTitle className="text-xl font-bold text-gray-900" style={{ color: AZUL }}>
            Acesso Restrito ao CRM Jarvis
          </DialogTitle>
          <DialogDescription className="text-xs text-gray-500 max-w-sm mx-auto">
            Por segurança, informe seu e-mail corporativo e senha credenciados na C Consulting Group
            para acessar o sistema.
          </DialogDescription>
        </DialogHeader>

        {erro && (
          <div className="mt-2 rounded-md bg-red-50 p-3 text-xs font-medium text-red-700 border border-red-200">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-3 space-y-3.5">
          <div>
            <Label htmlFor="partner-modal-email" className="text-xs font-semibold text-gray-700">
              E-mail corporativo
            </Label>
            <Input
              id="partner-modal-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu.email@cconsultingroup.com.br"
              className="mt-1 text-sm"
              autoComplete="username"
            />
            <p className="mt-1 text-[11px] text-gray-400">
              Admin:{' '}
              <span className="font-mono text-gray-600">luiz.guilherme@cconsultingroup.com.br</span>
            </p>
          </div>

          <div>
            <Label htmlFor="partner-modal-password" className="text-xs font-semibold text-gray-700">
              Senha de acesso
            </Label>
            <Input
              id="partner-modal-password"
              type="password"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Digite sua senha"
              className="mt-1 text-sm"
              autoComplete="current-password"
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="w-full font-semibold text-white shadow-sm flex items-center justify-center gap-2"
              style={{ background: AZUL }}
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Autenticando...</span>
                </>
              ) : (
                <>
                  <span>🔓</span>
                  <span>Entrar e Acessar CRM Jarvis</span>
                </>
              )}
            </Button>
          </div>

          <p className="text-center text-[11px] text-gray-400 pt-1">
            Sessão segura autenticada via Skip Cloud PocketBase. Ao entrar, você será direcionado
            para o CRM Jarvis.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  )
}
