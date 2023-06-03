import getSecondsBetween from '@helpers/getSecondsBetween'
import Games from '@models/Games'
import GamesTeams from '@models/GamesTeams'
import LastCommands from '@models/LastCommands'
import Teams from '@models/Teams'
import TeamsUsers from '@models/TeamsUsers'
import check from 'telegram/func/check'
import formatGameName from 'telegram/func/formatGameName'
import getGame from 'telegram/func/getGame'
import sendMessage from 'telegram/sendMessage'

const gameResult = async ({ telegramId, jsonCommand }) => {
  const checkData = check(jsonCommand, ['gameId'])
  if (checkData) return checkData

  const game = await getGame(jsonCommand.gameId)
  if (game.success === false) return game

  if (game.status !== 'finished') {
    return {
      message: 'Игра еще не завершена',
      nextCommand: { c: 'editGame', gameId: jsonCommand.gameId },
    }
  }

  // Получаем список команд участвующих в игре
  const gameTeams = await GamesTeams.find({
    gameId: jsonCommand.gameId,
  })

  const teamsIds = gameTeams.map((gameTeam) => gameTeam.teamId)

  const teams = await Teams.find({
    _id: { $in: teamsIds },
  })

  const durationCalc = ({ startTime, endTime }) => {
    if (!startTime || !endTime) return null
    const tempArray = []
    for (let i = 0; i < startTime.length; i++) {
      if (!endTime[i]) tempArray.push(CLUE_DURATION_SEC * 3)
      else tempArray.push(getSecondsBetween(startTime[i], endTime[i]))
    }
    return tempArray
  }

  const tasksDuration = gameTeams.map((gameTeam) => ({
    teamId: gameTeam.teamId,
    duration: durationCalc(gameTeam),
  }))
  console.log('tasksDuration :>> ', tasksDuration)

  const text = game.tasks.map((task, index) => {
    return `<b>"${task.title}"</b>${teams.map(
      (team) =>
        `\n- ${team.name} - ${secondsToTime(tasksDuration[String(team._id)])}`
    )}`
  })

  return {
    message: `<b>Результаты игры:</b>\n\n${text}`,
    nextCommand: { c: 'editGame', gameId: jsonCommand.gameId },
  }
}

export default gameResult
