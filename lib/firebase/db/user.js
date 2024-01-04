import { setDoc, doc } from "firebase/firestore";
import { db, auth } from "../firebase-config";

export async function setUserData(uid, data) {
  try {
    const userDoc = doc(db, "users", uid);
    await setDoc(userDoc, data, { merge: true });
  } catch (error) {
    return Promise.reject(error);
  }
}