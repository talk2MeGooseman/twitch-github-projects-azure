import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { JWT_HEADER } from "../shared/constants"
import { DecodedTwitchToken } from "../shared/TokenUtils/types"
import { verifyToken } from "../shared/TokenUtils"
import { getBroadcasterInfo, setSelectedRepos, initFirestore } from "../shared/Firebase"
import { setExtensionConfigured } from "../shared/TwitchAPI"

const firestoreDb = initFirestore();

const httpTrigger: AzureFunction = async function(
  context: Context,
  req: HttpRequest,
): Promise<void> {
  const jwtToken = req.headers[JWT_HEADER]

  let decodedToken: DecodedTwitchToken
  try {
    decodedToken = verifyToken(jwtToken, process.env["twitch-secret"])
  } catch (error) {
    context.res = {
      status: 403,
      body: error,
    }
    context.done()
    return
  }

  let response
  let statusCode = 200
  try {
    let selectedRepos:string[] = []
    if (req.body.data.selected_repos) {
      selectedRepos = req.body.data
    } else {
      selectedRepos = req.body.data
    }

    let user = await getBroadcasterInfo(firestoreDb, decodedToken.channel_id)

    if (user) {
      // Validate the selected repos belong to user
      let exists = selectedRepos.every((repo_id) => {
        return user?.repos.find((repo) => {
          return repo.id === repo_id
        })
      })

      if (exists) {
        response = await setSelectedRepos(firestoreDb, selectedRepos, decodedToken.channel_id)
        // IMPORTANT: MUST SET EXTENSION IS CONFIGURED
        setExtensionConfigured(decodedToken.channel_id, process.env['twitch-secret'])
        statusCode = 201
      } else {
        statusCode = 400
        response = {
          error: "One or more of your selected repositories were not found",
        }
      }

    } else {
      statusCode = 400
      response = {
          error: "Your Github information does not exist, please restart setup",
      }
    }
  } catch (error) {
    statusCode = 400
  }

  context.res = {
    status: statusCode,
    body: response,
  }
}

export default httpTrigger
