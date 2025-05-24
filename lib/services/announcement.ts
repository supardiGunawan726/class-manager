import { Announcement } from "../firebase/model/announcement";

export async function getAnnouncements(
  class_id: string
): Promise<Announcement[]> {
  const searchParams = new URLSearchParams();
  searchParams.set("class_id", class_id);

  const res = await fetch(`/api/announcements?${searchParams.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "json/applicatioin",
    },
  });
  return await res.json();
}
