import TeamsUsers from '@models/TeamsUsers'
import Users from '@models/Users'
import dbConnect from '@utils/dbConnect'
import check from 'telegram/func/check'

const userAdmin = async ({ telegramId, jsonCommand }) => {
  const checkData = check(jsonCommand, ['userTId'])
  if (checkData) return checkData

  await dbConnect()
  const user = await Users.findOne({ telegramId: jsonCommand.userTId })
  const teamsUsers = await TeamsUsers.find({ telegramId: jsonCommand.userTId })

  return {
    message: `<b>"${user.name}"</b>\nСостоит в ${teamsUsers.length} командах${
      teamsUsers.length > 0
        ? `:\n${teamsUsers.map(({ name }) => name).join('\n')}))}`
        : ''
    }\n\n<a href="tg://user?id=${user.telegramId}">Написать в личку</a>`,
    buttons: [
      {
        text: '\u{1F517} Записать в команду',
        c: {
          c: 'userJoinToTeam',
          userTId: jsonCommand.userTId,
        },
      },
      {
        c: 'allUsers',
        text: '\u{2B05} Назад',
      },
    ],
  }
}

export default userAdmin
