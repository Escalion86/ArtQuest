import Teams from '@models/Teams'
import TeamsUsers from '@models/TeamsUsers'
import check from 'telegram/func/check'
import getGame from 'telegram/func/getGame'
import getGameTeam from 'telegram/func/getGameTeam'
import getTeam from 'telegram/func/getTeam'

const gameTeam = async ({ telegramId, jsonCommand }) => {
  const checkData = check(jsonCommand, ['gameTeamId'])
  if (checkData) return checkData

  const gameTeam = await getGameTeam(jsonCommand.gameTeamId)
  if (gameTeam.success === false) return gameTeam

  const game = await getGame(gameTeam.gameId)
  if (game.success === false) return game

  const team = await getTeam(gameTeam.teamId)
  if (team.success === false) return team

  const teamUsers = await TeamsUsers.findOne({
    // userTelegramId: telegramId,
    teamId: String(team._id),
  })

  const usersTelegramIds = teamUsers.map((teamUser) => teamUser.userTelegramId)

  const users = await Teams.find({
    telegramId: { $in: usersTelegramIds },
  })

  const teamUser = teamUsers.find(
    (teamUser) => teamUser.userTelegramId === telegramId
  )

  return {
    message: `<b>Игра "${game.name}"\n\nКоманда "${
      team?.name
    }"</b>\n\n<b>Состав команды</b>: ${users
      .map((user) => ` - ${user.name}`)
      .join('\n')}`,
    buttons: [
      {
        cmd: {
          cmd: 'delGameTeam',
          gameTeamId: jsonCommand.gameTeamId,
        },
        text: '\u{1F4A3} Удалить команду из игры',
        hide: teamUser?.role !== 'capitan',
      },
      {
        cmd: { cmd: 'gameTeams', gameId: String(game._id) },
        text: '\u{2B05} Назад',
      },
    ],
  }
}

export default gameTeam
