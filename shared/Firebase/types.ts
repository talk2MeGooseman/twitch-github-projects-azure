export interface FirebaseGithubUser {
  avatar_url: string;
  login: string;
  public_repos: number;
  repos_url: string;
}

export interface FireGithubRepo {
  description: string;
  full_name: string;
  html_url: string;
  id: string;
  language: string;
  name: string;
}

export interface FireGithubInfo extends FirebaseFirestore.DocumentData {
  github_user: FirebaseGithubUser;
  repos: FireGithubRepo[];
  selected_repos: string[];
  user_id: string;
}
