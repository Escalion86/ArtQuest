import check from 'telegram/func/check'
import getGame from 'telegram/func/getGame'

const gameResultAdminBack = async ({ telegramId, jsonCommand }) => {
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

  if (!game.result) {
    return {
      message: 'Результаты игры еще не сформированы',
      nextCommand: { c: 'editGame', gameId: jsonCommand.gameId },
    }
  }

  return {
    message: game.result.text,
    buttons: [
      {
        text: '\u{2B05} Назад',
        c: { c: 'editGame', gameId: jsonCommand.gameId },
      },
    ],
  }
}

export default gameResultAdminBack
