"use server";

import * as documentationService from "@/lib/firebase/admin/db/documentation";
import { revalidateTag } from "next/cache";

export async function deleteDocumentation(data) {
  try {
    await documentationService.deleteDocumentation(data.class_id, data.id);
    revalidateTag("documentations");
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}
