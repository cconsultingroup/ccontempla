/* Consórcio C Consulting Group — Landing Page Fase 1
   Caminho A: cliente já sabe o que quer → simulação + comparativo
   Caminho B: diagnóstico guiado → cotação comparativa (carro-chefe)
   Fonte das taxas: Banco Central — taxa média de administração ponderada por cotas ativas (maio/2026) */
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const AZUL = '#0A1F38'
const AZUL_MEDIO = '#14416B'

/* Taxa média de administração total (% do crédito) — BCB, maio/2026, ponderada por cotas ativas */
const TAXAS: Record<
  string,
  { nome: string; auto: number | null; imovel: number | null; servicos: number | null }
> = {
  ademicon: { nome: 'Ademicon', auto: 14.91, imovel: 24.02, servicos: null },
  embracon: { nome: 'Embracon', auto: 15.02, imovel: 20.78, servicos: null },
  porto: { nome: 'Porto Seguro', auto: 16.81, imovel: 20.05, servicos: null },
  rodobens: { nome: 'Rodobens', auto: 17.45, imovel: 25.22, servicos: null },
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
      className="sticky top-0 z-50 w-full border-b border-white/10"
      style={{ background: AZUL }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-sm bg-white font-bold"
            style={{ color: AZUL }}
          >
            C
          </div>
          <div className="leading-tight text-white">
            <div className="text-sm font-semibold tracking-wide">C CONSULTING GROUP</div>
            <div className="text-[11px] text-white/60">Consórcio com o melhor preço</div>
          </div>
        </div>
        <a href="#diagnostico">
          <Button
            size="sm"
            className="rounded-sm bg-white font-medium hover:bg-white/90"
            style={{ color: AZUL }}
          >
            Fazer diagnóstico
          </Button>
        </a>
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
          C Consulting Group · Consórcios
        </p>
        <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">
          O consórcio que você quer,
          <br />
          pelo{' '}
          <span className="underline decoration-white/40 underline-offset-8">
            melhor preço
          </span> do
          mercado.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base text-white/70">
          Cotamos entre as principais administradoras do Brasil e encontramos para você o melhor
          preço, o melhor prazo e a melhor condição. Sem custo, sem compromisso.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href="#simulador" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full rounded-sm bg-white px-8 font-semibold hover:bg-white/90"
              style={{ color: AZUL }}
            >
              Já sei o que quero → simular
            </Button>
          </a>
          <a href="#diagnostico" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="w-full rounded-sm border-white/40 bg-transparent px-8 font-semibold text-white hover:bg-white/10 hover:text-white"
            >
              Não sei por onde começar → diagnóstico
            </Button>
          </a>
        </div>
      </div>
    </section>
  )
}

