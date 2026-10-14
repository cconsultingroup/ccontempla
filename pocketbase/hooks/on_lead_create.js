// Hook no PocketBase: notificação de novo lead registrado pelo site/diagnóstico
// Quando um lead é criado na coleção 'leads', registra log detalhado e tenta enviar
// e-mail para o parceiro consultor (caso o servidor SMTP esteja configurado no painel).

onRecordCreate((e) => {
  e.next()

  try {
    const nome = e.record.getString('nome') || 'Cliente'
    const telefone = e.record.getString('telefone') || 'Não informado'
    const objetivo = e.record.getString('objetivo') || 'Consórcio'
    const tipoBem = e.record.getString('tipoBem') || 'Não informado'
    const faixaValor = e.record.getString('faixaValor') || 'Não informada'
    const melhorHorario = e.record.getString('melhorHorarioContato') || 'Não especificado'
    const origem = e.record.getString('origem') || 'diagnostico'

    console.log(
      `[LEAD NOVO NOTIFICAÇÃO] Lead recebido via ${origem}: Nome: ${nome} | Tel: ${telefone} | Bem: ${tipoBem} | Valor: ${faixaValor} | Horário: ${melhorHorario}`,
    )

    // E-mail do parceiro responsável (Guilherme Bravo / C Consulting Group)
    const emailDestinatario = 'luiz.guilherme@cconsultingroup.com.br'

    // Tenta disparar e-mail de aviso usando o mailer nativo do PocketBase
    // Se o SMTP ainda não estiver configurado no painel Skip Cloud, a chamada cai no catch
    // e o lead continua salvo normalmente sem bloquear a experiência do usuário.
    try {
      const message = new MailerMessage({
        from: {
          address: $app.settings().meta.senderAddress || 'noreply@cconsultingroup.com.br',
          name: $app.settings().meta.senderName || 'C Consulting Group - Notificações',
        },
        to: [{ address: emailDestinatario }],
        subject: `🔔 Novo Lead de Consórcio: ${nome} (${tipoBem})`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h2 style="color: #0A1F38; margin-bottom: 8px;">Novo Lead Cadastrado no Site!</h2>
            <p style="color: #4a5568; font-size: 14px; margin-top: 0;">Um cliente acabou de concluir o diagnóstico de consórcio da C Consulting Group.</p>
            <hr style="border: 0; border-top: 1px solid #edf2f7; margin: 16px 0;" />
            <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #2d3748;">
              <tr><td style="padding: 6px 0; font-weight: bold; width: 140px;">Nome:</td><td>${nome}</td></tr>
              <tr><td style="padding: 6px 0; font-weight: bold;">WhatsApp:</td><td><a href="https://wa.me/55${telefone.replace(/\\D/g, '')}" style="color: #10b981; font-weight: bold; text-decoration: none;">${telefone}</a></td></tr>
              <tr><td style="padding: 6px 0; font-weight: bold;">Tipo de Bem:</td><td>${tipoBem}</td></tr>
              <tr><td style="padding: 6px 0; font-weight: bold;">Faixa de Valor:</td><td>${faixaValor}</td></tr>
              <tr><td style="padding: 6px 0; font-weight: bold;">Objetivo:</td><td>${objetivo}</td></tr>
              <tr><td style="padding: 6px 0; font-weight: bold;">Melhor Horário:</td><td><span style="background-color: #ebf8ff; color: #2b6cb0; padding: 2px 8px; border-radius: 4px; font-weight: bold;">${melhorHorario}</span></td></tr>
              <tr><td style="padding: 6px 0; font-weight: bold;">Origem:</td><td>${origem}</td></tr>
            </table>
            <div style="margin-top: 24px; text-align: center;">
              <a href="https://wa.me/55${telefone.replace(/\\D/g, '')}" style="background-color: #10b981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                Falar com o Lead no WhatsApp
              </a>
            </div>
            <p style="font-size: 11px; color: #a0aec0; margin-top: 24px; text-align: center;">
              Notificação automática gerada pela Área do Parceiro C Consulting Group.
            </p>
          </div>
        `,
      })

      $app.newMailClient().send(message)
      console.log(
        `[LEAD NOTIFICAÇÃO EMAIL] Notificação por e-mail enviada com sucesso para ${emailDestinatario}`,
      )
    } catch (mailErr) {
      // SMTP ainda não configurado no painel ou erro transitório de envio
      console.warn(
        `[LEAD NOTIFICAÇÃO EMAIL PENDENTE] Não foi possível enviar e-mail externo para ${emailDestinatario} (requer configuração do servidor SMTP no painel administrativo): ${mailErr}`,
      )
    }
  } catch (err) {
    console.error('[LEAD HOOK ERRO]:', err)
  }
}, 'leads')
