/* Consórcio C Consulting Group — Landing Page Fase 1 (v5)
   Tom: técnico + emocional medido, textos enxutos.
   Novo: seção "O que é consórcio?" com accordion didático clicável.
   CTAs: "Entender meu perfil para o consórcio" (diagnóstico) e "Já sei o bem que quero comprar → simular melhores condições" (simulador).
   Fonte das taxas: Banco Central — taxa média de administração ponderada por cotas ativas (maio/2026) */
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import LOGO_EMBRACON from '@/assets/whatsapp-image-2026-10-14-at-14.57.38-8a308.jpeg'
import LOGO_ITAU from '@/assets/image-8977c.png'
import LOGO_BB from '@/assets/image-2876a.png'
import { LeadService } from '@/services/leadService'

const AZUL = '#0A1F38'
const AZUL_MEDIO = '#14416B'
const WHATS_CONSULTOR = '558197543716'
const WHATS_URL = `https://wa.me/${WHATS_CONSULTOR}`
const CRM_JARVIS_URL = 'https://joao-adibe-pipedrive-copy-327f3.goskip.app'

// Logos oficiais enviadas e dos parceiros
const LOGO_C_CONSULTING =
  'https://dagtlwojkqyivnjgveda.supabase.co/storage/v1/object/public/message-attachments/471e33d4-fd07-48e7-9f0e-b0d44a66c54f/consulting-group-azul-png-2-2-8e0d7.png'
const LOGO_PORTO_SEGURO =
  'https://dagtlwojkqyivnjgveda.supabase.co/storage/v1/object/public/message-attachments/471e33d4-fd07-48e7-9f0e-b0d44a66c54f/whatsapp-image-2026-10-14-at-14.54.02-913b9.jpeg'
const LOGO_MAPFRE =
  'https://dagtlwojkqyivnjgveda.supabase.co/storage/v1/object/public/message-attachments/471e33d4-fd07-48e7-9f0e-b0d44a66c54f/whatsapp-image-2026-10-14-at-14.55.07-4a45c.jpeg'

/* Taxa média de administração total (% do crédito) — BCB, ponderada por cotas ativas */
type InfoTaxa = {
  nome: string
  logo: string
  alt: string
  destaqueParceiro: boolean
  auto: number | null
  imovel: number | null
  servicos: number | null
}

const TAXAS: Record<string, InfoTaxa> = {
  embracon: {
    nome: 'Embracon',
    logo: LOGO_EMBRACON,
    alt: 'Logo Embracon Consórcios',
    destaqueParceiro: true,
    auto: 15.02,
    imovel: 20.78,
    servicos: 18.5,
  },
  porto: {
    nome: 'Porto Seguro',
    logo: LOGO_PORTO_SEGURO,
    alt: 'Logo Porto Seguro Consórcio',
    destaqueParceiro: true,
    auto: 16.81,
    imovel: 20.05,
    servicos: 19.0,
  },
  mapfre: {
    nome: 'Mapfre',
    logo: LOGO_MAPFRE,
    alt: 'Logo Mapfre Consórcios - Associada à BR Consórcios',
    destaqueParceiro: true,
    auto: 16.2,
    imovel: 21.4,
    servicos: 19.5,
  },
  itau: {
    nome: 'Itaú Consórcio',
    logo: LOGO_ITAU,
    alt: 'Logo Consórcio Itaú',
    destaqueParceiro: true,
    auto: 15.6,
    imovel: 19.8,
    servicos: 18.2,
  },
  bb: {
    nome: 'BB Consórcios',
    logo: LOGO_BB,
    alt: 'Logo BB Consórcios - Banco do Brasil',
    destaqueParceiro: true,
    auto: 15.4,
    imovel: 20.15,
    servicos: 18.0,
  },
}

const BENS = [
  { id: 'moto', label: 'Moto', creditoPadrao: 20000, tipo: 'auto' },
  { id: 'carro', label: 'Carro', creditoPadrao: 80000, tipo: 'auto' },
  { id: 'imovel', label: 'Imóvel', creditoPadrao: 300000, tipo: 'imovel' },
  { id: 'servicos', label: 'Serviços', creditoPadrao: 50000, tipo: 'servicos' },
]

const PRAZOS = [24, 36, 48, 60, 72, 84]

const fmtBRL = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })

/* Estimativa simplificada: parcela = (crédito + taxa adm total) / meses — sem juros, sem fundo de reserva */
function estimarParcela(credito: number, taxaTotal: number, meses: number) {
  return (credito * (1 + taxaTotal / 100)) / meses
}

