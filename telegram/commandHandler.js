import LastCommands from '@models/LastCommands'
import dbConnect from '@utils/dbConnect'
import sendMessage from './sendMessage'

const script = async ({ userTelegramId, command, text, keyboard }) => {
  if (command)
    await LastCommands.findOneAndUpdate(
      {
        userTelegramId,
      },
      { command },
      { upsert: true }
    )
  else
    await LastCommands.findOneAndDelete({
      userTelegramId,
    })
  return await sendMessage({
    chat_id: userTelegramId,
    // text: JSON.stringify({ body, headers: req.headers.origin }),
    text,
    keyboard,
  })
}

const sendError = async (userTelegramId) =>
  await sendMessage({
    chat_id: userTelegramId,
    text: 'Ошибка команды',
  })

var keyboardCreateTeam = {
  inline_keyboard: [
    [
      {
        text: 'Отмена создания команды',
        callback_data: '/create_team/exit',
      },
    ],
  ],
}

const allCommands = ['create_team', 'edit_team', 'join_team']

const commandHandler = async (userTelegramId, command, res) => {
  await dbConnect()

  const isItCommand = command[0] === '/'

  // Если была отправлена команда, то ищем ее или возвращаем ошибку
  if (isItCommand) {
    const commandsArray = command[0].split('/')
    commandsArray.shift()
    const mainCommand = commandsArray[0]
    // Если такой команды не зарегистрировано, то возвращаем ошибку
    if (!allCommands.includes(mainCommand))
      return await sendError(userTelegramId)
    // Если команда существует, то обрабатываем

    // Ищем была ли до этого сделана команда
    // const lastCommand = await LastCommands.find({ userTelegramId })
    // const isLastCommandExists = lastCommand && lastCommand.length !== 0
    // if (mainCommand === 'create_team') {
    //   if (isLastCommandExists) {
    //     const lastCommandsArray = lastCommand[0].command.split('/')
    //     lastCommandsArray.shift()
    //     const mainLastCommand = lastCommandsArray[0]
    //     // Проверяем, что предыдущая команда верна, если нет, то перезапускаем ее
    //     if (mainLastCommand === 'create_team') {
    //       const secondaryLastCommand = lastCommandsArray[1]
    //       if (secondaryLastCommand === 'set_name')
    //         return await script({
    //           userTelegramId,
    //           command: '/create_team/set_description',
    //           text: `Задано название команды: ${command}.\nВведите описание команды (не обязательно)`,
    //           keyboard: keyboardCreateTeam,
    //         })
    //       if (secondaryLastCommand === 'set_description')
    //         return await script({
    //           userTelegramId,
    //           text: `Задано описание команды: ${command}. Создание команды завершено`,
    //         })
    //     }
    //   }
    // Если ранее команд небыло, значит мы начали новую команду
    if (mainCommand === 'create_team')
      return await script({
        userTelegramId,
        command: '/create_team/set_name',
        text: 'Введите название команды',
        keyboard: keyboardCreateTeam,
      })

    return await script({
      userTelegramId,
      text: 'Неизвестная команда',
    })
    // }
  } else {
    // Если отправлен текст, то смотрим к какой команде он применяется
    // Ищем была ли до этого сделана команда
    const lastCommand = await LastCommands.find({ userTelegramId })
    const isLastCommandExists = lastCommand && lastCommand.length !== 0

    // Если до этого небыло никакой команды, то пишем что ждем команду
    if (!isLastCommandExists)
      return await script({
        userTelegramId,
        text: 'Пожалуйста введите команду',
      })

    const lastCommandsArray = lastCommand[0].command.split('/')
    lastCommandsArray.shift()
    const mainLastCommand = lastCommandsArray[0]

    if (mainLastCommand === 'create_team') {
      const secondaryLastCommand = lastCommandsArray[1]
      if (secondaryLastCommand === 'set_name')
        return await script({
          userTelegramId,
          command: '/create_team/set_description',
          text: `Задано название команды: ${command}.\nВведите описание команды (не обязательно)`,
          keyboard: keyboardCreateTeam,
        })
      if (secondaryLastCommand === 'set_description')
        return await script({
          userTelegramId,
          text: `Задано описание команды: ${command}. Создание команды завершено`,
        })
    }
    // Если возникла ошибка
    return await script({
      userTelegramId,
      text: 'ОШИБКА',
    })
  }

  // const lastCommand = await LastCommands.find({ userTelegramId })

  // if (lastCommand.length === 0) {
  //   return await script({
  //     userTelegramId,
  //     command: '/create_team/set_name',
  //     text: 'Введите название команды',
  //     keyboard: keyboardCreateTeam,
  //   })
  //   // console.log('==> /create_team/set_name')
  //   // await LastCommands.create({
  //   //   userTelegramId,
  //   //   command: '/create_team/set_name',
  //   // })
  //   // return await sendMessage({
  //   //   chat_id: userTelegramId,
  //   //   // text: JSON.stringify({ body, headers: req.headers.origin }),
  //   //   text: 'Введите название команды',
  //   //   keyboard,
  //   // })
  //   // return res?.status(200).json({ success: true, data })
  // } else {
  //   // Если небыло никаких команд с пользователем
  //   const commandsArray = String(lastCommand[0].command).split('/')
  //   commandsArray.shift()
  //   if (commandsArray[0] !== 'create_team') {
  //     console.log('create_team')
  //     return await sendMessage({
  //       chat_id: userTelegramId,
  //       // text: JSON.stringify({ body, headers: req.headers.origin }),
  //       text: 'Ошибка команды',
  //     })
  //   }

  //   if (commandsArray[1] === 'set_name')
  //     return await script({
  //       userTelegramId,
  //       command: '/create_team/set_description',
  //       text: `Задано название команды: ${command}.\nВведите описание команды (не обязательно)`,
  //       keyboard: keyboardCreateTeam,
  //     })
  //   if (commandsArray[1] === 'set_description')
  //     return await script({
  //       userTelegramId,
  //       text: `Задано описание команды: ${command}. Создание команды завершено`,
  //     })

  //   // return res?.status(200).json({ success: true, data: command })
  // }
}

export default commandHandler
