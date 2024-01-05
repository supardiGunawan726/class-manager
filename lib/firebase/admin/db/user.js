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
      role: user.customClaims?.role,
      name: userDocData.name,
      nim: userDocData.nim,
      class_id: userDocData.class_id,
    };
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function getUserDataByEmail(email) {
  try {
    const user = await auth.getUserByEmail(email);
    const userDoc = await db.collection("users").doc(user.uid).get();
    const userDocData = userDoc.data();

    return {
      uid: user.uid,
      email: user.email,
      role: user.customClaims?.role,
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
        role: user.customClaims?.role,
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

export async function setUserData(uid, data) {
  try {
    const user = await auth.updateUser(uid, {
      email: data.email,
      password: data.password,
      displayName: data.name,
    });

    if (data.role) {
      await setUserRole(uid, {
        role: data.role,
      });
    }
    await db.collection("users").doc(user.uid).set(data, { merge: true });
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function setUserRole(uid, role) {
  try {
    await auth.setCustomUserClaims(uid, {
      role,
    });
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function createUser(user) {
  try {
    const userRecord = await auth.createUser({
      email: user.email,
      password: user.password,
      displayName: user.name,
    });
    await setUserData(userRecord.uid, {
      name: user.name,
      nim: user.nim,
    });

    return {
      uid: userRecord.uid,
      ...user,
    };
  } catch (error) {
    return Promise.reject(error);
  }
}