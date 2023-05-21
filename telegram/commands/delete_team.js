import Teams from '@models/Teams'
import dbConnect from '@utils/dbConnect'
import propsToStr from 'telegram/func/propsToStr'

const delete_team = async ({ telegramId, message, props }) => {
  // --- НЕ САМОСТОЯТЕЛЬНАЯ КОМАНДА
  if (!props.teamId)
    return {
      success: false,
      message: 'Не удалось удалить команду, так как команда не найдена',
      nextCommand: `/menu_teams`,
    }
  if (!props.confirm) {
    props.confirm = 'true'
    return {
      success: true,
      message: 'Подтвердите удаление команды',
      buttons: [
        { text: 'Удалить', command: `delete_team` + propsToStr(props) },
        { text: 'Отмена', command: 'menu_teams' },
      ],
    }
  }
  await dbConnect()
  const team = await Teams.findByIdAndRemove(props.teamId)
  return {
    success: true,
    message: 'Команда удалена',
    nextCommand: `/menu_teams`,
  }
}

export default delete_team
