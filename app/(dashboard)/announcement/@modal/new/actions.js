"use server";

import * as announcementService from "@/lib/firebase/admin/db/announcement";
import { cleanUndefined } from "@/lib/utils";
import { revalidateTag } from "next/cache";

export async function createAnnouncement(data) {
  try {
    const { class_id, title, content, author } = data;
    await announcementService.createAnnouncement(
      class_id,
      cleanUndefined({
        title,
        content,
        author,
      })
    );
    revalidateTag("announcements");
  } catch (error) {
    console.error(error);
  }
}
