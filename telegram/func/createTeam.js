import Teams from '@models/Teams'
import TeamsUsers from '@models/TeamsUsers'
import dbConnect from '@utils/dbConnect'

const createTeam = async (userTelegramId, jsonCommand) => {
  await dbConnect()
  const team = await Teams.create({
    // capitanId: userTelegramId,
    name: jsonCommand.name,
    name_lowered: jsonCommand.name.toLowerCase(),
    description: jsonCommand.description ?? '',
  })
  await TeamsUsers.create({
    teamId: String(team._id),
    userTelegramId,
    role: 'capitan',
  })
  return team
}

export default createTeam
