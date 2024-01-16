"use server";

import { createChat } from "@/lib/firebase/admin/db/discussion";
import { FieldValue } from "firebase-admin/firestore";
import { revalidateTag } from "next/cache";

export async function submitChat(formData) {
  try {
    await createChat(formData.get("class_id"), formData.get("discussion_id"), {
      sender_id: formData.get("sender_id"),
      content: formData.get("content"),
      sent_at: FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}
