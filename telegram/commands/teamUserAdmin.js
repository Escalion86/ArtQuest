import Users from '@models/Users'
// import dbConnect from '@utils/dbConnect'
import check from 'telegram/func/check'
import getTeam from 'telegram/func/getTeam'
import getTeamUser from 'telegram/func/getTeamUser'

const teamUserAdmin = async ({ telegramId, jsonCommand }) => {
  const checkData = check(jsonCommand, ['teamUserId'])
  if (checkData) return checkData

  const teamUser = await getTeamUser(jsonCommand.teamUserId)
  if (teamUser.success === false) return teamUser

  const isCapitan = teamUser.role === 'capitan'

  const team = await getTeam(teamUser.teamId)
  if (team.success === false) return team

  const user = await Users.findOne({
    telegramId: teamUser.userTelegramId,
  })
  if (!user || user.length === 0) {
    return {
      message: 'Ошибка. Не найден пользователь привязанный к команде',
      nextCommand: `teamUsersAdmin`,
    }
  }

  const buttons = [
    {
      url: `t.me/+${user.phone}`,
      text: '\u{2712} Написать в личку',
    },
    {
      c: {
        c: 'delTeamUserAdmin',
        teamUserId: jsonCommand.teamUserId,
      },
      hide: isCapitan,
      text: '\u{1F4A3} Удалить из команды',
    },
    {
      c: { c: 'teamUsersAdmin', teamId: teamUser.teamId },
      text: '\u{2B05} Назад',
    },
  ]

  return {
    message: `<b>АДМИНИСТРИРОВАНИЕ</b>\n\n<b>"${user.name}" ${
      isCapitan ? 'капитан' : 'участник'
    } команды "${team.name}"</b>`,
    buttons,
    // parse_mode: 'Markdown',
  }
}

export default teamUserAdmin
