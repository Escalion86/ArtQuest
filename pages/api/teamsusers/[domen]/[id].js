import TeamsUsers from '@models/TeamsUsers'
import CRUD from '@server/CRUD'

export default async function handler(req, res) {
  return await CRUD(TeamsUsers, req, res)
}
