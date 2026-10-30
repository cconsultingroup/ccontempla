/* Landing Page C Contempla — Design Oficial Institucional/Sofisticado
   Paleta: deep #0d1a30, primary #1d2f50, secondary #154671, hover #2a5e8c,
   texto-suave #c7d6e6, accent #15705f, tint #e6eef6, bg-page #fff, bg-soft #f5f5f5,
   bordas #ececec, texto-secundário #5b6b80, muted #8a96a6.
   Tipografia: Poppins (headings/display 600-700) + Montserrat (body/eyebrow 400-600).
   WhatsApp consultor: 558197543716 em todos os links.
*/

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
import LOGO_MAG from '@/assets/image-f6114.png'
import { ContemplaLogo } from '@/components/ContemplaLogo'
import { LeadService, AuthService, AdminUser } from '@/services/leadService'
import { PartnerLoginModal } from '@/components/PartnerLoginModal'

const WHATS_CONSULTOR = '558197543716'
const WHATS_URL = `https://wa.me/${WHATS_CONSULTOR}`
const CRM_JARVIS_URL = 'https://joao-adibe-pipedrive-copy-327f3.goskip.app'

const LOGO_PORTO_SEGURO =
  'https://dagtlwojkqyivnjgveda.supabase.co/storage/v1/object/public/message-attachments/471e33d4-fd07-48e7-9f0e-b0d44a66c54f/whatsapp-image-2026-10-14-at-14.54.02-913b9.jpeg'
const LOGO_MAPFRE =
  'https://dagtlwojkqyivnjgveda.supabase.co/storage/v1/object/public/message-attachments/471e33d4-fd07-48e7-9f0e-b0d44a66c54f/whatsapp-image-2026-10-14-at-14.55.07-4a45c.jpeg'

/* Taxa média de administração total (% do crédito) — BCB */
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
  itau: {
    nome: 'Itaú Consórcio',
    logo: LOGO_ITAU,
    alt: 'Logo Consórcio Itaú',
    destaqueParceiro: true,
    auto: 15.6,
    imovel: 19.8,
    servicos: 18.2,
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
  bb: {
    nome: 'BB Consórcios',
    logo: LOGO_BB,
    alt: 'Logo BB Consórcios - Banco do Brasil',
    destaqueParceiro: true,
    auto: 15.4,
    imovel: 20.15,
    servicos: 18.0,
  },
  mag: {
    nome: 'MAG Seguros',
    logo: LOGO_MAG,
    alt: 'Logo MAG Seguros - Mongeral Aegon Group',
    destaqueParceiro: true,
    auto: 16.1,
    imovel: 20.4,
    servicos: 18.8,
  },
  embracon: {
    nome: 'Embracon',
    logo: LOGO_EMBRACON,
    alt: 'Logo Embracon Consórcios',
    destaqueParceiro: true,
    auto: 15.02,
    imovel: 20.78,
    servicos: 18.5,
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
}

const BENS = [
  { id: 'moto', label: 'Moto', creditoPadrao: 25000, tipo: 'auto' },
  { id: 'carro', label: 'Carro', creditoPadrao: 90000, tipo: 'auto' },
  { id: 'imovel', label: 'Imóvel', creditoPadrao: 350000, tipo: 'imovel' },
  { id: 'servicos', label: 'Serviços', creditoPadrao: 50000, tipo: 'servicos' },
]

const PRAZOS = [24, 36, 48, 60, 72, 84]

const fmtBRL = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })

function estimarParcela(credito: number, taxaTotal: number, meses: number) {
  return (credito * (1 + taxaTotal / 100)) / meses
}

/* =========================================================================
   1. HEADER STICKY
   ========================================================================= */
function Header({ onAccessJarvis }: { onAccessJarvis: () => void }) {
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-[#ececec] shadow-[0_2px_8px_rgba(13,26,48,0.04)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3.5">
        <div className="flex items-center gap-4">
          <a href="#" className="flex items-center focus:outline-hidden">
            <ContemplaLogo
              variant="light-bg"
              className="h-10 sm:h-12 w-auto"
              alt="C Contempla - Consórcios, Seguro e Previdência"
            />
          </a>
          <div className="hidden sm:block h-8 w-px bg-[#ececec]" />
          <div className="hidden sm:block leading-tight">
            <div className="font-display font-semibold text-[11px] sm:text-xs tracking-wider uppercase text-[#1d2f50]">
              Consórcios, Seguro e Previdência
            </div>
            <div className="font-body text-[11px] text-[#5b6b80]">
              Encontre a melhor cotação do mercado
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          <a href="#cotacao" className="hidden md:inline-block">
            <Button
              size="sm"
              className="rounded-[6px] bg-[#1d2f50] hover:bg-[#2a5e8c] text-white font-body font-semibold text-xs px-3.5 py-2 transition-colors shadow-[0_2px_6px_rgba(29,47,80,0.15)]"
            >
              Fazer cotação
            </Button>
          </a>
          <Button
            size="sm"
            variant="outline"
            onClick={onAccessJarvis}
            title="Área do Parceiro (CRM Jarvis)"
            aria-label="Acessar Área do Parceiro (CRM Jarvis)"
            className="rounded-[6px] border-[#ececec] bg-white text-[#1d2f50] hover:bg-[#f5f5f5] hover:text-[#154671] font-body font-medium text-xs px-3 py-2 flex items-center gap-2 transition-colors shadow-xs"
          >
            <span className="font-semibold">Área do Parceiro</span>
            <span className="text-[10px] bg-[#e6eef6] text-[#154671] px-1.5 py-0.5 rounded font-mono font-semibold">
              Jarvis
            </span>
          </Button>
        </div>
      </div>
    </header>
  )
}

/* =========================================================================
   2. HERO + 3. FAIXA DE PARCEIROS MARQUEE
   ========================================================================= */
