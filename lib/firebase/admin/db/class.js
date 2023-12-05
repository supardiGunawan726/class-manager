import { db } from "../../firebase-admin-config";

export async function getClassById(id) {
  try {
    const classDoc = await db.collection("classes").doc(id).get();
    if (!classDoc.exists) {
      throw new Error("Class doesn't exist");
    }

    const joinRequestsDocs = await db
      .collection("classes")
      .doc(id)
      .collection("join_requests")
      .get();

    const joinRequests = [];
    joinRequestsDocs.forEach((doc) => {
      if (doc.exists) {
        joinRequests.push(doc.data());
      }
    });

    return {
      id,
      ...classDoc.data(),
      join_requests: joinRequests,
    };
  } catch (error) {
    return Promise.reject(error);
  }
}
