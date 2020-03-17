export interface GithubUser {
  avatar_url: string;
  login: string;
  public_repos: number;
  repos_url: string;
}

export interface GithubRepo {
  description: string;
  full_name: string;
  html_url: string;
  id: string;
  language: string;
  name: string;
}

export interface GithubInfo extends FirebaseFirestore.DocumentData {
  github_user: GithubUser;
  repos: GithubRepo[];
  selected_repos: string[];
  user_id: string;
}
