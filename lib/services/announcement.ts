import { Announcement } from "../firebase/model/announcement";

export async function getAnnouncements(
  class_id: string
): Promise<Announcement[]> {
  const res = await fetch(`/api/classes/${class_id}/announcements`, {
    method: "GET",
    headers: {
      "Content-Type": "json/application",
    },
  });
  return await res.json();
}
