import { FieldPath } from "firebase-admin/firestore";
import { auth, db } from "../../firebase-admin-config";
import { cleanUndefined } from "@/lib/utils";
import { User, UserOnFirebase } from "../../model/user";

export async function getUserDataByUid(uid: string) {
  try {
    const user = await auth.getUser(uid);
    const userDoc = await db.collection("users").doc(uid).get();
    const userDocData = userDoc.data() as UserOnFirebase;

    return {
      uid,
      email: user.email,
      role: user.customClaims?.role,
      name: userDocData.name,
      nim: userDocData.nim,
      class_id: userDocData.class_id,
    } as User;
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function getUserDataByEmail(email: string) {
  try {
    const user = await auth.getUserByEmail(email);
    const userDoc = await db.collection("users").doc(user.uid).get();
    const userDocData = userDoc.data() as UserOnFirebase;

    return {
      uid: user.uid,
      email: user.email,
      role: user.customClaims?.role,
      name: userDocData.name,
      nim: userDocData.nim,
      class_id: userDocData.class_id,
    } as User;
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function getUsersDataByUids(uids: string[]) {
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

      if (user && userData) {
        usersData.push({
          uid: user.uid,
          email: user.email,
          role: user.customClaims?.role,
          name: userData.name,
          nim: userData.nim,
          class_id: userData.class_id,
        });
      }
    }

    return usersData as User[];
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function getUsersDataByClassId(classId: string) {
  try {
    const usersDataDoc = await db
      .collection("users")
      .where("class_id", "==", classId)
      .get();

    const usersData = [];
    for (const userDataDoc of usersDataDoc.docs) {
      const data = userDataDoc.data() as UserOnFirebase;
      usersData.push({
        uid: userDataDoc.id,
        ...data,
      });
    }

    const usersResult = await auth.getUsers(
      usersData.map((userData) => ({ uid: userData.uid }))
    );

    for (const user of usersResult.users) {
      const userData = usersData.find(
        (userData) => userData.uid === user.uid
      ) as User | undefined;

      if (!userData) continue;

      userData.email = user.email!;
      userData.role = user.customClaims?.role;
    }

    return usersData;
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function setUserData(
  uid: string,
  data: Partial<Omit<User, "uid"> & { password: string }>
) {
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

export async function setUserRole(uid: string, role: User["role"]) {
  try {
    await auth.setCustomUserClaims(uid, {
      role,
    });
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function createUser(
  user: Omit<User, "uid"> & { password: string }
) {
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

export async function getCurrentUser(sessionCookie: string) {
  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    if (!decodedClaims) {
      return new Error("Failed verify session cookie");
    }

    const user = await getUserDataByUid(decodedClaims.uid);

    return user;
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function createSessionCookie(idToken: string) {
  try {
    const decodedToken = await auth.verifyIdToken(idToken);

    if (!decodedToken) {
      throw new Error("Failed verify id token");
    }

    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn,
    });
    return sessionCookie;
  } catch (error) {
    return Promise.reject(error);
  }
}
