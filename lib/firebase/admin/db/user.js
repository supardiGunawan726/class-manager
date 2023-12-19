import { FieldPath } from "firebase-admin/firestore";
import { auth, db } from "../../firebase-admin-config";

export async function getUserDataByUid(uid) {
  try {
    const user = await auth.getUser(uid);
    const userDoc = await db.collection("users").doc(uid).get();
    const userDocData = userDoc.data();

    return {
      uid,
      email: user.email,
      role: user.customClaims.role,
      name: userDocData.name,
      nim: userDocData.nim,
      class_id: userDocData.class_id,
    };
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function getUsersDataByUids(uids) {
  try {
    const usersResult = await auth.getUsers(uids.map((uid) => ({ uid })));
    const usersResultUids = usersResult.users.map((user) => user.uid);

    const usersDataDoc = await db
      .collection("users")
      .where(FieldPath.documentId(), "in", usersResultUids)
      .get();

    const usersData = [];
    for (const doc of usersDataDoc.docs) {
      const user = usersResult.users.find((user) => user.uid === doc.id);
      const userData = doc.data();

      usersData.push({
        uid: user.uid,
        email: user.email,
        role: user.customClaims.role,
        name: userData.name,
        nim: userData.nim,
        class_id: userData.class_id,
      });
    }

    return usersData;
  } catch (error) {
    return Promise.reject(error);
  }
}
