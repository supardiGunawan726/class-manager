import { db } from "../../firebase-admin-config";

export async function getClassById(id) {
  try {
    const classDoc = await db.collection("classes").doc(id).get();
    if (!classDoc.exists) {
      throw new Error("Class doesn't exist");
    }

    return {
      id,
      ...classDoc.data(),
    };
  } catch (error) {
    return Promise.reject(error);
  }
}
