import getSecondsBetween from '@helpers/getSecondsBetween'
import GamesTeams from '@models/GamesTeams'
import Teams from '@models/Teams'
import check from 'telegram/func/check'
import getGame from 'telegram/func/getGame'
import secondsToTime from 'telegram/func/secondsToTime'

const durationCalc = ({ startTime, endTime }) => {
  if (!startTime || !endTime) return null
  const tempArray = []
  for (let i = 0; i < startTime.length; i++) {
    if (!endTime[i]) tempArray.push(CLUE_DURATION_SEC * 3)
    else tempArray.push(getSecondsBetween(startTime[i], endTime[i]))
  }
  return tempArray
}

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

  const tasksDuration = gameTeams.map((gameTeam) => ({
    teamId: gameTeam.teamId,
    duration: durationCalc(gameTeam),
  }))
  console.log('tasksDuration :>> ', tasksDuration)

  const text = game.tasks.map((task, index) => {
    return `\n<b>"${task.title}"</b>${teams.map(
      (team) =>
        `\n- ${team.name} - ${secondsToTime(
          tasksDuration.find((item) => item.taskId === String(team._id))
            ?.duration[index]
        )}`
    )}`
  })

  return {
    message: `<b>Результаты игры:</b>\n${text}`,
    nextCommand: { c: 'editGame', gameId: jsonCommand.gameId },
  }
}

export default gameResult