"use server";

import * as DocumentationService from "@/lib/firebase/admin/db/documentation";
import { revalidateTag } from "next/cache";

export async function updateDocumentation(formData) {
  try {
    await DocumentationService.updateDocumentation(
      formData.get("class_id"),
      formData.get("id"),
      {
        title: formData.get("title"),
        description: formData.get("description"),
        remove_media_filename: formData.getAll("remove_media_filename"),
        new_media_file: formData.getAll("new_media_file"),
      }
    );
    revalidateTag("documentations");
    revalidateTag("documentation");
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}
