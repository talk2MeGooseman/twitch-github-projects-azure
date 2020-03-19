import { BROADCASTER_COLLECTION } from "../constants"
import { FireGithubInfo } from "./types"
import { GithubResponse } from "../GithubAPI"

export default async function saveGithubInfo(
  db: FirebaseFirestore.Firestore,
  data: GithubResponse,
  channel_id: string,
) {
  var saveRef = db.collection(BROADCASTER_COLLECTION)
  return saveRef.doc(channel_id).set(data)
}
