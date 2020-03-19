import { BROADCASTER_COLLECTION } from "../constants";
import { FireGithubInfo } from "./types";

export default async function getBroadcasterInfo(db: FirebaseFirestore.Firestore, channel_id: string): Promise<FireGithubInfo|undefined> {
  const channelRef = db.collection(BROADCASTER_COLLECTION).doc(channel_id);
  try {
    const doc = await channelRef.get();
    // returns promise till data is resolved
    return <FireGithubInfo> doc.data();
  }
  catch (error) {
    console.log(error);
    return undefined;
  }
}
