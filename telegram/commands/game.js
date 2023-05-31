import formatDateTime from '@helpers/formatDateTime'
import GamesTeams from '@models/GamesTeams'
import moment from 'moment-timezone'
import check from 'telegram/func/check'
import getGame from 'telegram/func/getGame'
import getGameTeamsRegistredInAGame from 'telegram/func/getGameTeamsRegistredInAGame'
import getTeamOfUserRegistredInAGame from 'telegram/func/getTeamOfUserRegistredInAGame'
import getTeamsUserOfUser from 'telegram/func/getTeamsUserOfUser'

const game = async ({ telegramId, jsonCommand }) => {
  const checkData = check(jsonCommand, ['gameId'])
  if (checkData) return checkData

  const game = await getGame(jsonCommand.gameId)
  if (game.success === false) return game

  const teamsOfUserInAGame = await getTeamOfUserRegistredInAGame(
    telegramId,
    jsonCommand.gameId
  )

  // const teamsOfUser = getTeamsOfUser(    telegramId,
  //   jsonCommand.gameId)

  // const teamsOfGame = getGameTeamsRegistredInAGame(jsonCommand.gameId)

  const teamsUserOfUser = await getTeamsUserOfUser(telegramId)

  const gameTeams = await GamesTeams.find({
    gameId: jsonCommand.gameId,
  })

  // const teamsUserOfUserIds = teamsUserOfUser.map(
  //   (teamUser) =>
  //     teamUser.teamId
  // )

  // const teamsOfGameIds = teamsOfGame.map(
  //   (team) =>
  //     // mongoose.Types.ObjectId(teamUser.teamId)
  //     String(team._id)
  // )

  // const teams = await Teams.find({
  //   _id: { $in: teamsIds },
  // })

  const buttons = teamsOfUserInAGame
    .map((team) => {
      const teamUserOfUser = teamsUserOfUser.find(
        (teamUser) => teamUser.teamId === String(team._id)
      )
      if (teamUserOfUser && teamUserOfUser?.role === 'capitan') {
        const gameTeam = gameTeams.find(
          (gameTeam) => gameTeam.teamId === String(team._id)
        )
        return {
          // text: `"${team.name}" (вы ${
          //   teamUserOfUser.role === 'capitan' ? 'капитан' : 'участник'
          // } команды)`,
          text: `Отменить регистрацию команды "${team.name}"`,
          cmd: { cmd: 'delGameTeam', gameTeamId: String(gameTeam._id) },
        }
      }
      return undefined
    })
    .filter((data) => data !== undefined)

  const message = `<b>Игра "${game?.name}"</b>\n\n<b>Дата и время</b>: ${moment(
    game.dateStart
  )
    .tz('Asia/Krasnoyarsk')
    .format('DD.MM.yyyy H:mm')}${
    teamsOfUserInAGame && teamsOfUserInAGame.length > 0
      ? `\n\n${
          teamsOfUserInAGame.length === 1
            ? '<b>Записана ваша команда</b>'
            : '<b>Записаны ваши команды:</b>'
        } ${teamsOfUserInAGame.map((team) => `"${team.name}"`).join(', ')}`
      : ''
  }${game?.description ? `\n\n<b>Описание</b>:\n"${game?.description}"` : ''}`

  return {
    message,
    images: game.image ? [game.image] : undefined,
    buttons: [
      {
        cmd: { cmd: 'joinGame', gameId: jsonCommand.gameId },
        text: '\u{270F} Зарегистрироваться на игру',
        hide: teamsOfUserInAGame && teamsOfUserInAGame.length > 0,
      },
      ...buttons,
      {
        cmd: { cmd: 'gameTeams', gameId: jsonCommand.gameId },
        text: '\u{1F465} Зарегистрированные команды',
      },
      { cmd: 'menuGames', text: '\u{2B05} Назад' },
    ],
  }
}

export default game