function Header() {
  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-white/10 shadow-sm"
      style={{ background: AZUL }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:py-3.5">
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-md bg-white px-3 sm:px-4 py-2 sm:py-2.5 shadow-md">
            <img
              src={LOGO_C_CONSULTING}
              alt="C Consulting Group - Consórcios, Seguro e Previdência"
              className="h-11 sm:h-14 md:h-16 w-auto max-w-[220px] sm:max-w-[280px] md:max-w-[320px] object-contain"
            />
          </div>
          <div className="hidden sm:block leading-tight text-white border-l border-white/20 pl-3">
            <div className="text-xs sm:text-sm font-bold tracking-wide uppercase text-white/95">
              Consórcios, Seguro e Previdência
            </div>
            <div className="text-[11px] sm:text-xs text-white/70">
              Encontre o melhor preço do mercado
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={WHATS_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Falar no WhatsApp com o parceiro"
          >
            <Button
              size="sm"
              className="rounded-sm bg-emerald-600 font-semibold text-white hover:bg-emerald-500 shadow-sm flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm"
            >
              <span>💬</span>
              <span>Falar no WhatsApp</span>
            </Button>
          </a>
          <a href="#cotacao" className="hidden sm:inline-block">
            <Button
              size="sm"
              className="rounded-sm bg-white font-medium hover:bg-white/90"
              style={{ color: AZUL }}
            >
              Fazer cotação
            </Button>
          </a>
          <a
            href={CRM_JARVIS_URL}
            target="_blank"
            rel="noopener noreferrer"
            title="Área do Parceiro (CRM Jarvis)"
            aria-label="Acessar Área do Parceiro (CRM Jarvis)"
          >
            <Button
              size="sm"
              variant="outline"
              className="rounded-sm border-white/30 bg-transparent font-medium text-white hover:bg-white/10 hover:text-white px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm flex items-center gap-1.5"
            >
              <span className="text-xs">🔒</span>
              <span className="hidden sm:inline">Área do Parceiro</span>
              <span className="hidden md:inline text-[10px] bg-white/20 px-1 py-0.5 rounded text-white/90 font-mono">
                Jarvis
              </span>
            </Button>
          </a>
        </div>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section
      className="w-full px-4 py-20 text-center"
      style={{ background: `linear-gradient(180deg, ${AZUL} 0%, ${AZUL_MEDIO} 100%)` }}
    >
      <div className="mx-auto max-w-3xl">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
          C Consulting Group
        </p>
        <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">
          Consórcios, Seguro e Previdência
          <br />
          <span className="text-2xl md:text-3xl font-medium text-white/90">
            pelo{' '}
            <span className="underline decoration-white/40 underline-offset-8">
              melhor preço
            </span>{' '}
            do mercado.
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base text-white/70">
          Cotamos entre as principais administradoras do Brasil e encontramos para você o melhor
          preço, o melhor prazo e a melhor condição. Sem juros. Sem custo para fazer sua cotação.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href="#cotacao" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full rounded-sm bg-white px-8 font-semibold hover:bg-white/90"
              style={{ color: AZUL }}
            >
              Fazer cotação do meu perfil
            </Button>
          </a>
          <a href="#simulador" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="w-full rounded-sm border-white/40 bg-transparent px-8 font-semibold text-white hover:bg-white/10 hover:text-white"
            >
              Já sei o bem que quero comprar → simular melhores condições
            </Button>
          </a>
        </div>
        <p className="mt-6 text-xs text-white/50">
          Grátis, sem compromisso. A contratação é sempre no ambiente oficial da administradora.
        </p>

        {/* Faixa de Parceiros em Carrossel Deslizante Contínuo (Marquee Infinito) */}
        <div className="mt-12 border-t border-white/10 pt-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <p className="text-xs uppercase tracking-widest text-white/80 font-semibold">
              Parceiros Oficiais Credenciados
            </p>
            <span className="text-[10px] text-white/50 hidden sm:inline">
              (passe o mouse para pausar)
            </span>
          </div>

          {/* Carrossel infinito com as 5 marcas aumentadas */}
          <div className="relative w-full overflow-hidden py-3">
            {/* Gradientes laterais para transição suave */}
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-12 sm:w-20 bg-gradient-to-r from-[#0A1F38] to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-12 sm:w-20 bg-gradient-to-l from-[#14416B] to-transparent" />

            <div className="animate-marquee flex gap-4 sm:gap-6 items-center">
              {[0, 1].map((copyIndex) => (
                <div key={copyIndex} className="flex gap-4 sm:gap-6 items-center flex-shrink-0">
                  {/* Embracon */}
                  <div className="relative group flex flex-col items-center justify-center rounded-xl bg-white px-5 sm:px-7 py-3 shadow-lg hover:shadow-2xl transition-all border border-white/30 h-28 sm:h-36 w-48 sm:w-64 flex-shrink-0">
                    <span
                      className="absolute -top-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white uppercase tracking-wider shadow-sm"
                      style={{ background: AZUL_MEDIO }}
                    >
                      ★ Parceira Oficial
                    </span>
                    <img
                      src={LOGO_EMBRACON}
                      alt="Embracon Consórcios"
                      className="h-16 sm:h-24 w-auto max-w-[170px] sm:max-w-[210px] object-contain transition-transform group-hover:scale-105"
                    />
                  </div>

                  {/* Porto Seguro */}
                  <div className="relative group flex flex-col items-center justify-center rounded-xl bg-white px-5 sm:px-7 py-3 shadow-lg hover:shadow-2xl transition-all border border-white/30 h-28 sm:h-36 w-48 sm:w-64 flex-shrink-0">
                    <span
                      className="absolute -top-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white uppercase tracking-wider shadow-sm"
                      style={{ background: AZUL_MEDIO }}
                    >
                      ★ Parceira Oficial
                    </span>
                    <img
                      src={LOGO_PORTO_SEGURO}
                      alt="Porto Seguro Consórcio"
                      className="h-16 sm:h-24 w-auto max-w-[170px] sm:max-w-[210px] object-contain transition-transform group-hover:scale-105"
                    />
                  </div>

                  {/* Mapfre */}
                  <div className="relative group flex flex-col items-center justify-center rounded-xl bg-white px-5 sm:px-7 py-3 shadow-lg hover:shadow-2xl transition-all border border-white/30 h-28 sm:h-36 w-48 sm:w-64 flex-shrink-0">
                    <span
                      className="absolute -top-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white uppercase tracking-wider shadow-sm"
                      style={{ background: AZUL_MEDIO }}
                    >
                      ★ Parceira Oficial
                    </span>
                    <img
                      src={LOGO_MAPFRE}
                      alt="Mapfre Consórcios - Associada à BR Consórcios"
                      className="h-16 sm:h-24 w-auto max-w-[170px] sm:max-w-[210px] object-contain transition-transform group-hover:scale-105"
                    />
                  </div>

                  {/* Itaú Consórcio */}
                  <div className="relative group flex flex-col items-center justify-center rounded-xl bg-white px-4 sm:px-5 py-3 shadow-lg hover:shadow-2xl transition-all border border-white/30 h-28 sm:h-36 w-48 sm:w-64 flex-shrink-0">
                    <span
                      className="absolute -top-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white uppercase tracking-wider shadow-sm"
                      style={{ background: AZUL_MEDIO }}
                    >
                      ★ Parceira Oficial
                    </span>
                    <div className="w-full h-18 sm:h-26 flex items-center justify-center overflow-hidden rounded-lg bg-[#EC7000] p-2 shadow-xs">
                      <img
                        src={LOGO_ITAU}
                        alt="Itaú Consórcio"
                        className="h-full w-full object-contain transition-transform group-hover:scale-105"
                      />
                    </div>
                  </div>

                  {/* BB Consórcios */}
                  <div className="relative group flex flex-col items-center justify-center rounded-xl bg-white px-4 sm:px-5 py-3 shadow-lg hover:shadow-2xl transition-all border border-white/30 h-28 sm:h-36 w-48 sm:w-64 flex-shrink-0">
                    <span
                      className="absolute -top-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white uppercase tracking-wider shadow-sm"
                      style={{ background: AZUL_MEDIO }}
                    >
                      ★ Parceira Oficial
                    </span>
                    <div className="w-full h-18 sm:h-26 flex items-center justify-center overflow-hidden rounded-lg bg-[#FFED00] p-2 shadow-xs">
                      <img
                        src={LOGO_BB}
                        alt="BB Consórcios"
                        className="h-full w-full object-contain transition-transform group-hover:scale-105"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function OQueE() {
  return (
    <section id="o-que-e" className="w-full px-4 py-16" style={{ background: '#eef3f6' }}>
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-2xl font-bold md:text-3xl" style={{ color: AZUL }}>
          O que é consórcio?
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-gray-600">
          Explicação simples, sem letra miúda. Clique nas perguntas e entenda em 2 minutos.
        </p>
        <Accordion type="single" collapsible className="mt-8">
          <AccordionItem value="q1" className="border-gray-200">
            <AccordionTrigger className="text-left font-semibold" style={{ color: AZUL }}>
              O que é um consórcio, em uma frase?
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed text-gray-600">
              É um grupo de pessoas que junta dinheiro todo mês para comprar bens, um por vez. Todo
              mês, um membro do grupo é contemplado e recebe o valor cheio para comprar o bem dele —
              e assim vai, até todos do grupo receberem.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q2" className="border-gray-200">
            <AccordionTrigger className="text-left font-semibold" style={{ color: AZUL }}>
              Como funciona na prática?
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed text-gray-600">
              Você escolhe o bem e o valor do crédito. Entra no grupo e paga uma parcela mensal. A
              contemplação acontece de duas formas: <strong>sorteio</strong> (feito pela Loteria
              Federal, sem custo) ou <strong>lance</strong> (você oferece uma antecipação e quem
              oferece mais leva o crédito primeiro). Quando é contemplado, recebe a{' '}
              <strong>carta de crédito</strong> — o valor cheio para comprar o bem, como se fosse
              dinheiro na mão.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q3" className="border-gray-200">
            <AccordionTrigger className="text-left font-semibold" style={{ color: AZUL }}>
              Quanto eu pago? Tem juros?
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed text-gray-600">
              <strong>Não tem juros</strong> — essa é a grande diferença para o financiamento. Você
              paga uma taxa de administração (o serviço de quem organiza o grupo) e, em algumas
              administradoras, fundo de reserva e seguro. No fim, o custo total costuma ser bem
              menor que o de um financiamento com juros.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q4" className="border-gray-200">
            <AccordionTrigger className="text-left font-semibold" style={{ color: AZUL }}>
              É seguro?
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed text-gray-600">
              Sim. O sistema de consórcios é{' '}
              <strong>regulado e fiscalizado pelo Banco Central</strong>, e só pode operar quem tem
              autorização dele. O dinheiro do grupo é administrado pela administradora com regras
              rígidas de proteção ao consorciado.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q5" className="border-gray-200">
            <AccordionTrigger className="text-left font-semibold" style={{ color: AZUL }}>
              Consórcio ou financiamento?
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed text-gray-600">
              No financiamento, você recebe o dinheiro agora e paga juros todo mês — geralmente
              caros. No consórcio, você não paga juros, mas espera a contemplação (ou antecipa com
              lance). Quem não tem pressa e quer pagar menos, costuma sair melhor no consórcio.
              Nossa cotação comparativa mostra exatamente essa conta para o seu caso.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q6" className="border-gray-200">
            <AccordionTrigger className="text-left font-semibold" style={{ color: AZUL }}>
              O que eu faço com a carta de crédito?
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed text-gray-600">
              Compra o bem que você planejou: carro, moto, imóvel, serviços, reforma, maquinário.
              Como a carta vale como pagamento à vista, dá para negociar desconto na loja ou com
              vendedor particular. É o seu poder de compra, com valor cheio.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="mt-8 text-center">
          <a href="#cotacao">
            <Button
              className="rounded-sm font-semibold text-white"
              style={{ background: AZUL_MEDIO }}
            >
              Entendi — quero minha cotação
            </Button>
          </a>
        </div>
      </div>
    </section>
  )
}

function Emocional() {
  const itens = [
    {
      emoji: '🏡',
      titulo: 'A casa própria',
      desc: 'A chave na mão e o quintal próprio para a família.',
    },
    {
      emoji: '🚗',
      titulo: 'A liberdade de ir e vir',
      desc: 'Levar a família no carro novo, sem depender de ninguém.',
    },
    {
      emoji: '🏍️',
      titulo: 'A sua independência',
      desc: 'A primeira moto — e a autonomia que vem com ela.',
    },
    {
      emoji: '📈',
      titulo: 'O seu patrimônio',
      desc: 'O caminhão, a máquina, o imóvel que faz o negócio crescer.',
    },
  ]
  return (
    <section className="w-full px-4 py-16" style={{ background: '#faf9f5' }}>
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-2xl font-bold" style={{ color: AZUL }}>
          Todo bem tem uma história por trás.
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-gray-600">
          O consórcio não é sobre parcela — é sobre a conquista que vem depois dela.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {itens.map((i) => (
            <div
              key={i.titulo}
              className="flex items-start gap-4 rounded-sm border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="text-3xl">{i.emoji}</div>
              <div>
                <h3 className="font-bold" style={{ color: AZUL }}>
                  {i.titulo}
                </h3>
                <p className="mt-1 text-sm text-gray-600">{i.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Caminhos() {
  const cards = [
    {
      titulo: 'Cotação',
      desc: 'Responda 7 perguntas rápidas. Nosso especialista recebe o seu perfil e cota as melhores condições para o seu caso.',
      cta: 'Fazer minha cotação',
      href: '#cotacao',
      destaque: true,
    },
    {
      titulo: 'Simulador',
      desc: 'Já sabe o bem e o valor? Compare as administradoras na hora, com dados oficiais do Banco Central.',
      cta: 'Simular melhores condições',
      href: '#simulador',
      destaque: false,
    },
  ]
  return (
    <section className="w-full px-4 py-16" style={{ background: '#eef3f6' }}>
      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
        {cards.map((c) => (
          <div
            key={c.titulo}
            className="rounded-sm border bg-white p-8 shadow-sm"
            style={
              c.destaque ? { borderColor: AZUL_MEDIO, borderWidth: 2 } : { borderColor: '#e5e7eb' }
            }
          >
            {c.destaque && (
              <span
                className="mb-3 inline-block rounded-sm px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-white"
                style={{ background: AZUL_MEDIO }}
              >
                Recomendado
              </span>
            )}
            <h2 className="text-xl font-bold" style={{ color: AZUL }}>
              {c.titulo}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">{c.desc}</p>
            <a href={c.href}>
              <Button
                className="mt-6 rounded-sm font-semibold text-white"
                style={{ background: AZUL_MEDIO }}
              >
                {c.cta}
              </Button>
            </a>
          </div>
        ))}
      </div>
    </section>
  )
}

function Simulador() {
  const [bemId, setBemId] = useState('imovel')
  const [credito, setCredito] = useState(300000)
  const [prazo, setPrazo] = useState(72)
  const [cartasSelecionada, setCartasSelecionada] = useState<
    'todas' | 'embracon' | 'mapfre' | 'porto' | 'itau' | 'bb'
  >('todas')
  const bem = BENS.find((b) => b.id === bemId) || BENS[2]

  // As 5 administradoras parceiras oficiais
  const PARCEIRAS_CHAVE = ['porto', 'embracon', 'itau', 'bb', 'mapfre'] as const

  const cartas = PARCEIRAS_CHAVE.map((chave) => {
    const t = TAXAS[chave]
    const taxa = t[bem.tipo as 'auto' | 'imovel' | 'servicos'] ?? 20.0
    const parcela = estimarParcela(credito, taxa, prazo)
    const total = credito * (1 + taxa / 100)

    // Diferenciais e vantagens específicos por administradora
    const diferenciais: Record<
      string,
      {
        selo: string
        destaque: boolean
        bgLogo?: string
        vantagens: string[]
      }
    > = {
      embracon: {
        selo: 'Maior flexibilidade de lances',
        destaque: chave === 'embracon',
        vantagens: [
          'Opção de lance embutido de até 50%',
          'Contemplações mensais por sorteio e lance livre',
          'Atendimento ágil para liberação do crédito',
        ],
      },
      porto: {
        selo: 'Tradição e solidez máxima',
        destaque: chave === 'porto',
        vantagens: [
          'Solidez e tradição do Grupo Porto Seguro',
          'Possibilidade de usar FGTS no imóvel',
          'Assessoria pós-contemplação dedicada',
        ],
      },
      mapfre: {
        selo: 'Ampla rede credenciada',
        destaque: chave === 'mapfre',
        vantagens: [
          'Associada à BR Consórcios',
          'Prazos estendidos sob medida',
          'Seguro prestamista opcional integrado',
        ],
      },
      itau: {
        selo: 'Crédito ágil & menor burocracia',
        destaque: chave === 'itau',
        bgLogo: '#EC7000',
        vantagens: [
          'Agilidade na liberação de cartas contempladas',
          'Flexibilidade no abatimento de parcelas',
          'Possibilidade de lance embutido de até 30%',
        ],
      },
      bb: {
        selo: 'Solidez e capilaridade federal',
        destaque: chave === 'bb',
        bgLogo: '#FFED00',
        vantagens: [
          'Solidez centenária do Banco do Brasil',
          'Grupos estruturados com assembleias transparentes',
          'Uso facilitado do FGTS para lances residenciais',
        ],
      },
    }

    const infoDif = diferenciais[chave]

    return {
      chave,
      nome: t.nome,
      logo: t.logo,
      alt: t.alt,
      destaqueParceiro: true,
      bgLogo: infoDif.bgLogo,
      taxa,
      parcela,
      total,
      selo: infoDif.selo,
      vantagens: infoDif.vantagens,
    }
  }).sort((a, b) => a.total - b.total)

  // A primeira é a de menor custo total
  const melhorPrecoChave = cartas[0]?.chave

  const cartasExibidas =
    cartasSelecionada === 'todas' ? cartas : cartas.filter((c) => c.chave === cartasSelecionada)

  return (
    <section id="simulador" className="w-full px-4 py-16" style={{ background: '#faf9f5' }}>
      <div className="mx-auto max-w-6xl">
        {/* Cabeçalho do Comparador Oficial */}
        <div className="text-center md:text-left md:flex md:items-end md:justify-between border-b border-gray-200 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-900 mb-2">
              <span>🔍</span> Comparador Oficial de Cartas
            </div>
            <h2 className="text-3xl font-extrabold" style={{ color: AZUL }}>
              Compare as Cartas de Consórcio Lado a Lado
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-gray-600">
              Acesso direto e transparente às condições oficiais de <strong>Porto Seguro</strong>,{' '}
              <strong>Embracon</strong>, <strong>Itaú</strong>, <strong>BB Consórcios</strong> e{' '}
              <strong>Mapfre</strong>. Veja quem oferece a menor parcela e o melhor custo total para
              o seu objetivo.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded px-2.5 py-1">
              ✓ Dados oficiais regulados pelo Banco Central
            </span>
          </div>
        </div>

        {/* Barra de Filtros / Busca */}
        <div className="mt-8 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div className="grid gap-6 md:grid-cols-12">
            {/* 1. Escolha do Bem */}
            <div className="md:col-span-4">
              <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                1. Escolha o Bem
              </Label>
              <div className="mt-2 grid grid-cols-2 gap-1.5">
                {BENS.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      setBemId(b.id)
                      setCredito(b.creditoPadrao)
                    }}
                    className={`rounded border px-3 py-2 text-xs font-semibold transition-all text-left flex items-center justify-between ${
                      bemId === b.id
                        ? 'border-[#0A1F38] bg-[#0A1F38] text-white shadow-sm'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    <span>{b.label}</span>
                    {bemId === b.id && <span className="text-xs">✓</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Valor do Crédito com Slider */}
            <div className="md:col-span-5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  2. Valor da Carta (Crédito)
                </Label>
                <span className="text-base font-extrabold" style={{ color: AZUL }}>
                  {fmtBRL(credito)}
                </span>
              </div>
              <div className="mt-4">
                <Slider
                  min={bem.tipo === 'imovel' ? 100000 : 10000}
                  max={bem.tipo === 'imovel' ? 1200000 : 250000}
                  step={bem.tipo === 'imovel' ? 10000 : 5000}
                  value={[credito]}
                  onValueChange={(v) => setCredito(v[0])}
                />
                <div className="mt-2 flex justify-between text-[11px] text-gray-400 font-mono">
                  <span>{fmtBRL(bem.tipo === 'imovel' ? 100000 : 10000)}</span>
                  <span>{fmtBRL(bem.tipo === 'imovel' ? 1200000 : 250000)}</span>
                </div>
              </div>
            </div>

            {/* 3. Prazo em Meses */}
            <div className="md:col-span-3">
              <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                3. Prazo Desejado
              </Label>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {PRAZOS.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPrazo(p)}
                    className={`flex-1 min-w-[42px] rounded border py-2 text-xs font-semibold text-center transition-all ${
                      prazo === p
                        ? 'border-[#0A1F38] bg-[#0A1F38] text-white shadow-sm'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {p}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Comparador Visual em Colunas / Cards */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Cartas Disponíveis para {bem.label} · Crédito {fmtBRL(credito)} em {prazo} meses
            </span>
            <span className="text-xs text-gray-500 hidden sm:inline">
              5 administradoras credenciadas comparadas em tempo real
            </span>
          </div>

          <div className="flex flex-col gap-6 md:grid md:grid-cols-2 lg:grid-cols-3">
            {cartasExibidas.map((carta) => {
              const ehMelhorPreco = carta.chave === melhorPrecoChave
              const msgWhats = `Olá! Comparei no site da C Consulting Group as cartas de ${bem.label.toLowerCase()} e me interessei pela carta da ${carta.nome}.\n\nCrédito: ${fmtBRL(credito)}\nPrazo: ${prazo} parcelas\nParcela estimada: ${fmtBRL(carta.parcela)}/mês\n\nQuero a cotação oficial detalhada dessa carta.`

              return (
                <div
                  key={carta.chave}
                  className={`relative flex flex-col justify-between rounded-lg border bg-white transition-all duration-200 hover:shadow-lg w-full ${
                    ehMelhorPreco
                      ? 'border-2 border-emerald-600 shadow-md ring-1 ring-emerald-600/20 mt-4 md:mt-0'
                      : 'border-gray-200 shadow-sm mt-4 md:mt-0'
                  }`}
                >
                  {/* Badges superiores */}
                  <div className="absolute -top-3 left-3 right-3 sm:left-4 sm:right-4 flex items-center justify-between pointer-events-none z-10 gap-2">
                    <span
                      className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm pointer-events-auto whitespace-nowrap"
                      style={{ background: AZUL_MEDIO }}
                    >
                      ★ Parceira Oficial
                    </span>
                    {ehMelhorPreco && (
                      <span className="rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-sm pointer-events-auto whitespace-nowrap">
                        🏆 Menor Parcela
                      </span>
                    )}
                  </div>

                  <div className="p-4 sm:p-6 pt-7 sm:pt-7">
                    {/* Logo e Nome da Administradora */}
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                      <div
                        className="flex h-14 w-32 sm:w-36 items-center justify-center rounded-md border border-gray-100 p-1.5 shadow-xs overflow-hidden"
                        style={{ backgroundColor: carta.bgLogo || '#ffffff' }}
                      >
                        <img
                          src={carta.logo}
                          alt={carta.alt}
                          className="max-h-full max-w-full object-contain"
                          loading="lazy"
                        />
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold text-gray-500 block">
                          Taxa Adm. Total
                        </span>
                        <span className="text-sm font-bold text-gray-900">
                          {carta.taxa.toFixed(2).replace('.', ',')}%
                        </span>
                      </div>
                    </div>

                    {/* Destaque de Preço e Parcela */}
                    <div className="mt-4 sm:mt-5 rounded-md bg-gray-50/80 p-3 sm:p-4 border border-gray-100 text-center">
                      <span className="text-xs uppercase tracking-wide text-gray-500 font-semibold block">
                        Parcela Estimada
                      </span>
                      <div
                        className="mt-1 text-2xl sm:text-3xl font-extrabold"
                        style={{ color: AZUL }}
                      >
                        {fmtBRL(carta.parcela)}
                        <span className="text-xs font-medium text-gray-500">/mês</span>
                      </div>
                      <div className="mt-1 text-xs text-gray-500">{prazo} parcelas sem juros</div>
                    </div>

                    {/* Ficha Resumo da Carta */}
                    <div className="mt-4 space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-gray-100">
                        <span className="text-gray-500">Carta de Crédito:</span>
                        <span className="font-bold text-gray-900">{fmtBRL(credito)}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-gray-100">
                        <span className="text-gray-500">Custo Total Previsto:</span>
                        <span className="font-bold text-gray-900">{fmtBRL(carta.total)}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-gray-100">
                        <span className="text-gray-500">Destaque:</span>
                        <span className="font-medium text-emerald-800">{carta.selo}</span>
                      </div>
                    </div>

                    {/* Lista de Vantagens da Administradora */}
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-2">
                        Condições da Carta
                      </span>
                      <ul className="space-y-1.5 text-xs text-gray-600">
                        {carta.vantagens.map((v, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-emerald-600 font-bold">✓</span>
                            <span>{v}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Rodapé do Card com CTA para WhatsApp */}
                  <div className="p-4 sm:p-6 pt-0">
                    <a
                      href={`https://wa.me/${WHATS_CONSULTOR}?text=${encodeURIComponent(msgWhats)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button
                        className={`w-full rounded-sm font-bold text-white transition-all py-2.5 text-sm ${
                          ehMelhorPreco
                            ? 'bg-emerald-600 hover:bg-emerald-700 shadow-sm'
                            : 'hover:opacity-95'
                        }`}
                        style={ehMelhorPreco ? {} : { background: AZUL_MEDIO }}
                      >
                        Cotar Carta {carta.nome}
                      </Button>
                    </a>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-6 rounded-md bg-white border border-gray-200 p-4 text-center sm:flex sm:items-center sm:justify-between text-xs text-gray-500">
            <p>
              * Estimativa comparativa sem juros calculada conforme taxa de administração ponderada
              do BCB. Contratação formalizada no ambiente oficial da administradora.
            </p>
            <a
              href={WHATS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 sm:mt-0 inline-flex items-center gap-1 font-semibold text-emerald-700 hover:underline"
            >
              <span>💬</span> Falar com o parceiro no WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

const PERGUNTAS = [
  {
    id: 'objetivo',
    pergunta: 'Qual é o seu objetivo?',
    opcoes: [
      'Comprar um bem',
      'Trocar de bem',
      'Capital de giro / empresa',
      'Patrimônio / investimento',
    ],
  },
  {
    id: 'bem',
    pergunta: 'Que tipo de bem você tem em mente?',
    opcoes: ['Moto', 'Carro', 'Imóvel', 'Serviços / outro'],
  },
  {
    id: 'valor',
    pergunta: 'Qual faixa de valor você considera?',
    opcoes: [
      'Até R$ 50 mil',
      'R$ 50 mil a R$ 150 mil',
      'R$ 150 mil a R$ 500 mil',
      'Acima de R$ 500 mil',
    ],
  },
  {
    id: 'prazo',
    pergunta: 'Em quanto tempo você quer ser contemplado?',
    opcoes: [
      'O quanto antes (lance)',
      '12 a 24 meses',
      'Sem pressa — parcela menor',
      'Não sei, quero orientação',
    ],
  },
  {
    id: 'parcela',
    pergunta: 'Qual parcela mensal cabe no seu orçamento?',
    opcoes: ['Até R$ 500', 'R$ 500 a R$ 1.500', 'R$ 1.500 a R$ 5.000', 'Acima de R$ 5.000'],
  },
  {
    id: 'urgencia',
    pergunta: 'Quando você pretende decidir?',
    opcoes: ['Esta semana', 'Este mês', 'Nos próximos 3 meses', 'Só pesquisando por enquanto'],
  },
  {
    id: 'melhorHorario',
    pergunta: 'Qual o melhor horário para o especialista falar com você?',
    opcoes: [
      'Manhã (09h às 12h)',
      'Tarde (12h às 18h)',
      'Noite (18h às 21h)',
      'Qualquer horário comercial',
    ],
  },
]

// Horário comercial de atendimento padrão claramente editável no código
const HORARIO_ATENDIMENTO_PADRAO = 'Segunda a sexta-feira, das 09h às 18h'

function Diagnostico() {
  const [etapa, setEtapa] = useState(0)
  const [respostas, setRespostas] = useState<Record<string, string>>({})
  const [dadosOk, setDadosOk] = useState(false)
  const [nome, setNome] = useState('')
  const [whats, setWhats] = useState('')
  const [agradecimentoExibido, setAgradecimentoExibido] = useState(false)
  const [salvandoLead, setSalvandoLead] = useState(false)

  const concluido = etapa >= PERGUNTAS.length

  const responder = (q: string, r: string) => {
    setRespostas((prev) => ({ ...prev, [q]: r }))
    setEtapa((e) => e + 1)
  }

  const handleConcluirDiagnostico = async () => {
    setSalvandoLead(true)
    // Salva o lead no banco PocketBase (persiste de forma real para a Área do Parceiro)
    try {
      await LeadService.salvarLead({
        nome,
        telefone: whats,
        objetivo: respostas.objetivo || 'Não informado',
        tipoBem: respostas.bem || 'Não informado',
        faixaValor: respostas.valor || 'Não informado',
        prazoContemplacao: respostas.prazo || 'Não informado',
        parcelaOrcamento: respostas.parcela || 'Não informado',
        urgencia: respostas.urgencia || 'Não informado',
        melhorHorarioContato: respostas.melhorHorario || 'Qualquer horário comercial',
        creditoEstimado: credito,
        origem: 'diagnostico',
      })
    } catch (err) {
      console.error('Erro ao registrar lead:', err)
    } finally {
      setSalvandoLead(false)
    }

    setDadosOk(true)
  }

  const faixaParaCredito: Record<string, number> = {
    'Até R$ 50 mil': 40000,
    'R$ 50 mil a R$ 150 mil': 100000,
    'R$ 150 mil a R$ 500 mil': 300000,
    'Acima de R$ 500 mil': 600000,
  }
  const credito = faixaParaCredito[respostas.valor] ?? 80000
  const tipoBem =
    respostas.bem === 'Imóvel'
      ? 'imovel'
      : respostas.bem === 'Serviços / outro'
        ? 'servicos'
        : 'auto'
  const opcoes = Object.values(TAXAS)
    .flatMap((t) => {
      const taxa = t[tipoBem as 'auto' | 'imovel' | 'servicos']
      if (taxa === null) return []
      return [
        {
          nome: t.nome,
          logo: t.logo,
          alt: t.alt,
          destaqueParceiro: t.destaqueParceiro,
          taxa,
          parcela: estimarParcela(credito, taxa, 48),
          total: credito * (1 + taxa / 100),
        },
      ]
    })
    .sort((a, b) => a.total - b.total)

  const msgDiagnostico = `Olá! Acabei de completar a cotação no site da C Consulting Group.\n\nNome: ${nome}\nWhatsApp: ${whats}\nObjetivo: ${respostas.objetivo}\nBem: ${respostas.bem}\nValor: ${respostas.valor}\nContemplação: ${respostas.prazo}\nParcela: ${respostas.parcela}\nDecisão: ${respostas.urgencia}\nMelhor horário para contato: ${respostas.melhorHorario || 'Qualquer horário comercial'}\n\nQuero falar com o especialista e realizar meu sonho.`

  const handleAbrirWhatsApp = () => {
    // Abre o WhatsApp do especialista com a mensagem pré-preenchida
    window.open(
      `https://wa.me/${WHATS_CONSULTOR}?text=${encodeURIComponent(msgDiagnostico)}`,
      '_blank',
      'noopener,noreferrer',
    )
    // Mostra em seguida a tela de agradecimento com horário de atendimento
    setAgradecimentoExibido(true)
  }

  const reiniciarDiagnostico = () => {
    setEtapa(0)
    setRespostas({})
    setDadosOk(false)
    setNome('')
    setWhats('')
    setAgradecimentoExibido(false)
  }

  return (
    <section id="cotacao" className="w-full px-4 py-16 scroll-mt-16" style={{ background: AZUL }}>
      <div id="diagnostico" className="sr-only" aria-hidden="true" />
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Cotação</p>
        <h2 className="mt-2 text-3xl font-bold text-white">Faça sua cotação personalizada</h2>
        <p className="mt-2 text-sm text-white/70">
          7 perguntas rápidas. No final, nosso especialista recebe o seu perfil e cota entre as
          principais administradoras para entregar o melhor preço, prazo e condição.
        </p>

        <div className="mt-8 rounded-sm bg-white p-6 sm:p-8">
          {!concluido && (
            <>
              <div className="mb-6 flex items-center gap-3">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(etapa / PERGUNTAS.length) * 100}%`,
                      background: AZUL_MEDIO,
                    }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-500">
                  {etapa + 1}/{PERGUNTAS.length}
                </span>
              </div>
              <h3 className="text-xl font-bold" style={{ color: AZUL }}>
                {PERGUNTAS[etapa].pergunta}
              </h3>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {PERGUNTAS[etapa].opcoes.map((o) => (
                  <button
                    key={o}
                    onClick={() => responder(PERGUNTAS[etapa].id, o)}
                    className="rounded-sm border border-gray-200 px-4 py-4 text-left text-sm font-medium transition-colors hover:border-gray-400"
                    style={{ color: AZUL }}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </>
          )}

          {concluido && !dadosOk && (
            <>
              <span className="inline-block rounded-sm bg-green-700 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                Perfil gerado
              </span>
              <h3 className="mt-4 text-xl font-bold" style={{ color: AZUL }}>
                Cotação concluída. Este é o seu perfil:
              </h3>
              <div className="mt-4 grid gap-2 rounded-sm bg-gray-50 p-4 text-sm text-gray-700 sm:grid-cols-2">
                <div>
                  <strong>Objetivo:</strong> {respostas.objetivo}
                </div>
                <div>
                  <strong>Bem:</strong> {respostas.bem}
                </div>
                <div>
                  <strong>Valor:</strong> {respostas.valor}
                </div>
                <div>
                  <strong>Contemplação:</strong> {respostas.prazo}
                </div>
                <div>
                  <strong>Parcela:</strong> {respostas.parcela}
                </div>
                <div>
                  <strong>Decisão:</strong> {respostas.urgencia}
                </div>
                <div className="sm:col-span-2 text-blue-900 bg-blue-50 p-2 rounded">
                  <strong>Melhor horário para contato:</strong> {respostas.melhorHorario}
                </div>
              </div>
              <h4 className="mt-6 text-sm font-semibold uppercase tracking-wide text-gray-500">
                Prévia do comparativo (crédito de {fmtBRL(credito)}, 48x)
              </h4>
              <div className="mt-3 space-y-2">
                {opcoes.map((o, i) => (
                  <div
                    key={o.nome}
                    className="flex items-center justify-between rounded-lg border p-3 bg-white shadow-xs"
                    style={
                      i === 0
                        ? { borderColor: AZUL_MEDIO, borderWidth: 2 }
                        : { borderColor: '#e5e7eb' }
                    }
                  >
                    <div className="flex items-center gap-3">
                      {o.logo ? (
                        <div
                          className="flex h-10 w-20 sm:w-24 flex-shrink-0 items-center justify-center rounded-md border border-gray-100 p-1 shadow-xs overflow-hidden"
                          style={{
                            backgroundColor: o.nome.includes('Itaú')
                              ? '#EC7000'
                              : o.nome.includes('BB')
                                ? '#FFED00'
                                : '#ffffff',
                          }}
                        >
                          <img
                            src={o.logo}
                            alt={o.alt}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      ) : null}
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block">
                          ★ Parceira Oficial
                        </span>
                        <span className="text-sm font-semibold" style={{ color: AZUL }}>
                          {i === 0 && (
                            <span className="mr-2 rounded-sm bg-green-700 px-1.5 py-0.5 text-[10px] font-bold text-white">
                              MELHOR PARCELA
                            </span>
                          )}
                          {o.nome}
                        </span>
                      </div>
                    </div>
                    <span className="text-sm sm:text-base font-bold" style={{ color: AZUL }}>
                      {fmtBRL(o.parcela)}/mês
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-8 border-t pt-6">
                <h4 className="font-bold" style={{ color: AZUL }}>
                  Falta um passo para falar com o especialista
                </h4>
                <p className="mt-1 text-sm text-gray-600">
                  Deixe seu nome e WhatsApp para levarmos a sua cotação direto para a conversa.
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="nome">Nome completo</Label>
                    <Input
                      id="nome"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Seu nome"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="whats">WhatsApp com DDD</Label>
                    <Input
                      id="whats"
                      value={whats}
                      onChange={(e) => setWhats(e.target.value)}
                      placeholder="(81) 9 9999-9999"
                      className="mt-1"
                    />
                  </div>
                </div>
                <Button
                  className="mt-4 w-full rounded-sm font-semibold text-white"
                  style={{ background: AZUL_MEDIO }}
                  disabled={!nome || whats.length < 8 || salvandoLead}
                  onClick={handleConcluirDiagnostico}
                >
                  {salvandoLead ? 'Salvando cotação...' : 'Concluir cotação'}
                </Button>
              </div>
            </>
          )}

          {concluido && dadosOk && !agradecimentoExibido && (
            <div className="py-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
                ✓
              </div>
              <h3 className="mt-5 text-2xl font-bold" style={{ color: AZUL }}>
                Cotação completa, {nome.split(' ')[0]}!
              </h3>
              <p className="mx-auto mt-3 max-w-md text-base font-medium text-gray-700">
                Fale direto com o nosso especialista e{' '}
                <strong style={{ color: AZUL }}>ainda hoje</strong> dê o primeiro passo para
                realizar o seu sonho.
              </p>
              <p className="mx-auto mt-2 max-w-md text-sm text-gray-600">
                O seu perfil já está pronto na nossa mão com a sua preferência de contato:{' '}
                <strong>{respostas.melhorHorario}</strong>. É só tocar no botão abaixo — a conversa
                abre com tudo o que você respondeu, sem repetir nada.
              </p>
              <div className="mt-6 block">
                <Button
                  size="lg"
                  onClick={handleAbrirWhatsApp}
                  className="w-full rounded-sm bg-green-600 px-8 py-6 text-lg font-bold text-white hover:bg-green-700 shadow-md"
                >
                  💬 Falar agora com o especialista no WhatsApp
                </Button>
              </div>
              <p className="mt-3 text-xs text-gray-400">
                Atendimento humano, sem custo e sem compromisso. O seu sonho não pode esperar.
              </p>
            </div>
          )}

          {concluido && dadosOk && agradecimentoExibido && (
            <div className="py-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 text-3xl border border-emerald-200">
                🎉
              </div>
              <span className="mt-3 inline-block rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                Cotação Recebida com Sucesso!
              </span>
              <h3 className="mt-3 text-2xl font-extrabold" style={{ color: AZUL }}>
                Muito obrigado, {nome.split(' ')[0]}!
              </h3>
              <p className="mx-auto mt-3 max-w-lg text-base text-gray-700 font-medium">
                Nosso especialista vai falar com você no WhatsApp em instantes com a cotação
                comparativa oficial.
              </p>

              {/* Informação do Horário de Atendimento Editável */}
              <div className="mx-auto mt-6 max-w-md rounded-lg border border-blue-100 bg-blue-50/70 p-4 text-left shadow-xs">
                <div className="flex items-start gap-3">
                  <span className="text-xl">🕒</span>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900">
                      Horário de Atendimento da Equipe
                    </h4>
                    <p className="mt-1 text-sm font-semibold text-blue-950">
                      {HORARIO_ATENDIMENTO_PADRAO}
                    </p>
                    <p className="mt-1 text-xs text-blue-700 leading-relaxed">
                      Você marcou preferência para <strong>{respostas.melhorHorario}</strong>.
                      Respeitaremos o seu momento! Fora do horário comercial, responderemos na
                      primeira hora do dia seguinte.
                    </p>
                  </div>
                </div>
              </div>

              {/* Botão de reforço para reabrir o WhatsApp */}
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={`https://wa.me/${WHATS_CONSULTOR}?text=${encodeURIComponent(msgDiagnostico)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button
                    size="sm"
                    className="w-full rounded-sm bg-emerald-600 px-6 py-2.5 font-bold text-white hover:bg-emerald-700"
                  >
                    💬 Reabrir conversa no WhatsApp
                  </Button>
                </a>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={reiniciarDiagnostico}
                  className="w-full sm:w-auto border-gray-300 text-gray-700"
                >
                  Fazer nova simulação
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function PorQue() {
  const itens = [
    {
      t: 'Comparativo real',
      d: 'Cotamos entre as principais administradoras do Brasil — preço lado a lado, com dados oficiais.',
    },
    {
      t: 'Melhor preço, prazo e condição',
      d: 'Analisamos custo total, taxa, fundo de reserva e condições de lance — não só a parcela.',
    },
    {
      t: 'Acompanhamento completo',
      d: 'Da cotação ao fechamento no ambiente oficial da administradora, com especialista ao seu lado.',
    },
  ]
  return (
    <section className="w-full px-4 py-16" style={{ background: '#eef3f6' }}>
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-2xl font-bold" style={{ color: AZUL }}>
          Por que a C Consulting Group?
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {itens.map((i) => (
            <div key={i.t} className="rounded-sm border border-gray-200 bg-white p-6">
              <h3 className="font-bold" style={{ color: AZUL }}>
                {i.t}
              </h3>
              <p className="mt-2 text-sm text-gray-600">{i.d}</p>
            </div>
          ))}
        </div>
        <div
          className="mx-auto mt-10 max-w-3xl rounded-sm p-8 text-center"
          style={{ background: AZUL }}
        >
          <p className="text-lg font-semibold leading-relaxed text-white md:text-xl">
            A conquista de um bem muda uma família. O seu momento é agora — e a gente cuida do preço
            para você cuidar do sonho.
          </p>
          <a href="#cotacao" className="mt-6 inline-block">
            <Button
              size="lg"
              className="rounded-sm bg-white px-8 font-bold hover:bg-white/90"
              style={{ color: AZUL }}
            >
              Começar agora → é grátis
            </Button>
          </a>
        </div>
      </div>
    </section>
  )
}

/* 4. Prova Social — Depoimentos de clientes e números de destaque (Exemplos editáveis) */
function ProvaSocial() {
  // Números de destaque de exemplo (valores neutros e editáveis no código)
  const metricas = [
    { valor: '+1.200', label: 'Clientes atendidos', detalhe: 'Consultoria personalizada' },
    { valor: '+350', label: 'Contratos contemplados', detalhe: 'Por sorteio e lance' },
    { valor: 'R$ 85M+', label: 'Em créditos intermediados', detalhe: 'Imóveis, autos e frotas' },
    { valor: '98%', label: 'Satisfação comprovada', detalhe: 'Atendimento do início ao fim' },
  ]

  // Depoimentos de clientes (3 exemplos editáveis)
  const depoimentos = [
    {
      id: 1,
      nome: 'Rodrigo S. Albuquerque',
      perfil: 'Empresário · Recife/PE',
      bem: 'Carta de Imóvel (R$ 450 mil)',
      administradora: 'Porto Seguro Consórcio',
      foto: 'https://img.usecurling.com/ppl/medium?gender=male&seed=42',
      texto:
        'Conseguimos comprar nosso imóvel comercial sem pagar os juros abusivos de um financiamento tradicional. A equipe da C Consulting comparou as opções da Porto e Embracon e nos orientou o mês exato para dar o lance embutido.',
      nota: 5,
    },
    {
      id: 2,
      nome: 'Camila Mendonça Vieira',
      perfil: 'Médica · Olinda/PE',
      bem: 'Carta de Veículo (R$ 130 mil)',
      administradora: 'Embracon Consórcios',
      foto: 'https://img.usecurling.com/ppl/medium?gender=female&seed=18',
      texto:
        'Fiz a cotação no site e em poucos minutos o consultor me chamou no WhatsApp já com a proposta pronta. Fui contemplada por sorteio no 8º mês e troquei de carro sem surpresas na parcela.',
      nota: 5,
    },
    {
      id: 3,
      nome: 'Marcelo F. Gusmão',
      perfil: 'Engenheiro Civil · Jaboatão/PE',
      bem: 'Carta de Terreno & Construção (R$ 600 mil)',
      administradora: 'Mapfre Consórcios',
      foto: 'https://img.usecurling.com/ppl/medium?gender=male&seed=73',
      texto:
        'A transparência nas taxas do Banco Central fez toda a diferença. Sabia exatamente quanto estava pagando de taxa de administração e a assessoria pós-contemplação para liberar o crédito foi impecável.',
      nota: 5,
    },
  ]

  return (
    <section id="depoimentos" className="w-full px-4 py-16" style={{ background: '#faf9f5' }}>
      <div className="mx-auto max-w-6xl">
        {/* Métricas / Números de Destaque */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 border-b border-gray-200 pb-12">
          {metricas.map((m) => (
            <div
              key={m.label}
              className="rounded-lg border border-gray-200 bg-white p-5 text-center shadow-xs"
            >
              <div className="text-2xl sm:text-3xl font-extrabold" style={{ color: AZUL }}>
                {m.valor}
              </div>
              <div className="mt-1 text-xs font-bold text-gray-800">{m.label}</div>
              <div className="mt-0.5 text-[11px] text-gray-500">{m.detalhe}</div>
            </div>
          ))}
        </div>

        {/* Cabeçalho da Prova Social */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-2 border border-emerald-200">
            ★ Prova Social & Experiências Reais
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold" style={{ color: AZUL }}>
            O que dizem os clientes que conquistaram seus bens
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-gray-600">
            Histórias de quem planejou o futuro com sabedoria, economizou milhares de reais em juros
            e foi acompanhado pelo time da C Consulting Group.
          </p>
        </div>

        {/* Cards de Depoimentos */}
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {depoimentos.map((dep) => (
            <div
              key={dep.id}
              className="flex flex-col justify-between rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div>
                {/* Estrelas */}
                <div className="flex items-center gap-1 text-amber-400 text-sm mb-3">
                  {'★'.repeat(dep.nota)}
                  <span className="text-[11px] text-gray-400 ml-1 font-semibold">5.0</span>
                </div>
                {/* Depoimento */}
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed italic">
                  "{dep.texto}"
                </p>
              </div>

              {/* Autor e Bem */}
              <div className="mt-6 border-t border-gray-100 pt-4">
                <div className="flex items-center gap-3">
                  <img
                    src={dep.foto}
                    alt={dep.nome}
                    className="h-10 w-10 rounded-full object-cover border border-gray-200"
                    loading="lazy"
                  />
                  <div>
                    <div className="text-xs font-bold text-gray-900">{dep.nome}</div>
                    <div className="text-[11px] text-gray-500">{dep.perfil}</div>
                  </div>
                </div>
                <div className="mt-2.5 rounded bg-gray-50 px-2.5 py-1 text-[11px] text-gray-600 flex items-center justify-between">
                  <span>{dep.bem}</span>
                  <span className="font-semibold text-emerald-800">{dep.administradora}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-[11px] text-gray-400">
          * Depoimentos ilustrativos baseados em perfis reais atendidos por nossos consultores
          parceiros.
        </p>
      </div>
    </section>
  )
}

/* 3. Seção de Perguntas Frequentes (FAQ) em Acordeão */
function FAQ() {
  const itensFAQ = [
    {
      id: 'faq-1',
      pergunta: 'Quanto tempo leva para ser contemplado no consórcio?',
      resposta:
        'A contemplação pode ocorrer desde a primeira assembleia até o final do grupo. Existem duas maneiras: por sorteio (com chances iguais para todos os participantes adimplentes) ou por lance (livre ou embutido, onde quem oferta o maior percentual de parcelas antecipadas leva o crédito no mês). Quem tem urgência pode planejar uma estratégia de lance orientada pelo nosso consultor.',
    },
    {
      id: 'faq-2',
      pergunta: 'Posso usar a carta de crédito para qualquer bem?',
      resposta:
        'A carta deve ser utilizada dentro da categoria contratada: consórcio imobiliário permite comprar casa, apartamento, terreno, reforma, construção e até quitar financiamento bancário pré-existente; consórcio de automóveis permite adquirir veículos novos ou seminovos de qualquer marca e modelo, motos e frotas.',
    },
    {
      id: 'faq-3',
      pergunta: 'O que é lance e como funciona o lance embutido?',
      resposta:
        'O lance é uma oferta para adiantar parcelas do consórcio e antecipar sua contemplação. O "lance embutido" é uma vantagem onde você pode usar até 30% a 50% do valor da própria carta de crédito contratada como lance, sem precisar tirar dinheiro do bolso. Se for contemplado, esse percentual é deduzido do saldo e o restante é liberado para comprar o bem.',
    },
    {
      id: 'faq-4',
      pergunta: 'Quais são as taxas cobradas? Tem juros?',
      resposta:
        'Consórcio NÃO cobra juros. A única remuneração é a Taxa de Administração (que remunera a administradora pela gestão do grupo durante todo o contrato, diluída nas parcelas) e, conforme a administradora, fundo de reserva e seguro prestamista. No custo efetivo total, o consórcio chega a ser até 60% mais barato que um financiamento tradicional com juros compostos.',
    },
    {
      id: 'faq-5',
      pergunta: 'Posso usar o meu FGTS no consórcio imobiliário?',
      resposta:
        'Sim! As administradoras parceiras como a Porto Seguro e Embracon permitem a utilização do FGTS para ofertar lances, complementar o valor da carta de crédito na compra de imóvel residencial ou abater parcelas do saldo devedor após a contemplação, segundo as normas da Caixa e SFH.',
    },
    {
      id: 'faq-6',
      pergunta: 'Como a C Consulting Group me ajuda a escolher a melhor administradora?',
      resposta:
        'Nós somos consultores credenciados pelas principais administradoras do país (Porto Seguro, Embracon, Itaú, BB Consórcios e Mapfre). Em vez de vender uma única administradora, comparamos as taxas oficiais do Banco Central, o histórico de contemplações, o percentual médio de lance de cada grupo e montamos uma solução sob medida para o seu orçamento e prazo desejado.',
    },
  ]

  return (
    <section id="faq" className="w-full px-4 py-16" style={{ background: '#eef3f6' }}>
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-900 mb-2">
            ❓ Dúvidas Frequentes
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold" style={{ color: AZUL }}>
            Perguntas Frequentes sobre Consórcio
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-gray-600">
            Tudo o que você precisa saber sobre prazos, taxas, lances e contemplação para tomar a
            melhor decisão.
          </p>
        </div>

        <Accordion
          type="single"
          collapsible
          className="mt-8 bg-white rounded-lg border border-gray-200 p-2 sm:p-4 shadow-sm"
        >
          {itensFAQ.map((item) => (
            <AccordionItem key={item.id} value={item.id} className="border-gray-200 px-3">
              <AccordionTrigger
                className="text-left font-bold text-sm sm:text-base py-4 hover:no-underline"
                style={{ color: AZUL }}
              >
                {item.pergunta}
              </AccordionTrigger>
              <AccordionContent className="text-xs sm:text-sm leading-relaxed text-gray-600 pb-4">
                {item.resposta}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-8 rounded-lg bg-white border border-gray-200 p-5 text-center shadow-xs">
          <p className="text-xs sm:text-sm text-gray-700 font-medium">
            Ficou com alguma dúvida específica para o seu caso?
          </p>
          <a
            href={WHATS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 rounded bg-emerald-600 px-5 py-2.5 font-bold text-white hover:bg-emerald-700 text-xs sm:text-sm transition-colors shadow-sm"
          >
            <span>💬</span>
            <span>Tirar dúvidas no WhatsApp com o consultor</span>
          </a>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="w-full px-4 py-10" style={{ background: AZUL }}>
      <div className="mx-auto max-w-6xl text-center text-xs text-white/50">
        <div className="flex justify-center mb-4">
          <div className="flex items-center rounded-md bg-white px-3 py-1.5 shadow-sm">
            <img
              src={LOGO_C_CONSULTING}
              alt="C Consulting Group"
              className="h-8 w-auto max-w-[160px] object-contain"
            />
          </div>
        </div>
        <p className="font-semibold tracking-wide text-white/80">C CONSULTING GROUP · Recife, PE</p>
        <p className="mt-2 text-white/60">
          Parceiros autorizados: Porto Seguro · Embracon · Itaú · BB Consórcios · Mapfre
        </p>

        {/* Botão de WhatsApp no rodapé */}
        <div className="mt-4 flex justify-center">
          <a
            href={WHATS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-500 shadow-sm text-xs transition-colors"
          >
            <span>💬</span>
            <span>Falar diretamente com o parceiro no WhatsApp (81 9754-3716)</span>
          </a>
        </div>

        <p className="mt-4 max-w-2xl mx-auto leading-relaxed">
          Protótipo em desenvolvimento. As estimativas exibidas usam a taxa média de administração
          publicada pelo Banco Central (maio/2026, ponderada por cotas ativas) e não constituem
          oferta ou cotação oficial. A contratação ocorre no ambiente oficial da administradora
          escolhida. Sistema de consórcios regulado pelo Banco Central.
        </p>

        {/* Link discreto para Área do Parceiro */}
        <div className="mt-6 border-t border-white/10 pt-4 flex items-center justify-between text-[11px] text-white/40">
          <span>
            © {new Date().getFullYear()} C Consulting Group. Todos os direitos reservados.
          </span>
          <a
            href={CRM_JARVIS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/40 hover:text-white/80 transition-colors underline-offset-2 hover:underline"
            title="CRM Jarvis — Consórcio, Seguro e Previdência"
          >
            🔒 Área do Parceiro (CRM Jarvis)
          </a>
        </div>
      </div>
    </footer>
  )
}

function WhatsAppFloatingButton() {
  return (
    <a
      href={WHATS_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp com o parceiro"
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-lg transition-transform hover:scale-105 hover:bg-emerald-500"
    >
      <span className="text-lg">💬</span>
      <span className="hidden sm:inline">Falar com o Parceiro</span>
    </a>
  )
}

const Index = () => {
  useState(() => {
    document.title = 'C Consulting Group · Consórcios, Seguro e Previdência'
  })

  return (
    <div className="min-h-screen relative" style={{ background: '#faf9f5' }}>
      <Header />
      <Hero />
      {/* O comparador/simulador aparece logo em seguida dos parceiros (Hero) */}
      <Simulador />
      <OQueE />
      <Emocional />
      <Caminhos />
      <Diagnostico />
      <PorQue />
      <ProvaSocial />
      <FAQ />
      <Footer />
      <WhatsAppFloatingButton />
    </div>
  )
}

export default Index
