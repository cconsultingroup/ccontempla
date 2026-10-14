migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('leads')
    if (!col.fields.getByName('melhorHorarioContato')) {
      col.fields.add(
        new TextField({
          name: 'melhorHorarioContato',
          required: false,
        }),
      )
      app.save(col)
    }
  },
  (app) => {
    const col = app.findCollectionByNameOrId('leads')
    const field = col.fields.getByName('melhorHorarioContato')
    if (field) {
      col.fields.remove(field)
      app.save(col)
    }
  },
)
