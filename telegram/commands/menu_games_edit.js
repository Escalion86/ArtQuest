import Games from '@models/Games'
import dbConnect from '@utils/dbConnect'
import main_menu_button from './menuItems/main_menu_button'

const menu_games_edit = async ({ telegramId, message, props }) => {
  await dbConnect()
  // Получаем список игр
  const games = await Games.find({})

  return {
    message: 'Конструктор игр',
    buttons: [
      ...games.map((game) => ({
        text: `\u{270F} "${game.name}"`,
        command: `edit_game/gameId=${game._id}`,
      })),
      { command: 'create_game', text: '\u{2795} Создать игру' },
      main_menu_button,
    ],
  }
}

export default menu_games_edit
