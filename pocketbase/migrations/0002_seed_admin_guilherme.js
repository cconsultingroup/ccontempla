migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    const emailGuilherme = 'luiz.guilherme@cconsultingroup.com.br'

    try {
      app.findAuthRecordByEmail('_pb_users_auth_', emailGuilherme)
      return // Usuário já existe
    } catch (_) {}

    const record = new Record(users)
    record.setEmail(emailGuilherme)
    // Senha inicial segura e documentada para primeiro acesso do Guilherme Bravo
    record.setPassword('CConsulting@2026')
    record.setVerified(true)
    record.set('name', 'Guilherme Bravo')
    app.save(record)
  },
  (app) => {
    try {
      const record = app.findAuthRecordByEmail(
        '_pb_users_auth_',
        'luiz.guilherme@cconsultingroup.com.br',
      )
      app.delete(record)
    } catch (_) {}
  },
)
