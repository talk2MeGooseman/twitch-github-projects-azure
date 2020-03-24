import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import initFirestore from "../shared/Firebase/initFirestore"
import { JWT_HEADER } from "../shared/constants"
import { DecodedTwitchToken } from "../shared/TokenUtils/types"
import { verifyToken } from "../shared/TokenUtils"
import { getBroadcasterInfo, saveGithubRepos } from "../shared/Firebase"
import { getGithubRepos } from "../shared/GithubAPI"

const firestoreDb = initFirestore()

const httpTrigger: AzureFunction = async function(
  context: Context,
  req: HttpRequest,
): Promise<void> {
  const jwtToken = req.headers[JWT_HEADER]

  let decodedToken: DecodedTwitchToken
  try {
    decodedToken = verifyToken(jwtToken, process.env["twitch_secret"])
  } catch (error) {
    context.res = {
      status: 403,
      body: error,
    }
    context.done()
    return
  }

  let response = {}
  let status_code = 200
  try {
    let user = await getBroadcasterInfo(firestoreDb, decodedToken.channel_id)
    if (user) {
      const repos = await getGithubRepos(
        user.github_user.login,
        decodedToken.channel_id,
      )
      await saveGithubRepos(firestoreDb, repos, decodedToken.channel_id)
      response = { repos }
    }
  } catch (error) {
    status_code = 400
    response = {}
  }

  context.res = {
    status: status_code, /* Defaults to 200 */
    body: response
  }
}

export default httpTrigger
