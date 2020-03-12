import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { JWT_HEADER } from "../constants";
import TokenUtils from "../shared/TokenUtils";

const TWITCH_SECRET = process.env['twitch-secret']

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const jwtToken = req.headers[JWT_HEADER]

    const name = (req.query.name || (req.body && req.body.name))

    const responseMessage = jwtToken ? "JWT was passed in" : "JWT Missing"

    let decodedToken

    try {
        decodedToken = TokenUtils.decodeToken(jwtToken, TWITCH_SECRET);
    } catch (error) {
        context.res = {
            status: 403,
            body: "JWT was invalid"
        }
        context.done()
        return
    }

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    }

}

export default httpTrigger

    //  try {
    //   const token = req.get(JWT_HEADER);
    //   const secret = getSecret();
    //   let decoded;

    //   try {
    //     decoded = decodeToken(token, secret);
    //   } catch (error) {
    //     console.log('Token was invalid');
    //     res.status(403).end();
    //   }

    //   let user = await getBroadcasterInfo(db, decoded.channel_id);

    //   let repos = [];
    //   if (user && user.selected_repos) {
    //     repos = user.selected_repos.map((repo_id) => {
    //       return user.repos.find((repo) => {
    //         return repo.id === repo_id;
    //       });
    //     });
    //   }

    //   if (user && repos) {
    //     res.status(200).json({
    //       user,
    //       repos
    //     });
    //   } else {
    //     res.status(404).end();
    //   }

    // } catch (error) {
    //   console.log(error)
    //   res.status(500).end();
    // }
