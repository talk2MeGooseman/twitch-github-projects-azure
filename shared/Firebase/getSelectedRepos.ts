import { BROADCASTER_COLLECTION } from "../constants";
import { FireGithubRepo } from "./types";

export default async function getSelectedRepos(db: FirebaseFirestore.Firestore, channel_id: string, selected_repos: [string]) {
  var channelRef = db.collection(BROADCASTER_COLLECTION).doc(channel_id);
  let userData: FirebaseFirestore.DocumentData | undefined;

  try {
    const doc = await channelRef.get();
    // returns promise till data is resolved
    userData = doc.data();
  }
  catch (error) {
    console.log(error);
    return null;
  }
  return userData?.selected_repos.map((repo_id: string) => {
    return userData?.repos.find((repo: FireGithubRepo) => repo.id === repo_id);
  });
}
