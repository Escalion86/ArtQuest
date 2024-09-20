import GamesTeams from '@models/GamesTeams'
import Teams from '@models/Teams'
import buttonListConstructor from 'telegram/func/buttonsListConstructor'
import check from 'telegram/func/check'
import formatGameName from 'telegram/func/formatGameName'
import getGame from 'telegram/func/getGame'

const gameTeamsCheckPhotos = async ({ telegramId, jsonCommand, user }) => {
  const checkData = check(jsonCommand, ['gameId'])
  if (checkData) return checkData

  const game = await getGame(jsonCommand?.gameId)
  if (game.success === false) return game

  const gameTeams = await GamesTeams.find({ gameId: jsonCommand?.gameId })
    .lean()
    .sort({ createdAt: 1 })

  const teamsIds =
    gameTeams.length > 0 ? gameTeams.map((gameTeam) => gameTeam.teamId) : []

  const teams =
    teamsIds.length > 0
      ? await Teams.find({
          _id: { $in: teamsIds },
        }).lean()
      : []

  const sortedTeams = gameTeams.map(({ _id, teamId, photos }) => {
    const team = teams.find(({ _id }) => String(_id) == teamId)
    return { ...team, photos, gameTeamId: _id }
  })

  const page = jsonCommand?.page ?? 1
  const buttons =
    sortedTeams.length > 0
      ? buttonListConstructor(
          sortedTeams,
          page,
          ({ photos, gameTeamId, name }, number) => {
            return {
              text: `${number}. "${name}" - ${
                photos?.length > 0
                  ? `${photos.reduce(
                      (sum, item) =>
                        sum +
                        item?.reduce(
                          (sum2, { checks }) =>
                            sum2 + (checks?.accepted ? 1 : 0),
                          0
                        ),
                      0
                    )}/${photos.reduce(
                      (sum, item) => sum + (item?.length || 0),
                      0
                    )} фото`
                  : '0 фото'
              }`,
              c: { c: 'gameTeamCheckPhotos', gameTeamId },
            }
          }
        )
      : []

  return {
    message: `Проверка фотографий в игре <b>${formatGameName(
      game
    )}</b>\n${sortedTeams
      .map(
        (team, index) =>
          `\n${index + 1}. "${team.name}" - ${
            team.photos?.length > 0
              ? `${team.photos.reduce(
                  (sum, item) => sum + (item?.length || 0),
                  0
                )} фото`
              : '0 фото'
          }`
      )
      .join('')}`,
    buttons: [
      ...buttons,
      {
        c: { c: 'editGameGeneral', gameId: jsonCommand?.gameId },
        text: '\u{2B05} Назад',
      },
    ],
  }
}

export default gameTeamsCheckPhotos