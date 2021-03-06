import axios from "axios"
import { GITHUB_BASE_URL } from "../constants"
import { DecodedTwitchToken } from "../TokenUtils/types"
import { FireGithubRepo, FirebaseGithubUser} from "../Firebase/types"

export interface GithubResponse {
  github_user: FirebaseGithubUser;
  repos: FireGithubRepo[];
  user_id: string;
}

function getCredentials() {
  return {
    username: process.env["GITHUB_CLIENT_ID"],
    password: process.env["GITHUB_CLIENT_SECRET"],
  }
}

export async function getUserGithub(
  username: string,
  { channel_id, user_id }: DecodedTwitchToken,
) : Promise<GithubResponse> {
  const creds = getCredentials()
  const { data } = await axios.get(`${GITHUB_BASE_URL}/users/${username}`, {
    headers: {
      ...creds,
    },
  })
  const repos = await getGithubRepos(username, channel_id)

  const user = {
    user_id: user_id,
    github_user: {
      login: data.login,
      avatar_url: data.avatar_url,
      repos_url: data.repos_url,
      public_repos: data.public_repos,
    },
    repos,
  }

  return user
}

export async function getGithubRepos(username: string, channel_id: string, page = 1) {
  const creds = getCredentials()
  const { data, headers } = await axios.get(
    `${GITHUB_BASE_URL}/users/${username}/repos`,
    {
      params: {
        type: "all",
        per_page: 100,
        sort: "pushed",
        page: page,
      },
      headers: {
        ...creds,
      },
    },
  )

  // Format the data we want from each repo
  let repos = data.map((repo: FireGithubRepo) => {
    let { id, name, html_url, full_name, description, language } = repo
    return {
      id: id.toString(),
      name,
      html_url,
      full_name,
      description,
      language,
    }
  })

  // Check if there any other pages, then fetch them
  const pagesHeader = headers["link"]
  if (pagesHeader && pagesHeader.includes(`rel="last"`)) {
    // Fetch next page
    let pagedRepos = await getGithubRepos(username, channel_id, page + 1)
    // Append to the end of the repos array to keep order
    repos = repos.concat(pagedRepos)
  }

  return repos
}
