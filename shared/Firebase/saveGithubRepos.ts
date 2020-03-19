import { BROADCASTER_COLLECTION } from "../constants"
import { FireGithubRepo } from "./types"

export default async function saveGithubRepos(
  db: FirebaseFirestore.Firestore,
  repos: [FireGithubRepo],
  channel_id: string,
) {
  var saveRef = db.collection(BROADCASTER_COLLECTION)
  return saveRef.doc(channel_id).set(
    {
      repos: repos,
    },
    { merge: true },
  )
}
