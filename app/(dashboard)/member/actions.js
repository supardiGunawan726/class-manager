"use server";

import * as userClassService from "@/lib/firebase/admin/db/class";
import { revalidateTag } from "next/cache";

export async function removeClassMember(formData) {
  try {
    await userClassService.removeClassMember(
      formData.get("class_id"),
      formData.get("uid")
    );
    revalidateTag("users");
  } catch (error) {
    return Promise.reject(error);
  }
}