function Hero() {
  const parceirosLista = [
    { nome: 'Itaú Consórcio', logo: LOGO_ITAU, bg: '#EC7000' },
    { nome: 'Porto Seguro', logo: LOGO_PORTO_SEGURO, bg: '#ffffff' },
    { nome: 'BB Consórcios', logo: LOGO_BB, bg: '#FFED00' },
    { nome: 'MAG Seguros', logo: LOGO_MAG, bg: '#ffffff' },
    { nome: 'Embracon', logo: LOGO_EMBRACON, bg: '#ffffff' },
    { nome: 'Mapfre', logo: LOGO_MAPFRE, bg: '#ffffff' },
  ]

  return (
    <section className="relative w-full bg-[#0d1a30] text-white overflow-hidden pt-16 sm:pt-20 pb-12 sm:pb-16">
      {/* SVG arcos decorativos no canto superior direito */}
      <div className="pointer-events-none absolute -top-12 -right-12 sm:-top-20 sm:-right-20 w-[360px] sm:w-[540px] h-[360px] sm:h-[540px] opacity-40">
        <svg viewBox="0 0 500 500" fill="none" className="w-full h-full">
          <circle
            cx="350"
            cy="150"
            r="280"
            stroke="#1d2f50"
            strokeWidth="2"
            strokeDasharray="8 8"
          />
          <circle
            cx="350"
            cy="150"
            r="210"
            stroke="#15705f"
            strokeWidth="2"
            strokeDasharray="6 6"
          />
          <circle
            cx="350"
            cy="150"
            r="140"
            stroke="#1d2f50"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <circle cx="350" cy="150" r="70" stroke="#15705f" strokeWidth="2" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 text-left">
        <h1 className="font-display font-bold text-3xl sm:text-5xl md:text-[60px] leading-[1.08] tracking-[-0.015em] uppercase text-white">
          Consórcios, Seguro e Previdência
        </h1>

        <div className="mt-3 font-display font-semibold text-2xl sm:text-3xl md:text-[36px] text-[#c7d6e6] leading-tight">
          pelo{' '}
          <span className="relative inline-block text-white font-bold underline decoration-[#15705f] decoration-4 underline-offset-8">
            melhor preço
          </span>{' '}
          do mercado.
        </div>

        <p className="font-body mt-6 max-w-2xl text-base sm:text-[19px] leading-relaxed text-[#c7d6e6]">
          Cotamos entre as principais administradoras do Brasil e encontramos para você o melhor
          preço, o melhor prazo e a melhor condição. Sem juros. Sem custo para fazer sua cotação.
        </p>

        <div className="mt-9 flex flex-col items-start justify-start gap-3.5 sm:flex-row">
          <a href="#cotacao" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto rounded-[6px] bg-white text-[#1d2f50] hover:bg-[#e6eef6] px-8 py-6 font-display font-bold text-sm sm:text-base uppercase tracking-wider transition-all shadow-[0_4px_14px_rgba(13,26,48,0.25)]"
            >
              Fazer cotação do meu perfil
            </Button>
          </a>
          <a href="#comparador" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto rounded-[6px] border-[#c7d6e6]/40 bg-transparent text-white hover:bg-white/10 hover:text-white px-7 py-6 font-display font-semibold text-xs sm:text-sm tracking-wide transition-all"
            >
              Já sei o bem que quero comprar → simular melhores condições
            </Button>
          </a>
        </div>

        <p className="mt-5 text-xs text-[#c7d6e6]/80 font-body">
          Grátis, sem compromisso. A contratação é sempre no ambiente oficial da administradora.
        </p>

        {/* 3. Faixa de parceiros no próprio hero com marquee infinito 40s */}
        <div className="mt-14 border-t border-white/10 pt-8">
          <div className="flex items-center justify-start gap-2 mb-6">
            <p className="eyebrow text-[#c7d6e6]! tracking-[0.2em] font-semibold text-xs">
              PARCEIROS OFICIAIS CREDENCIADOS
            </p>
          </div>

          <div className="relative w-full overflow-hidden py-2">
            {/* Gradientes laterais para fusão suave com o fundo escuro */}
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-12 sm:w-24 bg-gradient-to-r from-[#0d1a30] to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-12 sm:w-24 bg-gradient-to-l from-[#0d1a30] to-transparent" />

            <div className="animate-cc-marquee flex gap-4 sm:gap-5 items-center">
              {[0, 1].map((copyIndex) => (
                <div key={copyIndex} className="flex gap-4 sm:gap-5 items-center shrink-0">
                  {parceirosLista.map((p, pIdx) => (
                    <div
                      key={`${copyIndex}-${pIdx}`}
                      className="relative group flex flex-col items-center justify-center rounded-[12px] bg-white px-4 py-3 shadow-[0_4px_12px_rgba(13,26,48,0.08)] border border-[#ececec] w-[240px] h-[120px] shrink-0 transition-transform duration-200 hover:scale-[1.02]"
                    >
                      <span className="absolute -top-2.5 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider text-white uppercase bg-[#154671] shadow-xs">
                        PARCEIRA OFICIAL
                      </span>
                      <div
                        className="w-full h-20 flex items-center justify-center rounded-md p-2 overflow-hidden"
                        style={{ backgroundColor: p.bg }}
                      >
                        <img
                          src={p.logo}
                          alt={p.nome}
                          className="max-h-full max-w-full object-contain"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* =========================================================================
   4. COMPARADOR DE CARTAS LADO A LADO (#comparador, bg #f5f5f5)
   ========================================================================= */
function Comparador() {
  const [bemId, setBemId] = useState('imovel')
  const [credito, setCredito] = useState(300000)
  const [prazo, setPrazo] = useState(72)

  const bem = BENS.find((b) => b.id === bemId) || BENS[2]

  const PARCEIRAS_CHAVE = ['itau', 'porto', 'bb', 'mag', 'embracon', 'mapfre'] as const

  const diferenciais: Record<string, { selo: string; bgLogo?: string; condicoes: string[] }> = {
    itau: {
      selo: 'Crédito ágil & menor burocracia',
      bgLogo: '#EC7000',
      condicoes: [
        'Agilidade na liberação de cartas contempladas',
        'Flexibilidade no abatimento de parcelas',
        'Opção de lance embutido de até 30%',
      ],
    },
    porto: {
      selo: 'Tradição e solidez máxima',
      condicoes: [
        'Solidez e tradição do Grupo Porto Seguro',
        'Possibilidade de usar FGTS no imóvel',
        'Assessoria pós-contemplação dedicada',
      ],
    },
    bb: {
      selo: 'Solidez e capilaridade federal',
      bgLogo: '#FFED00',
      condicoes: [
        'Solidez centenária do Banco do Brasil',
        'Grupos estruturados com assembleias transparentes',
        'Uso facilitado do FGTS para lances residenciais',
      ],
    },
    mag: {
      selo: 'Solidez e proteção patrimonial',
      condicoes: [
        'Mais de 185 anos de solidez e tradição MAG',
        'Planejamento financeiro integrado com proteção familiar',
        'Atendimento consultivo e liberação ágil',
      ],
    },
    embracon: {
      selo: 'Maior flexibilidade de lances',
      condicoes: [
        'Opção de lance embutido de até 50%',
        'Contemplações mensais por sorteio e lance livre',
        'Atendimento ágil para liberação do crédito',
      ],
    },
    mapfre: {
      selo: 'Ampla rede credenciada',
      condicoes: [
        'Associada à BR Consórcios nacional',
        'Prazos estendidos sob medida',
        'Seguro prestamista opcional integrado',
      ],
    },
  }

  const cartas = PARCEIRAS_CHAVE.map((chave) => {
    const t = TAXAS[chave]
    const taxa = t[bem.tipo as 'auto' | 'imovel' | 'servicos'] ?? 20.0
    const parcela = estimarParcela(credito, taxa, prazo)
    const total = credito * (1 + taxa / 100)
    const dif = diferenciais[chave]

    return {
      chave,
      nome: t.nome,
      logo: t.logo,
      alt: t.alt,
      bgLogo: dif.bgLogo,
      taxa,
      parcela,
      total,
      selo: dif.selo,
      condicoes: dif.condicoes,
    }
  }).sort((a, b) => a.total - b.total)

  const melhorPrecoChave = cartas[0]?.chave

  return (
    <section id="comparador" className="w-full bg-[#f5f5f5] py-16 sm:py-20 scroll-mt-14">
      <div id="simulador" className="sr-only" aria-hidden="true" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Cabeçalho */}
        <div className="text-center md:text-left md:flex md:items-end md:justify-between border-b border-[#ececec] pb-6">
          <div>
            <p className="eyebrow mb-2">COMPARADOR OFICIAL DE CARTAS</p>
            <h2 className="font-display font-semibold text-2xl sm:text-3xl md:text-4xl text-[#1d2f50] uppercase tracking-[-0.008em]">
              Compare as Cartas de Consórcio Lado a Lado
            </h2>
            <p className="font-body mt-2 max-w-2xl text-sm text-[#5b6b80]">
              Acesso direto e transparente às condições oficiais das 6 principais administradoras do
              Brasil. Veja quem oferece a menor parcela e o melhor custo total.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e6eef6] border border-[#154671]/20 px-3 py-1 text-xs font-semibold text-[#154671]">
              ✓ Dados oficiais regulados pelo Banco Central
            </span>
          </div>
        </div>

        {/* Painel Branco de 3 Colunas com radius 16px */}
        <div className="mt-8 rounded-[16px] border border-[#ececec] bg-white p-6 sm:p-8 shadow-[0_4px_14px_rgba(13,26,48,0.04)]">
          <div className="grid gap-6 md:grid-cols-12">
            {/* Coluna 1: Escolha do Bem */}
            <div className="md:col-span-4">
              <Label className="font-body text-xs font-bold uppercase tracking-wider text-[#154671]">
                1. Escolha o Bem
              </Label>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {BENS.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      setBemId(b.id)
                      setCredito(b.creditoPadrao)
                    }}
                    className={`rounded-[6px] border px-3 py-2.5 text-xs font-semibold transition-all text-left flex items-center justify-between cursor-pointer ${
                      bemId === b.id
                        ? 'border-[#1d2f50] bg-[#1d2f50] text-white shadow-xs'
                        : 'border-[#ececec] bg-white text-[#1d2f50] hover:border-[#154671]'
                    }`}
                  >
                    <span>{b.label}</span>
                    {bemId === b.id && <span className="text-xs">✓</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Coluna 2: Slider Valor da Carta */}
            <div className="md:col-span-5">
              <div className="flex items-center justify-between">
                <Label className="font-body text-xs font-bold uppercase tracking-wider text-[#154671]">
                  2. Valor da Carta (Crédito)
                </Label>
                <span className="font-display font-bold text-lg text-[#1d2f50]">
                  {fmtBRL(credito)}
                </span>
              </div>
              <div className="mt-4">
                <Slider
                  min={100000}
                  max={1200000}
                  step={10000}
                  value={[credito]}
                  onValueChange={(v) => setCredito(v[0])}
                  className="my-2"
                />
                <div className="mt-2 flex justify-between text-[11px] text-[#8a96a6] font-mono">
                  <span>R$ 100.000</span>
                  <span>R$ 1.200.000</span>
                </div>
              </div>
            </div>

            {/* Coluna 3: Prazo em Meses */}
            <div className="md:col-span-3">
              <Label className="font-body text-xs font-bold uppercase tracking-wider text-[#154671]">
                3. Prazo Desejado
              </Label>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {PRAZOS.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPrazo(p)}
                    className={`flex-1 min-w-[42px] rounded-[6px] border py-2 text-xs font-semibold text-center transition-all cursor-pointer ${
                      prazo === p
                        ? 'border-[#1d2f50] bg-[#1d2f50] text-white shadow-xs'
                        : 'border-[#ececec] bg-white text-[#1d2f50] hover:border-[#154671]'
                    }`}
                  >
                    {p}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Cards das 6 Administradoras */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <span className="eyebrow text-[#5b6b80]!">
              Cartas disponíveis para {bem.label} · {fmtBRL(credito)} em {prazo} meses
            </span>
            <span className="text-xs text-[#8a96a6] hidden sm:inline font-body">
              6 administradoras credenciadas comparadas lado a lado
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cartas.map((carta) => {
              const ehMelhorPreco = carta.chave === melhorPrecoChave
              const msgWhats = `Olá! Comparei no site da C Consulting Group as cartas de ${bem.label.toLowerCase()} e me interessei pela carta da ${carta.nome}.\n\nCrédito: ${fmtBRL(credito)}\nPrazo: ${prazo} parcelas\nParcela estimada: ${fmtBRL(carta.parcela)}/mês\n\nQuero a cotação oficial detalhada dessa carta.`

              return (
                <div
                  key={carta.chave}
                  className={`relative flex flex-col justify-between rounded-[12px] bg-white transition-all duration-200 hover:shadow-[0_8px_24px_rgba(13,26,48,0.08)] ${
                    ehMelhorPreco
                      ? 'border-2 border-[#15705f] shadow-[0_4px_16px_rgba(21,112,95,0.12)] ring-2 ring-[#15705f]/20 mt-3 md:mt-0'
                      : 'border border-[#ececec] shadow-[0_2px_8px_rgba(13,26,48,0.04)] mt-3 md:mt-0'
                  }`}
                >
                  {/* Badges superiores */}
                  <div className="absolute -top-3 left-4 right-4 flex items-center justify-between pointer-events-none z-10 gap-2">
                    <span className="rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white bg-[#154671] shadow-xs pointer-events-auto">
                      PARCEIRA OFICIAL
                    </span>
                    {ehMelhorPreco && (
                      <span className="rounded-full bg-[#15705f] px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-white shadow-xs pointer-events-auto">
                        MENOR PARCELA
                      </span>
                    )}
                  </div>

                  <div className="p-6 pt-7">
                    {/* Logo e Taxa de Administração */}
                    <div className="flex items-center justify-between border-b border-[#ececec] pb-4">
                      <div
                        className="flex h-16 w-36 sm:w-44 items-center justify-center rounded-[6px] border border-[#ececec] p-2 overflow-hidden"
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
                        <span className="text-[11px] font-semibold text-[#8a96a6] block uppercase tracking-wider">
                          Taxa Adm. Total
                        </span>
                        <span className="font-display font-bold text-sm text-[#1d2f50]">
                          {carta.taxa.toFixed(2).replace('.', ',')}%
                        </span>
                      </div>
                    </div>

                    {/* Parcela Estimada em 36px */}
                    <div className="mt-4 rounded-[8px] bg-[#f5f5f5] p-4 text-center border border-[#ececec]">
                      <span className="text-[11px] uppercase tracking-wider text-[#5b6b80] font-semibold block">
                        Parcela Estimada
                      </span>
                      <div className="mt-1 font-display font-bold text-3xl sm:text-[36px] text-[#1d2f50] leading-none">
                        {fmtBRL(carta.parcela)}
                      </div>
                      <div className="mt-1.5 text-xs text-[#8a96a6]">
                        {prazo} parcelas sem juros
                      </div>
                    </div>

                    {/* Custo Total e Destaque */}
                    <div className="mt-4 space-y-2 text-xs font-body">
                      <div className="flex justify-between py-1 border-b border-[#ececec]">
                        <span className="text-[#5b6b80]">Carta de Crédito:</span>
                        <span className="font-bold text-[#1d2f50]">{fmtBRL(credito)}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#ececec]">
                        <span className="text-[#5b6b80]">Custo Total Previsto:</span>
                        <span className="font-bold text-[#1d2f50]">{fmtBRL(carta.total)}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#ececec]">
                        <span className="text-[#5b6b80]">Destaque:</span>
                        <span className="font-semibold text-[#15705f]">{carta.selo}</span>
                      </div>
                    </div>

                    {/* 3 Condições com Check Verde */}
                    <div className="mt-4 pt-3 border-t border-[#ececec]">
                      <span className="eyebrow text-[10px] block mb-2 text-[#5b6b80]!">
                        Condições da Carta
                      </span>
                      <ul className="space-y-1.5 text-xs text-[#5b6b80]">
                        {carta.condicoes.map((c, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-[#15705f] font-bold">✓</span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Rodapé do Card com CTA WhatsApp */}
                  <div className="p-6 pt-0">
                    <a
                      href={`https://wa.me/${WHATS_CONSULTOR}?text=${encodeURIComponent(msgWhats)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button
                        className={`w-full rounded-[6px] font-display font-semibold text-white py-2.5 text-xs sm:text-sm uppercase tracking-wider transition-all ${
                          ehMelhorPreco
                            ? 'bg-[#15705f] hover:bg-[#125c4f] shadow-sm'
                            : 'bg-[#1d2f50] hover:bg-[#2a5e8c]'
                        }`}
                      >
                        Cotar Carta {carta.nome}
                      </Button>
                    </a>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Rodapé do Comparador com Disclaimer + Link WhatsApp */}
          <div className="mt-8 rounded-[12px] bg-white border border-[#ececec] p-4 text-center sm:flex sm:items-center sm:justify-between text-xs text-[#5b6b80]">
            <p>
              * Estimativa comparativa sem juros calculada conforme taxa de administração do BCB.
              Contratação formalizada no ambiente oficial da administradora.
            </p>
            <a
              href={WHATS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 sm:mt-0 inline-flex items-center gap-1 font-semibold text-[#15705f] hover:underline"
            >
              Falar com o parceiro no WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* =========================================================================
   5. "O QUE É CONSÓRCIO?" (bg branco, coluna sticky + FAQ acordeão 01-06)
   ========================================================================= */
function OQueE() {
  const perguntas = [
    {
      num: '01',
      pergunta: 'O que é um consórcio em uma frase?',
      resposta:
        'É um grupo de pessoas que junta dinheiro todo mês para comprar bens, um por vez. Todo mês, um membro do grupo é contemplado e recebe o valor cheio para comprar o bem dele — e assim vai, até todos do grupo receberem.',
    },
    {
      num: '02',
      pergunta: 'Como funciona na prática?',
      resposta:
        'Você escolhe o bem e o valor do crédito. Entra no grupo e paga uma parcela mensal. A contemplação acontece por sorteio (feito pela Loteria Federal) ou por lance (antecipação de parcelas para retirar a carta antes). Ao ser contemplado, você recebe a carta de crédito à vista.',
    },
    {
      num: '03',
      pergunta: 'Quanto eu pago? Tem juros?',
      resposta:
        'Não tem juros. Essa é a principal vantagem sobre o financiamento bancário. Você paga apenas uma taxa de administração diluída em todas as parcelas ao longo do contrato e, conforme a administradora, fundo de reserva ou seguro prestamista.',
    },
    {
      num: '04',
      pergunta: 'É seguro?',
      resposta:
        'Sim, 100% seguro. O sistema de consórcios no Brasil é regulado e fiscalizado diretamente pelo Banco Central (Lei nº 11.795/2008). Todos os recursos do grupo ficam segregados do patrimônio da administradora.',
    },
    {
      num: '05',
      pergunta: 'Consórcio ou financiamento?',
      resposta:
        'No financiamento você paga juros compostos que dobram ou triplicam o valor do bem. No consórcio não há juros, apenas taxa de administração. É a forma mais inteligente e econômica de planejar a aquisição do seu patrimônio.',
    },
    {
      num: '06',
      pergunta: 'O que eu faço com a carta de crédito?',
      resposta:
        'Você compra o bem que planejou: imóvel novo, usado, terreno, construção, reforma, carro, moto, frota ou serviços. Como a carta de crédito equivale a pagamento à vista, você tem poder total de negociação para conseguir descontos.',
    },
  ]

  return (
    <section id="o-que-e" className="w-full bg-white py-16 sm:py-20 border-t border-[#ececec]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Coluna Sticky */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <p className="eyebrow mb-2">ENTENDA EM POUCOS MINUTOS</p>
              <h2 className="font-display font-semibold text-3xl sm:text-4xl text-[#1d2f50] uppercase tracking-[-0.008em]">
                O que é consórcio?
              </h2>
              <p className="font-body mt-4 text-base text-[#5b6b80] leading-relaxed">
                Explicação simples, transparente e sem letra miúda. Entenda como funciona a compra
                planejada sem juros e por que ela é a escolha de milhares de famílias.
              </p>
              <div className="mt-8">
                <a href="#cotacao">
                  <Button
                    size="lg"
                    className="rounded-[6px] bg-[#1d2f50] hover:bg-[#2a5e8c] text-white font-display font-semibold text-xs sm:text-sm uppercase tracking-wider px-6 py-5 shadow-sm"
                  >
                    Entendi, quero minha cotação
                  </Button>
                </a>
              </div>
            </div>
          </div>

          {/* Acordeão 01 a 06 */}
          <div className="lg:col-span-7">
            <Accordion type="single" collapsible className="space-y-3">
              {perguntas.map((p) => (
                <AccordionItem
                  key={p.num}
                  value={p.num}
                  className="rounded-[12px] border border-[#ececec] bg-[#f5f5f5] px-5 py-1"
                >
                  <AccordionTrigger className="text-left font-display font-semibold text-[#1d2f50] hover:no-underline py-4 text-sm sm:text-base">
                    <span className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-[#15705f]">{p.num}</span>
                      <span>{p.pergunta}</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="font-body text-xs sm:text-sm text-[#5b6b80] leading-relaxed pb-4 pt-1">
                    {p.resposta}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  )
}

/* =========================================================================
   6. "TODO BEM TEM UMA HISTÓRIA POR TRÁS." (bg #f5f5f5, 4 cards com foto 220px)
   ========================================================================= */
function Emocional() {
  const historias = [
    {
      titulo: 'A casa própria',
      legenda: 'A chave na mão e o quintal próprio para a família.',
      foto: 'https://img.usecurling.com/p/600/400?q=modern%20house%20home&color=blue',
    },
    {
      titulo: 'A liberdade de ir e vir',
      legenda: 'Levar a família no carro novo, sem depender de ninguém.',
      foto: 'https://img.usecurling.com/p/600/400?q=family%20suv%20car&color=blue',
    },
    {
      titulo: 'A sua independência',
      legenda: 'A primeira moto e a autonomia que vem com ela.',
      foto: 'https://img.usecurling.com/p/600/400?q=motorcycle%20freedom&color=black',
    },
    {
      titulo: 'O seu patrimônio',
      legenda: 'O caminhão, a máquina, o imóvel que faz o negócio crescer.',
      foto: 'https://img.usecurling.com/p/600/400?q=commercial%20building%20business&color=gray',
    },
  ]

  return (
    <section className="w-full bg-[#f5f5f5] py-16 sm:py-20 border-t border-[#ececec]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="eyebrow mb-2">PLANEJAMENTO QUE TRANSFORMA</p>
          <h2 className="font-display font-semibold text-2xl sm:text-3xl md:text-4xl text-[#1d2f50] uppercase tracking-[-0.008em]">
            Todo bem tem uma história por trás.
          </h2>
          <p className="font-body mt-3 text-sm sm:text-base text-[#5b6b80]">
            O consórcio não é sobre parcela — é sobre a conquista que vem depois dela.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {historias.map((h, idx) => (
            <div
              key={idx}
              className="flex flex-col overflow-hidden rounded-[12px] bg-white border border-[#ececec] shadow-[0_2px_8px_rgba(13,26,48,0.04)] transition-transform duration-200 hover:-translate-y-1"
            >
              <div className="h-[220px] w-full overflow-hidden bg-[#e6eef6]">
                <img
                  src={h.foto}
                  alt={h.titulo}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display font-semibold text-base text-[#1d2f50] uppercase">
                    {h.titulo}
                  </h3>
                  <p className="font-body mt-2 text-xs sm:text-sm text-[#5b6b80] leading-relaxed">
                    "{h.legenda}"
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* =========================================================================
   7. SPLIT COTAÇÃO / SIMULADOR
   ========================================================================= */
function SplitCaminhos() {
  return (
    <section className="w-full bg-white py-14 border-t border-[#ececec]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Card Escuro #0d1a30 */}
          <div className="relative rounded-[16px] bg-[#0d1a30] text-white p-8 sm:p-10 shadow-[0_8px_24px_rgba(13,26,48,0.15)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs font-bold text-[#c7d6e6] tracking-wider uppercase">
                  01 Cotação
                </span>
                <span className="rounded-full bg-[#15705f] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 shadow-xs">
                  RECOMENDADO
                </span>
              </div>
              <h3 className="font-display font-semibold text-2xl text-white uppercase tracking-tight">
                Cotação Personalizada do Perfil
              </h3>
              <p className="font-body mt-3 text-sm text-[#c7d6e6] leading-relaxed">
                Responda 7 perguntas rápidas em 1 minuto. Nosso consultor recebe o seu perfil e cota
                entre as 6 principais administradoras para entregar o menor preço e melhor condição.
              </p>
            </div>
            <div className="mt-8">
              <a href="#cotacao">
                <Button
                  size="lg"
                  className="rounded-[6px] bg-white text-[#1d2f50] hover:bg-[#e6eef6] font-display font-bold text-xs uppercase tracking-wider px-6 py-5"
                >
                  Fazer minha cotação
                </Button>
              </a>
            </div>
          </div>

          {/* Card Claro #f5f5f5 */}
          <div className="rounded-[16px] bg-[#f5f5f5] border border-[#ececec] text-[#1d2f50] p-8 sm:p-10 shadow-[0_4px_14px_rgba(13,26,48,0.04)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs font-bold text-[#154671] tracking-wider uppercase">
                  02 Simulador
                </span>
              </div>
              <h3 className="font-display font-semibold text-2xl text-[#1d2f50] uppercase tracking-tight">
                Simulador Direto de Cartas
              </h3>
              <p className="font-body mt-3 text-sm text-[#5b6b80] leading-relaxed">
                Já sabe o bem e o valor desejado? Ajuste o valor da carta e o prazo no comparador
                oficial e veja as parcelas de cada administradora calculadas em tempo real.
              </p>
            </div>
            <div className="mt-8">
              <a href="#comparador">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-[6px] border-[#1d2f50] text-[#1d2f50] hover:bg-[#1d2f50] hover:text-white font-display font-semibold text-xs uppercase tracking-wider px-6 py-5 transition-colors"
                >
                  Simular melhores condições
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* =========================================================================
   8. COTAÇÃO 7 ETAPAS (#cotacao, bg #f5f5f5)
   ========================================================================= */
const PERGUNTAS = [
  {
    id: 'objetivo',
    pergunta: 'Qual é o seu objetivo?',
    opcoes: [
      'Comprar um bem',
      'Trocar de bem',
      'Capital de giro empresa',
      'Patrimônio investimento',
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

const HORARIO_ATENDIMENTO_PADRAO = 'Segunda a sexta-feira, das 09h às 18h'

function CotacaoFluxo() {
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

  const handleConcluirDiagnostico = async () => {
    setSalvandoLead(true)
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

  const msgDiagnostico = `Olá! Acabei de completar a cotação no site da C Consulting Group.\n\nNome: ${nome}\nWhatsApp: ${whats}\nObjetivo: ${respostas.objetivo}\nBem: ${respostas.bem}\nValor: ${respostas.valor}\nContemplação: ${respostas.prazo}\nParcela: ${respostas.parcela}\nDecisão: ${respostas.urgencia}\nMelhor horário para contato: ${respostas.melhorHorario || 'Qualquer horário comercial'}\n\nQuero falar com o especialista e realizar meu sonho.`

  const handleAbrirWhatsApp = () => {
    window.open(
      `https://wa.me/${WHATS_CONSULTOR}?text=${encodeURIComponent(msgDiagnostico)}`,
      '_blank',
      'noopener,noreferrer',
    )
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
    <section id="cotacao" className="w-full bg-[#f5f5f5] py-16 sm:py-20 scroll-mt-14">
      <div id="diagnostico" className="sr-only" aria-hidden="true" />
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="text-center mb-8">
          <p className="eyebrow mb-2">COTAÇÃO PERSONALIZADA</p>
          <h2 className="font-display font-semibold text-2xl sm:text-3xl md:text-4xl text-[#1d2f50] uppercase tracking-[-0.008em]">
            Faça sua Cotação em 7 Etapas
          </h2>
          <p className="font-body mt-2 text-sm sm:text-base text-[#5b6b80]">
            Descubra as condições ideais para o seu orçamento e receba a melhor cotação comparada
            pelo nosso especialista.
          </p>
        </div>

        {/* Card Branco radius 16px */}
        <div className="rounded-[16px] bg-white border border-[#ececec] p-6 sm:p-10 shadow-[0_6px_20px_rgba(13,26,48,0.06)]">
          {!concluido && (
            <>
              {/* Barra de progresso com 7 segmentos verdes */}
              <div className="mb-8">
                <div className="flex items-center justify-between text-xs font-semibold text-[#154671] mb-2 font-mono">
                  <span>
                    ETAPA {etapa + 1} DE {PERGUNTAS.length}
                  </span>
                  <span className="text-[#15705f]">{etapa + 1}/7</span>
                </div>
                <div className="grid grid-cols-7 gap-1.5 h-2">
                  {PERGUNTAS.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-full rounded-full transition-all duration-300 ${
                        idx <= etapa ? 'bg-[#15705f]' : 'bg-[#e6eef6]'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Pergunta Atual */}
              <h3 className="font-display font-semibold text-xl sm:text-2xl text-[#1d2f50]">
                {PERGUNTAS[etapa].pergunta}
              </h3>

              {/* Opções estilo rádio */}
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {PERGUNTAS[etapa].opcoes.map((opcao) => (
                  <button
                    key={opcao}
                    onClick={() => responder(PERGUNTAS[etapa].id, opcao)}
                    className="flex items-center gap-3 rounded-[8px] border border-[#ececec] bg-[#f5f5f5] px-4 py-4 text-left font-body text-sm font-medium text-[#1d2f50] transition-all hover:border-[#154671] hover:bg-white hover:shadow-xs cursor-pointer group"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-[#8a96a6] group-hover:border-[#15705f] transition-colors">
                      <span className="h-2 w-2 rounded-full bg-transparent group-hover:bg-[#15705f] transition-colors" />
                    </span>
                    <span>{opcao}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {concluido && !dadosOk && (
            <>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#e6eef6] text-[#15705f] px-3 py-1 text-xs font-bold uppercase tracking-wider">
                ✓ Perfil gerado com sucesso
              </div>
              <h3 className="font-display font-semibold text-xl sm:text-2xl text-[#1d2f50] mt-3">
                Cotação concluída. Este é o seu perfil:
              </h3>

              <div className="mt-4 grid gap-2.5 rounded-[12px] bg-[#f5f5f5] p-5 text-sm text-[#5b6b80] sm:grid-cols-2 border border-[#ececec]">
                <div>
                  <strong className="text-[#1d2f50]">Objetivo:</strong> {respostas.objetivo}
                </div>
                <div>
                  <strong className="text-[#1d2f50]">Bem:</strong> {respostas.bem}
                </div>
                <div>
                  <strong className="text-[#1d2f50]">Valor:</strong> {respostas.valor}
                </div>
                <div>
                  <strong className="text-[#1d2f50]">Contemplação:</strong> {respostas.prazo}
                </div>
                <div>
                  <strong className="text-[#1d2f50]">Parcela:</strong> {respostas.parcela}
                </div>
                <div>
                  <strong className="text-[#1d2f50]">Decisão:</strong> {respostas.urgencia}
                </div>
                <div className="sm:col-span-2 text-[#154671] bg-[#e6eef6] p-2.5 rounded-[6px]">
                  <strong>Melhor horário para contato:</strong> {respostas.melhorHorario}
                </div>
              </div>

              <div className="mt-6 border-t border-[#ececec] pt-6">
                <p className="eyebrow mb-2">PRÉVIA DO COMPARATIVO</p>
                <div className="space-y-2 mt-3">
                  {opcoes.map((o, i) => (
                    <div
                      key={o.nome}
                      className={`flex items-center justify-between rounded-[8px] border p-3 bg-white shadow-2xs ${
                        i === 0 ? 'border-[#15705f] ring-1 ring-[#15705f]/20' : 'border-[#ececec]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {o.logo ? (
                          <div
                            className="flex h-10 w-20 sm:w-24 shrink-0 items-center justify-center rounded-[4px] border border-[#ececec] p-1 overflow-hidden"
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
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#15705f] block">
                            Parceira Oficial
                          </span>
                          <span className="text-sm font-semibold text-[#1d2f50]">
                            {i === 0 && (
                              <span className="mr-2 rounded-full bg-[#15705f] px-1.5 py-0.5 text-[9px] font-bold text-white">
                                MENOR PARCELA
                              </span>
                            )}
                            {o.nome}
                          </span>
                        </div>
                      </div>
                      <span className="text-sm sm:text-base font-display font-bold text-[#1d2f50]">
                        {fmtBRL(o.parcela)}/mês
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Formulário Nome + WhatsApp */}
              <div className="mt-8 border-t border-[#ececec] pt-6">
                <h4 className="font-display font-semibold text-base sm:text-lg text-[#1d2f50]">
                  Falta um passo para falar com o especialista
                </h4>
                <p className="font-body mt-1 text-xs sm:text-sm text-[#5b6b80]">
                  Deixe seu nome e WhatsApp para levarmos a sua cotação direto para a conversa.
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="nome" className="text-xs font-semibold text-[#1d2f50]">
                      Nome completo
                    </Label>
                    <Input
                      id="nome"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Seu nome"
                      className="mt-1 rounded-[6px] border-[#ececec]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="whats" className="text-xs font-semibold text-[#1d2f50]">
                      WhatsApp com DDD
                    </Label>
                    <Input
                      id="whats"
                      value={whats}
                      onChange={(e) => setWhats(e.target.value)}
                      placeholder="(81) 9 9999-9999"
                      className="mt-1 rounded-[6px] border-[#ececec]"
                    />
                  </div>
                </div>

                <Button
                  className="mt-5 w-full rounded-[6px] bg-[#1d2f50] hover:bg-[#2a5e8c] text-white font-display font-semibold text-sm py-5 uppercase tracking-wider transition-colors"
                  disabled={!nome || whats.length < 8 || salvandoLead}
                  onClick={handleConcluirDiagnostico}
                >
                  {salvandoLead ? 'Salvando cotação...' : 'Concluir cotação e falar com consultor'}
                </Button>
              </div>
            </>
          )}

          {concluido && dadosOk && !agradecimentoExibido && (
            <div className="py-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e6eef6] text-[#15705f] text-3xl font-bold">
                ✓
              </div>
              <h3 className="font-display font-semibold mt-5 text-2xl text-[#1d2f50]">
                Cotação completa, {nome.split(' ')[0]}!
              </h3>
              <p className="font-body mx-auto mt-3 max-w-md text-base text-[#1d2f50]">
                Fale direto com o nosso especialista e{' '}
                <strong className="text-[#15705f]">ainda hoje</strong> dê o primeiro passo para
                realizar o seu sonho.
              </p>
              <p className="font-body mx-auto mt-2 max-w-md text-sm text-[#5b6b80]">
                O seu perfil já está pronto com a sua preferência de contato:{' '}
                <strong className="text-[#1d2f50]">{respostas.melhorHorario}</strong>.
              </p>
              <div className="mt-6">
                <Button
                  size="lg"
                  onClick={handleAbrirWhatsApp}
                  className="w-full rounded-[6px] bg-[#15705f] hover:bg-[#125c4f] px-8 py-6 text-base font-display font-bold text-white shadow-md uppercase tracking-wider"
                >
                  Falar agora com o especialista no WhatsApp
                </Button>
              </div>
              <p className="mt-3 text-xs text-[#8a96a6]">
                Atendimento humano, sem custo e sem compromisso.
              </p>
            </div>
          )}

          {concluido && dadosOk && agradecimentoExibido && (
            <div className="py-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e6eef6] text-[#15705f] text-3xl font-bold">
                ✓
              </div>
              <span className="mt-3 inline-block rounded-full bg-[#e6eef6] text-[#15705f] px-3 py-1 text-xs font-bold uppercase tracking-wider">
                Cotação Recebida com Sucesso!
              </span>
              <h3 className="font-display font-bold mt-3 text-2xl text-[#1d2f50]">
                Muito obrigado, {nome.split(' ')[0]}!
              </h3>
              <p className="font-body mx-auto mt-3 max-w-lg text-base text-[#5b6b80]">
                Nosso especialista vai falar com você no WhatsApp em instantes com a cotação
                oficial.
              </p>

              <div className="mx-auto mt-6 max-w-md rounded-[12px] border border-[#ececec] bg-[#f5f5f5] p-4 text-left">
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-[#15705f] mt-1.5 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#154671]">
                      Horário de Atendimento da Equipe
                    </h4>
                    <p className="mt-1 text-sm font-semibold text-[#1d2f50]">
                      {HORARIO_ATENDIMENTO_PADRAO}
                    </p>
                    <p className="mt-1 text-xs text-[#5b6b80] leading-relaxed">
                      Preferência marcada para <strong>{respostas.melhorHorario}</strong>.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={`https://wa.me/${WHATS_CONSULTOR}?text=${encodeURIComponent(msgDiagnostico)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button
                    size="sm"
                    className="w-full rounded-[6px] bg-[#15705f] hover:bg-[#125c4f] px-6 py-2.5 font-display font-semibold text-white uppercase tracking-wider"
                  >
                    Reabrir conversa no WhatsApp
                  </Button>
                </a>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={reiniciarDiagnostico}
                  className="w-full sm:w-auto rounded-[6px] border-[#ececec] text-[#5b6b80]"
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

/* =========================================================================
   9. "POR QUE A C CONSULTING GROUP?" (bg branco, 3 cards em painel #f5f5f5 radius 16)
   ========================================================================= */
function PorQue() {
  const diferenciais = [
    {
      num: '01',
      titulo: 'Comparativo real',
      desc: 'Cotamos entre as principais administradoras do Brasil — preço lado a lado, com dados oficiais e transparentes.',
    },
    {
      num: '02',
      titulo: 'Melhor preço, prazo e condição',
      desc: 'Analisamos custo total, taxa, fundo de reserva e condições de lance — não apenas o valor aparente da parcela.',
    },
    {
      num: '03',
      titulo: 'Acompanhamento completo',
      desc: 'Da cotação ao fechamento no ambiente oficial da administradora, com consultor dedicado ao seu lado.',
    },
  ]

  return (
    <section className="w-full bg-white py-16 sm:py-20 border-t border-[#ececec]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="eyebrow mb-2">ASSESSORIA INDEPENDENTE</p>
          <h2 className="font-display font-semibold text-2xl sm:text-3xl md:text-4xl text-[#1d2f50] uppercase tracking-[-0.008em]">
            Por que a C Consulting Group?
          </h2>
          <p className="font-body mt-2 text-sm sm:text-base text-[#5b6b80]">
            Não vendemos apenas uma administradora. Defendemos o seu interesse para encontrar a
            melhor carta do mercado.
          </p>
        </div>

        {/* Painel #f5f5f5 com radius 16px */}
        <div className="rounded-[16px] bg-[#f5f5f5] border border-[#ececec] p-6 sm:p-10 shadow-[0_4px_14px_rgba(13,26,48,0.04)]">
          <div className="grid gap-6 md:grid-cols-3">
            {diferenciais.map((d) => (
              <div
                key={d.num}
                className="rounded-[12px] bg-white border border-[#ececec] p-6 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-sm font-bold text-[#154671] bg-[#e6eef6] px-2.5 py-1 rounded">
                      {d.num}
                    </span>
                    <span className="font-mono text-xs font-bold text-[#15705f]">
                      ✓ Certificado
                    </span>
                  </div>
                  <h3 className="font-display font-semibold text-lg text-[#1d2f50] uppercase">
                    {d.titulo}
                  </h3>
                  <p className="font-body mt-2 text-xs sm:text-sm text-[#5b6b80] leading-relaxed">
                    {d.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* =========================================================================
   10. BANNER CTA BG #1d2f50 RADIUS 16 COM CÍRCULOS DECORATIVOS + 4 STATS
   ========================================================================= */
function BannerCTA() {
  const stats = [
    { valor: '+1.200', label: 'Clientes atendidos' },
    { valor: '+350', label: 'Contratos contemplados' },
    { valor: 'R$ 85M+', label: 'Em créditos intermediados' },
    { valor: '98%', label: 'Satisfação comprovada' },
  ]

  return (
    <section className="w-full bg-white py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[16px] bg-[#1d2f50] text-white p-8 sm:p-14 shadow-[0_12px_32px_rgba(13,26,48,0.2)]">
          {/* Círculos decorativos SVG */}
          <div className="pointer-events-none absolute -bottom-10 -right-10 w-72 h-72 opacity-20">
            <svg viewBox="0 0 300 300" fill="none" className="w-full h-full">
              <circle
                cx="200"
                cy="200"
                r="160"
                stroke="#c7d6e6"
                strokeWidth="2"
                strokeDasharray="6 6"
              />
              <circle cx="200" cy="200" r="110" stroke="#15705f" strokeWidth="2" />
              <circle
                cx="200"
                cy="200"
                r="60"
                stroke="#c7d6e6"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            </svg>
          </div>

          <div className="relative z-10 max-w-3xl text-center mx-auto">
            <p className="font-display font-semibold text-xl sm:text-2xl md:text-3xl leading-snug text-white">
              A conquista de um bem muda uma família. O seu momento é agora, e a gente cuida do
              preço para você cuidar do sonho.
            </p>
            <div className="mt-8">
              <a href="#cotacao">
                <Button
                  size="lg"
                  className="rounded-[6px] bg-white text-[#1d2f50] hover:bg-[#e6eef6] px-8 py-6 font-display font-bold text-xs sm:text-sm uppercase tracking-wider shadow-md"
                >
                  Começar agora → é grátis
                </Button>
              </a>
            </div>
          </div>

          {/* 4 Stats */}
          <div className="relative z-10 mt-12 pt-8 border-t border-white/15 grid grid-cols-2 gap-6 md:grid-cols-4 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="font-display font-bold text-2xl sm:text-3xl text-white">
                  {s.valor}
                </div>
                <div className="font-body mt-1 text-xs text-[#c7d6e6] font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* =========================================================================
   11. DEPOIMENTOS (bg #f5f5f5, 3 cards ★★★★★ 5.0)
   ========================================================================= */
function Depoimentos() {
  const depoimentos = [
    {
      id: 1,
      nome: 'Rodrigo S. Albuquerque',
      perfil: 'Empresário · Recife/PE',
      bem: 'Carta de Imóvel R$ 450 mil',
      administradora: 'Porto Seguro Consórcio',
      foto: 'https://img.usecurling.com/ppl/medium?gender=male&seed=42',
      texto:
        'Conseguimos comprar nosso imóvel comercial sem pagar os juros abusivos de um financiamento tradicional. A equipe da C Consulting comparou as opções da Porto e Embracon e nos orientou o mês exato para o lance embutido.',
    },
    {
      id: 2,
      nome: 'Camila Mendonça Vieira',
      perfil: 'Médica · Olinda/PE',
      bem: 'Carta de Veículo R$ 130 mil',
      administradora: 'Embracon Consórcios',
      foto: 'https://img.usecurling.com/ppl/medium?gender=female&seed=18',
      texto:
        'Fiz a cotação no site e em poucos minutos o consultor me chamou no WhatsApp já com a proposta pronta. Fui contemplada por sorteio no 8º mês e troquei de carro sem surpresas na parcela.',
    },
    {
      id: 3,
      nome: 'Marcelo F. Guzmão',
      perfil: 'Engenheiro Civil · Jaboatão/PE',
      bem: 'Carta de Terreno & Construção R$ 680 mil',
      administradora: 'Mapfre Consórcios',
      foto: 'https://img.usecurling.com/ppl/medium?gender=male&seed=73',
      texto:
        'A transparência nas taxas do Banco Central fez toda a diferença. Sabia exatamente quanto estava pagando de taxa de administração e a assessoria pós-contemplação para liberar o crédito foi impecável.',
    },
  ]

  return (
    <section
      id="depoimentos"
      className="w-full bg-[#f5f5f5] py-16 sm:py-20 border-t border-[#ececec]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="eyebrow mb-2">EXPERIÊNCIAS REAIS</p>
          <h2 className="font-display font-semibold text-2xl sm:text-3xl md:text-4xl text-[#1d2f50] uppercase tracking-[-0.008em]">
            O que dizem os clientes que conquistaram seus bens
          </h2>
          <p className="font-body mt-2 text-sm sm:text-base text-[#5b6b80]">
            Histórias de quem planejou o futuro com sabedoria, economizou milhares de reais em juros
            e foi acompanhado pela C Consulting Group.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {depoimentos.map((dep) => (
            <div
              key={dep.id}
              className="flex flex-col justify-between rounded-[12px] bg-white border border-[#ececec] p-6 shadow-[0_2px_8px_rgba(13,26,48,0.04)]"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-500 text-sm mb-3">
                  {'★'.repeat(5)}
                  <span className="text-xs text-[#8a96a6] ml-1 font-semibold">5.0</span>
                </div>
                <p className="font-body text-xs sm:text-sm text-[#5b6b80] leading-relaxed italic">
                  "{dep.texto}"
                </p>
              </div>

              <div className="mt-6 border-t border-[#ececec] pt-4">
                <div className="flex items-center gap-3">
                  <img
                    src={dep.foto}
                    alt={dep.nome}
                    className="h-10 w-10 rounded-full object-cover border border-[#ececec]"
                    loading="lazy"
                  />
                  <div>
                    <div className="font-display font-semibold text-xs sm:text-sm text-[#1d2f50]">
                      {dep.nome}
                    </div>
                    <div className="text-[11px] text-[#8a96a6]">{dep.perfil}</div>
                  </div>
                </div>
                <div className="mt-2.5 rounded-[6px] bg-[#f5f5f5] px-2.5 py-1 text-[11px] text-[#5b6b80] flex items-center justify-between">
                  <span>{dep.bem}</span>
                  <span className="font-semibold text-[#15705f]">{dep.administradora}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-[#8a96a6]">
          * Depoimentos ilustrativos baseados em perfis reais atendidos por nossos consultores
          parceiros.
        </p>
      </div>
    </section>
  )
}

/* =========================================================================
   12. FAQ 2 (bg branco, coluna sticky + bloco WhatsApp)
   ========================================================================= */
function FAQ2() {
  const itensFAQ = [
    {
      id: 'faq-1',
      pergunta: 'Quanto tempo leva para ser contemplado?',
      resposta:
        'A contemplação pode ocorrer desde a primeira assembleia até o final do grupo. Existem duas maneiras: por sorteio (com chances iguais para todos) ou por lance (livre ou embutido, onde quem oferta mais parcelas antecipadas leva o crédito no mês).',
    },
    {
      id: 'faq-2',
      pergunta: 'Posso usar a carta para qualquer bem?',
      resposta:
        'A carta deve ser utilizada dentro da categoria contratada: consórcio imobiliário permite comprar casa, apartamento, terreno, reforma, construção e até quitar financiamento pré-existente; consórcio de automóveis permite veículos novos, seminovos, motos e frotas.',
    },
    {
      id: 'faq-3',
      pergunta: 'O que é lance embutido?',
      resposta:
        'O lance embutido é uma vantagem onde você pode usar até 30% a 50% do valor da própria carta de crédito contratada como lance, sem precisar tirar dinheiro do bolso. Se contemplado, o percentual é deduzido do saldo e o restante liberado para compra.',
    },
    {
      id: 'faq-4',
      pergunta: 'Quais são as taxas? Tem juros?',
      resposta:
        'Consórcio NÃO cobra juros. A única remuneração é a Taxa de Administração (que remunera a administradora pela gestão do grupo durante o contrato, diluída nas parcelas) e, conforme a administradora, fundo de reserva e seguro prestamista.',
    },
    {
      id: 'faq-5',
      pergunta: 'Posso usar meu FGTS no consórcio imobiliário?',
      resposta:
        'Sim! As administradoras parceiras como Porto Seguro e Embracon permitem a utilização do FGTS para ofertar lances, complementar a carta de crédito ou abater parcelas do saldo devedor após a contemplação, segundo normas da Caixa/SFH.',
    },
    {
      id: 'faq-6',
      pergunta: 'Como a C Consulting Group me ajuda a escolher?',
      resposta:
        'Somos consultores credenciados pelas 6 maiores administradoras do país. Em vez de vender uma única opção, comparamos as taxas oficiais do Banco Central, o histórico de contemplações e o perfil de lance para montar a solução ideal para o seu bolso.',
    },
  ]

  return (
    <section id="faq" className="w-full bg-white py-16 sm:py-20 border-t border-[#ececec]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Coluna Sticky */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <p className="eyebrow mb-2">DÚVIDAS FREQUENTES</p>
              <h2 className="font-display font-semibold text-3xl sm:text-4xl text-[#1d2f50] uppercase tracking-[-0.008em]">
                Perguntas Frequentes
              </h2>
              <p className="font-body mt-4 text-base text-[#5b6b80] leading-relaxed">
                Tudo o que você precisa saber sobre prazos, taxas, lances e contemplação para tomar
                a melhor decisão com segurança.
              </p>

              {/* Bloco WhatsApp Consultor */}
              <div className="mt-8 rounded-[12px] bg-[#f5f5f5] border border-[#ececec] p-5">
                <p className="font-display font-semibold text-sm text-[#1d2f50]">
                  Ficou com alguma dúvida específica para o seu caso?
                </p>
                <p className="font-body text-xs text-[#5b6b80] mt-1">
                  Nosso consultor responde rapidamente e analisa sua situação.
                </p>
                <a
                  href={WHATS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-[6px] bg-[#15705f] hover:bg-[#125c4f] px-4 py-2.5 font-display font-semibold text-xs sm:text-sm text-white uppercase tracking-wider transition-colors shadow-xs w-full justify-center"
                >
                  <span>Tirar dúvidas no WhatsApp com o consultor</span>
                </a>
              </div>
            </div>
          </div>

          {/* Acordeão de 6 perguntas */}
          <div className="lg:col-span-7">
            <Accordion type="single" collapsible className="space-y-3">
              {itensFAQ.map((item) => (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  className="rounded-[12px] border border-[#ececec] bg-[#f5f5f5] px-5 py-1"
                >
                  <AccordionTrigger className="text-left font-display font-semibold text-[#1d2f50] hover:no-underline py-4 text-sm sm:text-base">
                    {item.pergunta}
                  </AccordionTrigger>
                  <AccordionContent className="font-body text-xs sm:text-sm text-[#5b6b80] leading-relaxed pb-4 pt-1">
                    {item.resposta}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  )
}

/* =========================================================================
   13. RODAPÉ BG #0d1a30
   ========================================================================= */
function Footer({ onAccessJarvis }: { onAccessJarvis: () => void }) {
  return (
    <footer className="w-full bg-[#0d1a30] text-white py-12 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center text-xs text-[#c7d6e6]/70">
        <div className="flex justify-center mb-4">
          <ContemplaLogo
            variant="dark-bg"
            className="h-10 sm:h-12 w-auto"
            alt="C Contempla - Consórcios, Seguro e Previdência"
          />
        </div>

        <p className="font-display font-semibold tracking-wider text-white uppercase text-sm">
          C CONSULTING GROUP · Recife, PE
        </p>
        <p className="mt-2 text-[#c7d6e6]/80 text-xs">
          Parceiros autorizados: Porto Seguro · Embracon · Itaú · BB Consórcios · Mapfre · MAG
          Seguros
        </p>

        {/* Botão WhatsApp Verde no Rodapé */}
        <div className="mt-5 flex justify-center">
          <a
            href={WHATS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-[6px] bg-[#15705f] hover:bg-[#125c4f] px-5 py-2.5 font-display font-semibold text-white shadow-sm text-xs uppercase tracking-wider transition-colors"
          >
            <span>Falar no WhatsApp (81 9754-3716)</span>
          </a>
        </div>

        <p className="mt-5 max-w-2xl mx-auto leading-relaxed text-[11px] text-[#c7d6e6]/60">
          As estimativas exibidas utilizam taxas médias de administração oficiais e não constituem
          oferta vinculante. A contratação ocorre no ambiente oficial da administradora escolhida.
          Sistema de consórcios regulado pelo Banco Central do Brasil.
        </p>

        <div className="mt-8 border-t border-white/10 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#c7d6e6]/50">
          <span>© 2026 C Consulting Group. Todos os direitos reservados.</span>
          <button
            type="button"
            onClick={onAccessJarvis}
            className="text-[#c7d6e6]/60 hover:text-white transition-colors underline-offset-2 hover:underline cursor-pointer bg-transparent border-none p-0 inline-flex items-center gap-1"
            title="CRM Jarvis — Consórcio, Seguro e Previdência"
          >
            Área do Parceiro (CRM Jarvis)
          </button>
        </div>
      </div>
    </footer>
  )
}

/* =========================================================================
   14. BOTÃO FLUTUANTE FIXO (Pill verde #15705f)
   ========================================================================= */
function WhatsAppFloatingButton() {
  return (
    <a
      href={WHATS_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com o Parceiro no WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-[#15705f] hover:bg-[#125c4f] px-4 py-3 text-xs sm:text-sm font-display font-semibold text-white shadow-[0_4px_16px_rgba(21,112,95,0.35)] transition-all hover:scale-105"
    >
      <span className="tracking-wide">Falar com o Parceiro</span>
    </a>
  )
}

/* =========================================================================
   COMPONENTE PRINCIPAL (INDEX)
   ========================================================================= */
export const Index = () => {
  const [partnerModalOpen, setPartnerModalOpen] = useState(false)

  const abrirCRMJarvis = () => {
    window.open(CRM_JARVIS_URL, '_blank', 'noopener,noreferrer')
  }

  const handleAccessJarvis = () => {
    const usuarioAtual = AuthService.getUsuarioAtual()
    if (usuarioAtual) {
      abrirCRMJarvis()
    } else {
      setPartnerModalOpen(true)
    }
  }

  const handleLoginSuccess = (_user: AdminUser) => {
    abrirCRMJarvis()
  }

  return (
    <div className="min-h-screen relative bg-white font-body text-[#1d2f50]">
      {/* 1. Header sticky */}
      <Header onAccessJarvis={handleAccessJarvis} />

      {/* 2. Hero + 3. Faixa de parceiros no hero */}
      <Hero />

      {/* 4. Comparador de cartas lado a lado */}
      <Comparador />

      {/* 5. O que é consórcio? */}
      <OQueE />

      {/* 6. Todo bem tem uma história por trás */}
      <Emocional />

      {/* 7. Split Cotação/Simulador */}
      <SplitCaminhos />

      {/* 8. Cotação 7 etapas */}
      <CotacaoFluxo />

      {/* 9. Por que a C Consulting Group? */}
      <PorQue />

      {/* 10. Banner CTA com círculos decorativos + stats */}
      <BannerCTA />

      {/* 11. Depoimentos */}
      <Depoimentos />

      {/* 12. FAQ 2 com coluna sticky e bloco WhatsApp */}
      <FAQ2 />

      {/* 13. Rodapé escuro #0d1a30 */}
      <Footer onAccessJarvis={handleAccessJarvis} />

      {/* 14. Botão flutuante WhatsApp */}
      <WhatsAppFloatingButton />

      {/* Modal de login oficial da Área do Parceiro (CRM Jarvis) */}
      <PartnerLoginModal
        open={partnerModalOpen}
        onOpenChange={setPartnerModalOpen}
        onSuccess={handleLoginSuccess}
      />
    </div>
  )
}

export default Index