function Caminhos() {
  const cards = [
    {
      titulo: 'Já sei o que quero',
      desc: 'Você já definiu o bem — moto, carro, imóvel. Simule em 1 minuto, compare o preço entre as administradoras e feche.',
      cta: 'Simular agora',
      href: '#simulador',
      destaque: false,
    },
    {
      titulo: 'Diagnóstico + Cotação',
      desc: 'Nosso carro-chefe: um diagnóstico guiado entende seu objetivo e nosso motor cota todas as administradoras para achar a melhor condição.',
      cta: 'Começar diagnóstico',
      href: '#diagnostico',
      destaque: true,
    },
  ]
  return (
    <section className="w-full px-4 py-16" style={{ background: '#faf9f5' }}>
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
                Carro-chefe
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
  const [bemId, setBemId] = useState('moto')
  const [credito, setCredito] = useState(20000)
  const [prazo, setPrazo] = useState(48)
  const bem = BENS.find((b) => b.id === bemId)!

  const opcoes = Object.values(TAXAS)
    .map((t) => ({ nome: t.nome, taxa: t[bem.tipo as 'auto' | 'imovel' | 'servicos'] }))
    .filter((o): o is { nome: string; taxa: number } => o.taxa !== null)
    .map((o) => ({
      ...o,
      parcela: estimarParcela(credito, o.taxa, prazo),
      total: credito * (1 + o.taxa / 100),
    }))
    .sort((a, b) => a.total - b.total)

  return (
    <section id="simulador" className="w-full px-4 py-16" style={{ background: '#eef3f6' }}>
      <div className="mx-auto max-w-5xl">
        <p
          className="text-xs font-semibold uppercase tracking-[0.2em]"
          style={{ color: AZUL_MEDIO }}
        >
          Caminho direto
        </p>
        <h2 className="mt-2 text-3xl font-bold" style={{ color: AZUL }}>
          Simule e compare o preço
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-gray-600">
          Escolha o bem, o crédito e o prazo. Comparamos as principais administradoras usando a taxa
          média de administração publicada pelo Banco Central (maio/2026, ponderada por cotas
          ativas).
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-5">
          <div className="rounded-sm border border-gray-200 bg-white p-6 lg:col-span-2">
            <Label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              1. Qual bem?
            </Label>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {BENS.map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    setBemId(b.id)
                    setCredito(b.creditoPadrao)
                  }}
                  className="rounded-sm border px-4 py-3 text-sm font-medium transition-colors"
                  style={
                    bemId === b.id
                      ? { background: AZUL, color: '#fff', borderColor: AZUL }
                      : { background: '#fff', color: AZUL, borderColor: '#e5e7eb' }
                  }
                >
                  {b.label}
                </button>
              ))}
            </div>

            <Label className="mt-8 block text-xs font-semibold uppercase tracking-wide text-gray-500">
              2. Crédito desejado:{' '}
              <span className="font-bold" style={{ color: AZUL }}>
                {fmtBRL(credito)}
              </span>
            </Label>
            <Slider
              className="mt-4"
              min={bem.tipo === 'imovel' ? 100000 : 5000}
              max={bem.tipo === 'imovel' ? 1000000 : 200000}
              step={bem.tipo === 'imovel' ? 10000 : 5000}
              value={[credito]}
              onValueChange={(v) => setCredito(v[0])}
            />

            <Label className="mt-8 block text-xs font-semibold uppercase tracking-wide text-gray-500">
              3. Prazo
            </Label>
            <div className="mt-3 flex flex-wrap gap-2">
              {PRAZOS.map((p) => (
                <button
                  key={p}
                  onClick={() => setPrazo(p)}
                  className="rounded-sm border px-3 py-2 text-sm font-medium"
                  style={
                    prazo === p
                      ? { background: AZUL, color: '#fff', borderColor: AZUL }
                      : { background: '#fff', color: AZUL, borderColor: '#e5e7eb' }
                  }
                >
                  {p}x
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-sm border border-gray-200 bg-white p-6 lg:col-span-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Comparativo de administradoras
              </h3>
              <span className="text-[11px] text-gray-400">ordenado por custo total</span>
            </div>
            <div className="mt-4 space-y-3">
              {opcoes.map((o, i) => (
                <div
                  key={o.nome}
                  className="flex items-center justify-between rounded-sm border p-4"
                  style={
                    i === 0
                      ? { borderColor: AZUL_MEDIO, borderWidth: 2, background: '#f0f6f0' }
                      : { borderColor: '#e5e7eb' }
                  }
                >
                  <div>
                    <div className="flex items-center gap-2">
                      {i === 0 && (
                        <span className="rounded-sm bg-green-700 px-1.5 py-0.5 text-[10px] font-bold text-white">
                          MELHOR PREÇO
                        </span>
                      )}
                      <span className="font-semibold" style={{ color: AZUL }}>
                        {o.nome}
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      Taxa de adm.: {o.taxa.toFixed(2).replace('.', ',')}% · {prazo} parcelas
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold" style={{ color: AZUL }}>
                      {fmtBRL(o.parcela)}/mês
                    </div>
                    <div className="text-xs text-gray-500">Custo total: {fmtBRL(o.total)}</div>
                  </div>
                </div>
              ))}
              {bem.tipo === 'servicos' && (
                <p className="text-xs text-gray-500">
                  Para consórcio de serviços, as taxas variam por administradora e tipo de serviço —
                  nosso time coleta as condições oficiais para o seu caso.
                </p>
              )}
            </div>
            <p className="mt-4 text-[11px] leading-relaxed text-gray-400">
              Valores estimados para orientação inicial (parcela = crédito + taxa de administração ÷
              prazo; não inclui fundo de reserva, seguro ou reajustes). A cotação oficial é feita
              com a administradora, com condições do dia.
            </p>
            <a href="#lead">
              <Button
                className="mt-4 w-full rounded-sm font-semibold text-white"
                style={{ background: AZUL_MEDIO }}
              >
                Quero a cotação oficial com essas condições
              </Button>
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
]

function Diagnostico() {
  const [etapa, setEtapa] = useState(0)
  const [respostas, setRespostas] = useState<Record<string, string>>({})
  const [enviado, setEnviado] = useState(false)
  const [nome, setNome] = useState('')
  const [whats, setWhats] = useState('')

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
    .map((t) => ({ nome: t.nome, taxa: t[tipoBem as 'auto' | 'imovel' | 'servicos'] }))
    .filter((o): o is { nome: string; taxa: number } => o.taxa !== null)
    .map((o) => ({
      ...o,
      parcela: estimarParcela(credito, o.taxa, 48),
      total: credito * (1 + o.taxa / 100),
    }))
    .sort((a, b) => a.total - b.total)

  return (
    <section id="diagnostico" className="w-full px-4 py-16" style={{ background: AZUL }}>
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
          Nosso carro-chefe
        </p>
        <h2 className="mt-2 text-3xl font-bold text-white">Diagnóstico + cotação completa</h2>
        <p className="mt-2 text-sm text-white/70">
          6 perguntas rápidas. No final, montamos seu perfil e cotamos entre as principais
          administradoras para entregar o melhor preço, prazo e condição.
        </p>

        <div className="mt-8 rounded-sm bg-white p-8">
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

          {concluido && !enviado && (
            <>
              <span className="inline-block rounded-sm bg-green-700 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                Perfil gerado
              </span>
              <h3 className="mt-4 text-xl font-bold" style={{ color: AZUL }}>
                Diagnóstico concluído. Este é o seu perfil:
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
              </div>
              <h4 className="mt-6 text-sm font-semibold uppercase tracking-wide text-gray-500">
                Prévia do comparativo (crédito de {fmtBRL(credito)}, 48x)
              </h4>
              <div className="mt-3 space-y-2">
                {opcoes.map((o, i) => (
                  <div
                    key={o.nome}
                    className="flex items-center justify-between rounded-sm border p-3"
                    style={
                      i === 0
                        ? { borderColor: AZUL_MEDIO, borderWidth: 2 }
                        : { borderColor: '#e5e7eb' }
                    }
                  >
                    <span className="text-sm font-semibold" style={{ color: AZUL }}>
                      {i === 0 && (
                        <span className="mr-2 rounded-sm bg-green-700 px-1.5 py-0.5 text-[10px] font-bold text-white">
                          MELHOR
                        </span>
                      )}
                      {o.nome}
                    </span>
                    <span className="text-sm font-bold" style={{ color: AZUL }}>
                      {fmtBRL(o.parcela)}/mês
                    </span>
                  </div>
                ))}
              </div>
              <div id="lead" className="mt-8 border-t pt-6">
                <h4 className="font-bold" style={{ color: AZUL }}>
                  Receba sua cotação oficial
                </h4>
                <p className="mt-1 text-sm text-gray-600">
                  Nosso time cota com as administradoras nas condições do dia e envia o comparativo
                  completo no seu WhatsApp.
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="nome">Nome</Label>
                    <Input
                      id="nome"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Seu nome"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="whats">WhatsApp</Label>
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
                  disabled={!nome || whats.length < 8}
                  onClick={() => setEnviado(true)}
                >
                  Quero minha cotação oficial
                </Button>
              </div>
            </>
          )}

          {enviado && (
            <div className="py-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl">
                ✓
              </div>
              <h3 className="mt-4 text-xl font-bold" style={{ color: AZUL }}>
                Recebido, {nome.split(' ')[0]}!
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-gray-600">
                Seu diagnóstico foi registrado. Nosso time vai cotar com as administradoras e te
                enviar o comparativo oficial — melhor preço, melhor prazo e melhor condição — no
                WhatsApp {whats}.
              </p>
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
      d: 'Cotamos entre as principais administradoras do Brasil — você vê o preço lado a lado.',
    },
    {
      t: 'Melhor preço, prazo e condição',
      d: 'Não olhamos só a parcela: analisamos custo total, taxa, fundo de reserva e condições de lance.',
    },
    {
      t: 'Acompanhamento completo',
      d: 'Da cotação ao fechamento no ambiente oficial da administradora, com time especializado.',
    },
  ]
  return (
    <section className="w-full px-4 py-16" style={{ background: '#faf9f5' }}>
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-2xl font-bold" style={{ color: AZUL }}>
          Por que cotar com a C Consulting Group?
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
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="w-full px-4 py-10" style={{ background: AZUL }}>
      <div className="mx-auto max-w-6xl text-center text-xs text-white/50">
        <p className="font-semibold tracking-wide text-white/80">C CONSULTING GROUP · Recife, PE</p>
        <p className="mt-3 max-w-2xl mx-auto leading-relaxed">
          Protótipo em desenvolvimento. As estimativas exibidas usam a taxa média de administração
          publicada pelo Banco Central (maio/2026, ponderada por cotas ativas) e não constituem
          oferta ou cotação oficial. A contratação ocorre no ambiente oficial da administradora
          escolhida. Sistema de consórcios regulado pelo Banco Central.
        </p>
      </div>
    </footer>
  )
}

const Index = () => {
  return (
    <div className="min-h-screen" style={{ background: '#faf9f5' }}>
      <Header />
      <Hero />
      <Caminhos />
      <Simulador />
      <Diagnostico />
      <PorQue />
      <Footer />
    </div>
  )
}

export default Index
