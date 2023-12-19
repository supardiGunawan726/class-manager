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

export async function getClassJoinRequest(classId) {
  try {
    const joinRequestDoc = await db
      .collection("classes")
      .doc(classId)
      .collection("join_requests")
      .get();

    const joinRequest = [];
    for (const doc of joinRequestDoc.docs) {
      if (doc.exists) {
        const data = doc.data();
        joinRequest.push(data.uid);
      }
    }

    return joinRequest;
  } catch (error) {
    return Promise.reject(error);
  }
}
