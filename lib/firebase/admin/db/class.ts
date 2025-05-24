import { FieldValue } from "firebase-admin/firestore";
import { getUsersDataByUids, setUserData } from "./user";
import { db } from "../../firebase-admin-config";
import { UserClass } from "../../model/class";

export async function getClassById(id: string): Promise<UserClass> {
  try {
    const classDoc = await db.collection("classes").doc(id).get();
    if (!classDoc.exists) {
      throw new Error("Class doesn't exist");
    }

    const data = classDoc.data() as Omit<UserClass, "id">;

    return {
      id,
      name: data.name,
      description: data.description,
      member: data.member,
    };
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function createClass(
  classId: string,
  { name, description, member }: Omit<UserClass, "id">
) {
  try {
    await db.collection("classes").doc(classId).set({
      name,
      description,
      member,
    });
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function addClassMember(classId: string, uid: string) {
  try {
    const userClassRef = db.collection("classes").doc(classId);
    const userClassDoc = await userClassRef.get();

    if (!userClassDoc.exists) {
      throw new Error("Class doesn't exist");
    }

    const userClassData = userClassDoc.data() as UserClass;
    const member = userClassData.member || [];

    member.push(uid);

    await userClassRef.update({
      member,
    });
    await setUserData(uid, {
      class_id: classId,
    });
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function removeClassMember(classId: string, uid: string) {
  try {
    const userClassRef = db.collection("classes").doc(classId);
    const userClassDoc = await userClassRef.get();

    if (!userClassDoc.exists) {
      throw new Error("Class doesn't exist");
    }

    const userClassData = userClassDoc.data() as UserClass;
    const member = userClassData.member || [];

    await userClassRef.update({
      member: member.filter((memberUid) => memberUid !== uid),
    });
    await db.collection("users").doc(uid).update({
      class_id: FieldValue.delete(),
    });
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function getClassJoinRequest(classId: string) {
  try {
    const joinRequestDoc = await db
      .collection("classes")
      .doc(classId)
      .collection("join_requests")
      .get();

    const joinRequest: string[] = [];
    for (const doc of joinRequestDoc.docs) {
      if (doc.exists) {
        const data = doc.data();
        joinRequest.push(data.uid);
      }
    }

    if (joinRequest.length === 0) {
      return [];
    }

    const users = await getUsersDataByUids(joinRequest);
    return users;
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function addClassJoinRequest(classId: string, uid: string) {
  try {
    await db
      .collection("classes")
      .doc(classId)
      .collection("join_requests")
      .doc(uid)
      .set({
        uid,
      });
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function approveJoinRequest(classId: string, uid: string) {
  try {
    const joinRequestRef = db
      .collection("classes")
      .doc(classId)
      .collection("join_requests")
      .doc(uid);
    const joinRequestDoc = await joinRequestRef.get();

    if (!joinRequestDoc.exists) {
      throw new Error("User doesn't exist in request list");
    }

    await addClassMember(classId, uid);
    await joinRequestRef.delete();
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function declineJoinRequest(classId: string, uid: string) {
  try {
    await db
      .collection("classes")
      .doc(classId)
      .collection("join_requests")
      .doc(uid)
      .delete();
  } catch (error) {
    return Promise.reject(error);
  }
}
