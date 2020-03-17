import { BROADCASTER_COLLECTION } from "../constants"
import { GithubInfo } from "./types"

export default async function saveGithubInfo(
  db: FirebaseFirestore.Firestore,
  data: GithubInfo,
  channel_id: string,
) {
  var saveRef = db.collection(BROADCASTER_COLLECTION)
  return saveRef.doc(channel_id).set(data)
}
