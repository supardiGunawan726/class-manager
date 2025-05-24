import { setDoc, doc } from "firebase/firestore";
import { db } from "../firebase-config";
import { User } from "../model/user";

export async function setUserData(uid: string, data: Omit<User, "uid">) {
  try {
    const userDoc = doc(db, "users", uid);
    await setDoc(userDoc, data, { merge: true });
  } catch (error) {
    return Promise.reject(error);
  }
}
