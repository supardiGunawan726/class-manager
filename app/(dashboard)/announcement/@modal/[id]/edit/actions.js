"use server";

import * as announcementService from "@/lib/firebase/admin/db/announcement";
import { cleanUndefined } from "@/lib/utils";
import { revalidateTag } from "next/cache";

export async function editAnnouncement(data) {
  try {
    const { class_id, id, title, content } = data;

    await announcementService.updateAnnouncement(
      class_id,
      id,
      cleanUndefined({
        title,
        content,
      })
    );
    revalidateTag("announcements");
    revalidateTag("announcement");
  } catch (error) {
    console.error(error);
  }
}
