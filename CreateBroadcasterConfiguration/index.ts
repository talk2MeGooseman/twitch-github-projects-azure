import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { JWT_HEADER } from "../shared/constants"
import { DecodedTwitchToken } from "../shared/TokenUtils/types"
import { saveGithubInfo, initFirestore } from "../shared/Firebase"
import { verifyToken } from "../shared/TokenUtils"
import { getUserGithub, GithubResponse } from "../shared/GithubAPI";
import { FireGithubRepo, FireGithubInfo } from "../shared/Firebase/types"

const firestoreDb = initFirestore();

const httpTrigger: AzureFunction = async function(
  context: Context,
  req: HttpRequest,
): Promise<void> {
  const jwtToken = req.headers[JWT_HEADER]

  let decodedToken: DecodedTwitchToken
  try {
    decodedToken = verifyToken(
      jwtToken,
      process.env["twitch_secret"],
    )
  } catch (error) {
    context.res = {
      status: 403,
      body: error,
    }
    context.done()
    return
  }

  const { username } = req.body.data
  let response: GithubResponse | undefined
  let statusCode = 200;
  try {
    response = await getUserGithub(username, decodedToken)
    await saveGithubInfo(firestoreDb, response, decodedToken.channel_id)
  } catch (error) {
    statusCode = 400
    console.log(error)
  }

  context.res = {
    status: 200, /* Defaults to 200 */
    body: response,
  }
}

export default httpTrigger
