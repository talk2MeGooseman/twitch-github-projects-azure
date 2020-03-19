import * as admin from "firebase-admin"
import credentials from "../../credentials/firebase"

export default function initFirestore() : FirebaseFirestore.Firestore {
  if(admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(credentials),
      databaseURL: "https://projects-twitch-extension.firebaseio.com",
    })
  }

  return admin.firestore()
}
