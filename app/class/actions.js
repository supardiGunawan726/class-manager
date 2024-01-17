"use server";
import * as classService from "@/lib/firebase/admin/db/class";
import { setUserData } from "@/lib/firebase/admin/db/user";

export async function joinClass(formData) {
  try {
    await classService.addClassJoinRequest(
      formData.get("class_id"),
      formData.get("uid")
    );
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

export async function createClass(formData) {
  try {
    const classId = formData.get("class_id");
    const member = formData.getAll("member");

    await classService.createClass(classId, {
      name: formData.get("name"),
      description: formData.get("description"),
      member,
    });
    await setUserData(member[0], {
      class_id: classId,
    });
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}
