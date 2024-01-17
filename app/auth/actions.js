"use server";

import * as userService from "@/lib/firebase/admin/db/user";

export async function createSessionCookie(formData) {
  try {
    await userService.createSessionCookie(formData.get("id_token"));
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

export async function saveUserData(formData) {
  try {
    await userService.setUserData(formData.get("uid"), {
      name: formData.get("name"),
      email: formData.get("email"),
      role: formData.get("role"),
      nim: parseInt(formData.get("nim"), 10),
    });
  } catch (error) {
    return Promise.reject(error);
  }
}
