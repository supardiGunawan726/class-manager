import {
  setDoc,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  deleteField,
} from "firebase/firestore";
import { db } from "../firebase-config";
import { UserClass } from "../model/class";

export async function createClass(classData: UserClass) {
  try {
    const { id, ...data } = classData;

    const classRef = doc(db, "classes", id);
    const classDoc = await getDoc(classRef);
    if (classDoc.exists()) {
      throw new Error("Class already exist");
    }
    await setDoc(classRef, data);
    return id;
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function joinClass(uid: string, classId: string) {
  try {
    const joinRequestRef = doc(db, "classes", classId, "join_requests", uid);
    await setDoc(joinRequestRef, {
      uid,
    });
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function addClassMember(uid: string, classId: string) {
  try {
    const classRef = doc(db, "classes", classId);
    const classDoc = await getDoc(classRef);

    if (!classDoc.exists()) {
      throw new Error("Class doesn't exist");
    }

    const classData = classDoc.data();
    const member = classData.member || [];
    member.push(uid);
    await updateDoc(classRef, {
      member,
    });
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function deleteClassMember(uid: string, classId: string) {
  try {
    const classRef = doc(db, "classes", classId);
    const classDoc = await getDoc(classRef);

    if (!classDoc.exists()) {
      throw new Error("Class doesn't exist");
    }

    const classData = classDoc.data() as UserClass;
    const member = classData.member || [];
    await updateDoc(classRef, {
      member: member.filter((memberUid) => memberUid !== uid),
    });

    const usersRef = doc(db, "users", uid);
    await updateDoc(usersRef, {
      class_id: deleteField(),
    });
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function deleteJoinRequest(uid: string, classId: string) {
  try {
    const joinRequestRef = doc(db, "classes", classId, "join_requests", uid);
    await deleteDoc(joinRequestRef);
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function approveJoinRequest(uid: string, classId: string) {
  try {
    const userDataRef = doc(db, "users", uid);
    const userDataDoc = await getDoc(userDataRef);

    if (!userDataDoc.exists()) {
      throw new Error("User doesn't exist");
    }

    const joinRequestRef = doc(db, "classes", classId, "join_requests", uid);
    const joinRequestDoc = await getDoc(joinRequestRef);

    if (!joinRequestDoc.exists()) {
      throw new Error("User doesn't exist in request list");
    }

    const classRef = doc(db, "classes", classId);
    const classDoc = await getDoc(classRef);

    if (!classDoc.exists()) {
      throw new Error("Class doesn't exist");
    }

    const classData = classDoc.data();
    const member = classData.member || [];
    member.push(uid);
    await updateDoc(classRef, {
      member,
    });
    await updateDoc(userDataRef, {
      class_id: classId,
    });
    await deleteJoinRequest(uid, classId);
  } catch (error) {
    return Promise.reject(error);
  }
}
