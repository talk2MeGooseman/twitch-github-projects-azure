import { BROADCASTER_COLLECTION } from "../constants";
import { GithubInfo } from "./types";

export default async function getBroadcasterInfo(db: FirebaseFirestore.Firestore, channel_id: string): Promise<GithubInfo|undefined> {
  const channelRef = db.collection(BROADCASTER_COLLECTION).doc(channel_id);
  try {
    const doc = await channelRef.get();
    // returns promise till data is resolved
    return <GithubInfo> doc.data();
  }
  catch (error) {
    console.log(error);
    return undefined;
  }
}
