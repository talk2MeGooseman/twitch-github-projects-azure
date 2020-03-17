import getBroadcasterInfo from "./getBroadcasterInfo"
import { BROADCASTER_COLLECTION } from "../constants"

export default async function setSelectedRepos(
  db: FirebaseFirestore.Firestore,
  selected_repos: [string],
  channel_id: string,
) {
  var saveRef = db.collection(BROADCASTER_COLLECTION)
  await saveRef.doc(channel_id).set(
    {
      selected_repos: selected_repos,
    },
    {
      merge: true,
    },
  )
  return getBroadcasterInfo(db, channel_id)
}
