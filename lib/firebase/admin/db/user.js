import { FieldPath } from "firebase-admin/firestore";
import { auth, db } from "../../firebase-admin-config";
import { cleanUndefined } from "@/lib/utils";
import { cookies } from "next/headers";

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

export async function getUsersDataByClassId(classId) {
  try {
    const usersDataDoc = await db
      .collection("users")
      .where("class_id", "==", classId)
      .get();

    const usersData = [];
    for (const userDataDoc of usersDataDoc.docs) {
      const data = userDataDoc.data();
      usersData.push({
        uid: userDataDoc.id,
        name: data.name,
        nim: data.nim,
        class_id: data.class_id,
      });
    }

    const usersResult = await auth.getUsers(
      usersData.map((userData) => ({ uid: userData.uid }))
    );

    for (const user of usersResult.users) {
      const userData = usersData.find((userData) => userData.uid === user.uid);

      if (!userData) continue;

      userData.email = user.email;
      userData.role = user.customClaims?.role;
    }

    return usersData;
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function setUserData(uid, data) {
  try {
    const user = await auth.updateUser(
      uid,
      cleanUndefined({
        email: data.email,
        password: data.password,
        displayName: data.name,
      })
    );

    if (data.role) {
      await setUserRole(uid, data.role);
    }
    await db
      .collection("users")
      .doc(user.uid)
      .set(
        cleanUndefined({
          name: data.name,
          nim: data.nim,
          class_id: data.class_id,
        }),
        { merge: true }
      );
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
      role: user.role || "anggota",
    });

    return {
      uid: userRecord.uid,
      ...user,
    };
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function getCurrentUser() {
  try {
    const session = (await cookies()).get("session")?.value || "";

    if (!session) {
      throw new Error("Session cookie not found");
    }

    const decodedClaims = await auth.verifySessionCookie(session, true);
    if (!decodedClaims) {
      return new Error("Failed verify session cookie");
    }

    const user = await getUserDataByUid(decodedClaims.uid);

    return user;
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function createSessionCookie(idToken) {
  try {
    const decodedToken = await auth.verifyIdToken(idToken);

    if (!decodedToken) {
      return new Error("Failed verify id token");
    }

    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn,
    });
    const options = {
      name: "session",
      value: sessionCookie,
      maxAge: expiresIn,
      httpOnly: true,
      secure: true,
    };
    //Add the cookie to the browser
    (await cookies()).set(options);
  } catch (error) {
    return Promise.reject(error);
  }
}