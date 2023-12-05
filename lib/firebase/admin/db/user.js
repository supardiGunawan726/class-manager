import { auth, db } from "../../firebase-admin-config";

export async function getUserDataByUid(uid) {
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
}
