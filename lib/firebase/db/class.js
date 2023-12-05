import { setDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase-config";

export async function createClass(classData) {
  try {
    const { id, ...data } = classData;

    const classRef = doc(db, "classes", id);
    const classDoc = await getDoc(classRef);
    if (classDoc.exists()) {
      throw new Error("Class already exist");
    }
    await setDoc(classRef, data);
    return id;
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function joinClass(uid, classId) {
  try {
    const joinRequestRef = doc(db, "classes", classId, "join_requests", uid);
    await setDoc(joinRequestRef, {
      uid,
    });
  } catch (error) {
    return Promise.reject(error);
  }
}
