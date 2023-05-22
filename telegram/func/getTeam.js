import Teams from '@models/Teams'
import dbConnect from '@utils/dbConnect'
import mongoose from 'mongoose'

const getTeam = async (id) => {
  await dbConnect()
  // const preparedId = mongoose.Types.ObjectId(id)
  if (!mongoose.Types.ObjectId.isValid(id)) return

  return await Teams.findById(id)
}

export default getTeam