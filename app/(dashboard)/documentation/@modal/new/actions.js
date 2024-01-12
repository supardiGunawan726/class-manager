"use server";

import * as documentationService from "@/lib/firebase/admin/db/documentation";
import { revalidateTag } from "next/cache";

export async function uploadMedia(formData) {
  try {
    const media = [];

    for (const file of formData.getAll("media")) {
      media.push(file);
    }

    await documentationService.createNewDocumentation(
      formData.get("class_id"),
      {
        author: formData.get("author"),
        title: formData.get("title"),
        description: formData.get("description"),
        media,
      }
    );

    revalidateTag("documentation");
    revalidateTag("documentations");
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}
