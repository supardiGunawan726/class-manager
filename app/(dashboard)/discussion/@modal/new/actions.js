"use server";

import * as documentationService from "@/lib/firebase/admin/db/discussion";
import { revalidateTag } from "next/cache";

export async function createDiscussion(formData) {
  try {
    await documentationService.createDiscussion(formData.get("class_id"), {
      name: formData.get("name"),
      description: formData.get("description"),
    });
    revalidateTag("discussions");
    revalidateTag("discussion");
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}
