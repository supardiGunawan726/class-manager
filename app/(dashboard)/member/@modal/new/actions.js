"use server";

import { addClassMember } from "@/lib/firebase/admin/db/class";
import {
  createUser,
  getUserDataByEmail,
  setUserData,
} from "@/lib/firebase/admin/db/user";
import { revalidateTag } from "next/cache";

export async function addMember(formData) {
  try {
    const class_id = formData.get("class_id");
    const email = formData.get("email");
    const name = formData.get("name");
    const nim = formData.get("nim");
    const password = formData.get("password");

    const user = await getUserDataByEmail(email).catch(async function () {
      const newUser = await createUser({
        email,
        name,
        nim,
        password,
      });

      return newUser;
    });

    if (!user) {
      throw new Error("Error creating user");
    }

    if (user.class_id) {
      throw new Error("User has join other class");
    }

    await addClassMember(class_id, user.uid);
    await setUserData(user.uid, {
      class_id,
      role: "anggota",
    });

    revalidateTag("users");

    return {
      ...user,
      class_id,
      role: "anggota",
    };
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}
