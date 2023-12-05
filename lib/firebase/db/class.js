import { setDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase-config";

export async function createClass(classData) {
  try {
    const { id, ...data } = classData;

    const classCol = doc(db, "classes", id);
    const classDoc = await getDoc(classCol);
    if (classDoc.exists()) {
      throw new Error("Class already exist");
    }
    await setDoc(classCol, data);
    return id;
  } catch (error) {
    return Promise.reject(error);
  }
}
