import { FieldValue } from "firebase-admin/firestore";
import { setUserData } from "../../admin/db/user";
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

export async function createClass(classId, { name, description, member }) {
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

export async function addClassMember(classId, uid) {
  try {
    const userClassRef = db.collection("classes").doc(classId);
    const userClassDoc = await userClassRef.get();

    if (!userClassDoc.exists) {
      throw new Error("Class doesn't exist");
    }

    const userClassData = userClassDoc.data();
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

export async function removeClassMember(classId, uid) {
  try {
    const userClassRef = db.collection("classes").doc(classId);
    const userClassDoc = await userClassRef.get();

    if (!userClassDoc.exists) {
      throw new Error("Class doesn't exist");
    }

    const userClassData = userClassDoc.data();
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

export async function addClassJoinRequest(classId, uid) {
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

export async function approveJoinRequest(classId, uid) {
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

export async function declineJoinRequest(classId, uid) {
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
