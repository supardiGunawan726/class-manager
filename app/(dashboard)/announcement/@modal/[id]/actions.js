"use server";

import * as announcementService from "@/lib/firebase/admin/db/announcement";
import { revalidateTag } from "next/cache";

export async function deleteAnnouncement(data) {
  try {
    const { class_id, id } = data;

    await announcementService.deleteAnnouncement(class_id, id);
    revalidateTag("announcements");
  } catch (error) {
    console.error(error);
  }
}
