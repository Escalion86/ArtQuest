import Users from '@models/Users'
import executeCommand from './func/executeCommand'
import sendMessage from './sendMessage'

const checkContactRecive = async (message, domen) => {
  if (!message?.contact) return true
  const { contact, from } = message
  if (contact) {
    const { phone_number, first_name, last_name, user_id } = contact
    const name = (first_name + (last_name ? ' ' + last_name : '')).trim()
    const user = await Users.findOneAndUpdate(
      {
        telegramId: from.id,
      },
      {
        name,
        phone: Number(phone_number),
      },
      { upsert: true }
    )

    await sendMessage({
      chat_id: user_id,
      text: `Регистрация успешна! Ваши данные:\n - Имя: ${name}\n - Телефон: ${phone_number}`,
      // keyboard: {
      //   keyboard: [],
      //   inline_keyboard: [
      //     [{ text: 'Изменить имя', callback_data: `/setUserName` }],
      //     [{ text: '\u{1F3E0} Главное меню', callback_data: `/mainMenu` }],
      //   ],
      // },
      remove_keyboard: true,
      domen,
    })

    await executeCommand(
      user_id,
      { c: 'mainMenu' },
      undefined,
      undefined,
      domen
    )

    return false
  }
  return true
}

export default checkContactRecive
