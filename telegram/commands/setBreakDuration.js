import secondsToTimeStr from '@helpers/secondsToTimeStr'
import Games from '@models/Games'

import check from 'telegram/func/check'

const setBreakDuration = async ({ telegramId, jsonCommand }) => {
  // --- НЕ САМОСТОЯТЕЛЬНАЯ КОМАНДА
  const checkData = check(jsonCommand, ['gameId'])
  if (checkData) return checkData

  if (!jsonCommand.message) {
    return {
      success: true,
      message: 'Введите продолжительность перерыва между заданиями в секундах',
      buttons: [
        {
          text: '\u{1F6AB} Отмена',
          c: { c: 'editGame', gameId: jsonCommand.gameId },
        },
      ],
    }
  }
  const value = parseInt(jsonCommand.message)
  const game = await Games.findByIdAndUpdate(jsonCommand.gameId, {
    breakDuration: value,
  })

  return {
    success: true,
    message: `Продолжительность перерыва между заданиями обновлено на "${secondsToTimeStr(
      value
    )}"`,
    nextCommand: { c: 'editGame', gameId: jsonCommand.gameId },
  }
}

export default setBreakDuration
