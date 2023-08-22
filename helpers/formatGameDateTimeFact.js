import dateToDateTimeStr from './dateToDateTimeStr'
import getGameDuration from './getGameDuration'

function formatGameDateTimeFact(game, props = {}) {
  if (!game) return undefined

  const {
    dontShowDayOfWeek,
    fullWeek,
    showYear,
    fullMonth,
    weekInBrackets,
    showDuration,
  } = props

  const dateStart = dateToDateTimeStr(
    game.dateStartFact,
    !dontShowDayOfWeek,
    fullMonth,
    showYear,
    true,
    fullWeek
  )
  const dateEnd = dateToDateTimeStr(
    game.dateEndFact,
    !dontShowDayOfWeek,
    fullMonth,
    showYear,
    true,
    fullWeek
  )
  var date = ''
  if (
    dateStart[0] === dateEnd[0] &&
    dateStart[1] === dateEnd[1] &&
    dateStart[3] === dateEnd[3]
  ) {
    date = `${dateStart[0]} ${dateStart[1]} ${
      weekInBrackets ? `(${dateStart[2]})` : dateStart[2]
    } ${dateStart[4]}:${dateStart[5]} - ${dateEnd[4]}:${dateEnd[5]}`
  } else {
    date = `${dateStart[0]} ${dateStart[1]} ${
      weekInBrackets ? `(${dateStart[2]})` : dateStart[2]
    } ${dateStart[4]}:${dateStart[5]} - ${dateEnd[0]} ${dateEnd[1]} ${
      weekInBrackets ? `(${dateEnd[2]})` : dateEnd[2]
    } ${dateEnd[4]}:${dateEnd[5]}`
  }
  return date + (showDuration ? ` (${getGameDuration(game)})` : '')
}

export default formatGameDateTimeFact
