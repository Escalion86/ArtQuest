import Games from '@models/Games'
import GamesTeams from '@models/GamesTeams'
import Teams from '@models/Teams'
import TeamsUsers from '@models/TeamsUsers'
import check from 'telegram/func/check'
import formatGameName from 'telegram/func/formatGameName'
import getGame from 'telegram/func/getGame'
import sendMessage from 'telegram/sendMessage'

const gameStop = async ({ telegramId, jsonCommand }) => {
  const checkData = check(jsonCommand, ['gameId'])
  if (checkData) return checkData

  const game = await getGame(jsonCommand.gameId)
  if (game.success === false) return game

  await Games.findByIdAndUpdate(jsonCommand.gameId, {
    status: 'finished',
  })
  // Получаем список команд
  const gameTeams = await GamesTeams.find({
    gameId: jsonCommand.gameId,
  })

  const teamsIds = gameTeams.map((gameTeam) => gameTeam.teamId)

  // const teams = await Teams.find({
  //   _id: { $in: teamsIds },
  // })

  const teamsUsers = await TeamsUsers.find({
    teamId: { $in: teamsIds },
  })

  const usersTelegramIds = teamsUsers.map((teamUser) => teamUser.userTelegramId)
  console.log('usersTelegramIds :>> ', usersTelegramIds)
  // teamsIds.forEach((teamId) => {
  //   const gameTeam = gameTeams.find((gameTeam) => gameTeam.teamId === teamId)
  //   const usersTelegramIdsOfTeam = teamsUsers.filter((teamUser)=>teamUser.teamId === teamId).map((teamUser) => teamUser.userTelegramId)

  //   const taskNum = gameTeam?.tasks?.activeNum ?? 0
  //   const findedCodes = gameTeam?.tasks?.findedCodes ?? []
  // })

  // console.log('usersTelegramIds :>> ', usersTelegramIds)
  // await Promise.all(
  //   usersTelegramIds.map(async (telegramId) =>
  //     sendMessage({
  //       chat_id: telegramId,
  //       text: 'Игра началась!',
  //     })
  //   )
  // )

  return {
    message: `СТОП ИГРА!!\n\nИгра ${formatGameName(
      game
    )} ОСТАНОВЛЕНА.\n\n\u{26A0} Все игроки оповещены!`,
    nextCommand: { c: 'editGame', gameId: jsonCommand.gameId },
  }
}

export default gameStop
