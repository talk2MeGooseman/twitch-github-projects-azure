import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { JWT_HEADER } from "../shared/constants"
import * as TokenUtils from "../shared/TokenUtils"
import * as admin from "firebase-admin"
import credentials from "../credentials/firebase"
import { getBroadcasterInfo } from "../shared/Firebase"
import { DecodedTwitchToken } from "../shared/TokenUtils/types"
import { GithubRepo } from "../shared/Firebase/types"

admin.initializeApp({
  credential: admin.credential.cert(credentials),
  databaseURL: "https://projects-twitch-extension.firebaseio.com",
})

const firestoreDb = admin.firestore()

const httpTrigger: AzureFunction = async function(
  context: Context,
  req: HttpRequest,
): Promise<void> {
  const jwtToken = req.headers[JWT_HEADER]

  let decodedToken: DecodedTwitchToken
  try {
    decodedToken = TokenUtils.decodeToken(jwtToken, process.env["twitch-secret"])
  } catch (error) {
    context.res = {
      status: 403,
      body: error,
    }
    context.done()
    return
  }

  let user = await getBroadcasterInfo(firestoreDb, decodedToken.channel_id)

  let repos: GithubRepo[] = []
  if (user?.selected_repos) {
    repos = user.selected_repos.reduce((accum, repo_id) => {
      const repo = user?.repos.find((repo) => {
        return repo.id === repo_id
      })

      if (repo) {
        accum.push(repo)
      }

      return accum
    }, [] as GithubRepo[])
  }

  if (user && repos) {
    context.res = {
      status: 200 /* Defaults to 200 */,
      body: {
        user,
        repos,
      },
    }
  } else {
    context.res = {
      status: 404,
    }
  }
}

export default httpTrigger
