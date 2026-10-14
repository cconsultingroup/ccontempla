migrate(
  (app) => {
    const leadsCol = app.findCollectionByNameOrId('leads')

    const seedData = [
      {
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

    for (const item of seedData) {
      try {
        app.findFirstRecordByData('leads', 'telefone', item.telefone)
        // Se já existir lead com esse telefone, não duplica
      } catch (_) {
        const record = new Record(leadsCol)
        record.set('nome', item.nome)
        record.set('telefone', item.telefone)
        record.set('objetivo', item.objetivo)
        record.set('tipoBem', item.tipoBem)
        record.set('faixaValor', item.faixaValor)
        record.set('prazoContemplacao', item.prazoContemplacao)
        record.set('parcelaOrcamento', item.parcelaOrcamento)
        record.set('urgencia', item.urgencia)
        record.set('creditoEstimado', item.creditoEstimado)
        record.set('origem', item.origem)
        record.set('status', item.status)
        app.save(record)
      }
    }
  },
  (app) => {
    const phones = ['(81) 99876-5432', '(81) 98123-4567']
    for (const phone of phones) {
      try {
        const rec = app.findFirstRecordByData('leads', 'telefone', phone)
        app.delete(rec)
      } catch (_) {}
    }
  },
)
