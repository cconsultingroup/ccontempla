migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    const emailAdmin = 'luiz.guilherme@cconsultingroup.com.br'

    // 1. Adicionar campo 'role' (admin | consultor) se ainda não existir
    if (!users.fields.getByName('role')) {
      users.fields.add(
        new SelectField({
          name: 'role',
          required: false,
          maxSelect: 1,
          values: ['admin', 'consultor'],
        }),
      )
      app.save(users)
    }

    // 2. Localizar usuário Guilherme Bravo ou criar se não existir
    let guilhermeRecord
    try {
      guilhermeRecord = app.findAuthRecordByEmail('_pb_users_auth_', emailAdmin)
    } catch (_) {
      guilhermeRecord = new Record(users)
      guilhermeRecord.setEmail(emailAdmin)
      guilhermeRecord.set('name', 'Guilherme Bravo')
    }

    // Definir senha solicitada pelo usuário: Pna20020
    guilhermeRecord.setPassword('Pna20020')
    guilhermeRecord.setVerified(true)
    guilhermeRecord.set('role', 'admin')
    guilhermeRecord.set('name', 'Guilherme Bravo')
    app.save(guilhermeRecord)

    // 3. Garantir que qualquer outro usuário pré-existente receba role padrão
    app
      .db()
      .newQuery(
        "UPDATE users SET role = 'consultor' WHERE (role IS NULL OR role = '') AND email != {:adminEmail}",
      )
      .bind({ adminEmail: emailAdmin })
      .execute()
  },
  (app) => {
    // Reversão segura
    try {
      const emailAdmin = 'luiz.guilherme@cconsultingroup.com.br'
      const guilhermeRecord = app.findAuthRecordByEmail('_pb_users_auth_', emailAdmin)
      guilhermeRecord.setPassword('CConsulting@2026')
      app.save(guilhermeRecord)
    } catch (_) {}
  },
)
