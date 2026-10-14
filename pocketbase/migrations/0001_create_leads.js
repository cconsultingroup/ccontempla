migrate(
  (app) => {
    const collection = new Collection({
      name: 'leads',
      type: 'base',
      // Leitura, atualização e deleção permitidas apenas para usuários autenticados (parceiros/admins)
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      // Criação pública: clientes anônimos concluem o diagnóstico no site e criam o lead
      createRule: '',
      fields: [
        { name: 'nome', type: 'text', required: true },
        { name: 'telefone', type: 'text', required: true },
        { name: 'objetivo', type: 'text', required: false },
        { name: 'tipoBem', type: 'text', required: false },
        { name: 'faixaValor', type: 'text', required: false },
        { name: 'prazoContemplacao', type: 'text', required: false },
        { name: 'parcelaOrcamento', type: 'text', required: false },
        { name: 'urgencia', type: 'text', required: false },
        { name: 'creditoEstimado', type: 'number', required: false },
        {
          name: 'origem',
          type: 'select',
          required: false,
          values: ['diagnostico', 'simulador', 'site'],
          maxSelect: 1,
        },
        {
          name: 'status',
          type: 'select',
          required: false,
          values: ['novo', 'em_atendimento', 'ganho', 'perdido'],
          maxSelect: 1,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_leads_created ON leads (created DESC)',
        'CREATE INDEX idx_leads_status ON leads (status)',
      ],
    })

    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('leads')
    app.delete(collection)
  },
)
