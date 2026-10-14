// Hook de administração de consultores da Área do Parceiro (C Consulting Group)
// Rotas customizadas registradas sob '/backend/v1/'
// IMPORTANTE: Todas as variáveis e funções devem ficar inline dentro de cada handler devido ao escopo do PocketBase JSVM.

// 1. GET /backend/v1/ccg/consultores — Listar todos os consultores/usuários
routerAdd(
  'GET',
  '/backend/v1/ccg/consultores',
  (e) => {
    const adminEmail = 'luiz.guilherme@cconsultingroup.com.br'
    const auth = e.auth
    if (!auth) {
      throw new UnauthorizedError('Acesso não autorizado. Faça login primeiro.')
    }

    const email = (auth.email || auth.getString?.('email') || '').toLowerCase().trim()
    const role = (auth.getString?.('role') || auth.role || '').toLowerCase().trim()
    const isAdmin = email === adminEmail || role === 'admin'
    if (!isAdmin) {
      throw new ForbiddenError('Acesso restrito ao administrador (Guilherme Bravo).')
    }

    const records = e.app.findRecordsByFilter('users', 'id != ""', '-created', 100, 0)
    const list = records.map((rec) => {
      const recEmail = rec.getString('email')
      const recRole = rec.getString('role') || (recEmail === adminEmail ? 'admin' : 'consultor')
      return {
        id: rec.id,
        name: rec.getString('name') || 'Consultor',
        email: recEmail,
        role: recRole,
        verified: rec.getBool('verified'),
        created: rec.getString('created'),
        updated: rec.getString('updated'),
      }
    })

    return e.json(200, { items: list })
  },
  $apis.requireAuth(),
)

// 2. POST /backend/v1/ccg/consultores — Criar novo consultor com senha inicial
routerAdd(
  'POST',
  '/backend/v1/ccg/consultores',
  (e) => {
    const adminEmail = 'luiz.guilherme@cconsultingroup.com.br'
    const auth = e.auth
    if (!auth) {
      throw new UnauthorizedError('Acesso não autorizado. Faça login primeiro.')
    }

    const authEmail = (auth.email || auth.getString?.('email') || '').toLowerCase().trim()
    const authRole = (auth.getString?.('role') || auth.role || '').toLowerCase().trim()
    const isAdmin = authEmail === adminEmail || authRole === 'admin'
    if (!isAdmin) {
      throw new ForbiddenError('Acesso restrito ao administrador (Guilherme Bravo).')
    }

    const body = e.requestInfo().body || {}
    const email = String(body.email || '')
      .trim()
      .toLowerCase()
    const name = String(body.name || '').trim()
    const password = String(body.password || '').trim()

    if (!email || !email.includes('@')) {
      throw new BadRequestError('Informe um e-mail válido para o consultor.')
    }
    if (!name) {
      throw new BadRequestError('Informe o nome completo do consultor.')
    }
    if (!password || password.length < 8) {
      throw new BadRequestError('A senha inicial deve ter no mínimo 8 caracteres.')
    }

    // Verificar se já existe usuário com esse e-mail
    try {
      e.app.findAuthRecordByEmail('_pb_users_auth_', email)
      throw new BadRequestError('Já existe um usuário cadastrado com este e-mail.')
    } catch (err) {
      if (err instanceof BadRequestError || (err && err.status === 400)) {
        throw err
      }
    }

    const usersCol = e.app.findCollectionByNameOrId('_pb_users_auth_')
    const newRecord = new Record(usersCol)
    newRecord.setEmail(email)
    newRecord.setPassword(password)
    newRecord.setVerified(true)
    newRecord.set('name', name)
    newRecord.set('role', 'consultor')

    e.app.save(newRecord)

    return e.json(201, {
      id: newRecord.id,
      name: newRecord.getString('name'),
      email: newRecord.getString('email'),
      role: 'consultor',
      created: newRecord.getString('created'),
      mensagem: 'Consultor cadastrado com sucesso!',
    })
  },
  $apis.requireAuth(),
)

// 3. POST /backend/v1/ccg/consultores/reset-password — Redefinir senha de um usuário
routerAdd(
  'POST',
  '/backend/v1/ccg/consultores/reset-password',
  (e) => {
    const adminEmail = 'luiz.guilherme@cconsultingroup.com.br'
    const auth = e.auth
    if (!auth) {
      throw new UnauthorizedError('Acesso não autorizado. Faça login primeiro.')
    }

    const authEmail = (auth.email || auth.getString?.('email') || '').toLowerCase().trim()
    const authRole = (auth.getString?.('role') || auth.role || '').toLowerCase().trim()
    const isAdmin = authEmail === adminEmail || authRole === 'admin'
    if (!isAdmin) {
      throw new ForbiddenError('Acesso restrito ao administrador (Guilherme Bravo).')
    }

    const body = e.requestInfo().body || {}
    const userId = String(body.userId || '').trim()
    const newPassword = String(body.newPassword || '').trim()

    if (!userId) {
      throw new BadRequestError('ID do usuário não fornecido.')
    }
    if (!newPassword || newPassword.length < 8) {
      throw new BadRequestError('A nova senha deve ter no mínimo 8 caracteres.')
    }

    let targetRecord
    try {
      targetRecord = e.app.findRecordById('users', userId)
    } catch (_) {
      throw new NotFoundError('Usuário não encontrado.')
    }

    targetRecord.setPassword(newPassword)
    targetRecord.setVerified(true)
    e.app.save(targetRecord)

    return e.json(200, {
      sucesso: true,
      mensagem: `Senha de ${targetRecord.getString('name') || targetRecord.getString('email')} redefinida com sucesso!`,
    })
  },
  $apis.requireAuth(),
)

// 4. DELETE /backend/v1/ccg/consultores/{id} — Excluir consultor
routerAdd(
  'DELETE',
  '/backend/v1/ccg/consultores/{id}',
  (e) => {
    const adminEmail = 'luiz.guilherme@cconsultingroup.com.br'
    const auth = e.auth
    if (!auth) {
      throw new UnauthorizedError('Acesso não autorizado. Faça login primeiro.')
    }

    const authEmail = (auth.email || auth.getString?.('email') || '').toLowerCase().trim()
    const authRole = (auth.getString?.('role') || auth.role || '').toLowerCase().trim()
    const isAdmin = authEmail === adminEmail || authRole === 'admin'
    if (!isAdmin) {
      throw new ForbiddenError('Acesso restrito ao administrador (Guilherme Bravo).')
    }

    const targetId = e.request.pathValue('id')
    if (!targetId) {
      throw new BadRequestError('ID do consultor não informado.')
    }

    let targetRecord
    try {
      targetRecord = e.app.findRecordById('users', targetId)
    } catch (_) {
      throw new NotFoundError('Consultor não encontrado.')
    }

    const targetEmail = (targetRecord.getString('email') || '').toLowerCase().trim()
    if (targetEmail === adminEmail) {
      throw new BadRequestError('Não é permitido excluir o usuário administrador principal.')
    }

    if (e.auth && e.auth.id === targetId) {
      throw new BadRequestError('Você não pode excluir sua própria conta enquanto logado.')
    }

    e.app.delete(targetRecord)

    return e.json(200, {
      sucesso: true,
      mensagem: 'Consultor excluído com sucesso.',
    })
  },
  $apis.requireAuth(),
)
