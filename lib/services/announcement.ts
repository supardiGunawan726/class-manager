import { Announcement } from "../firebase/model/announcement";

export async function getAnnouncements(
  class_id: string
): Promise<Announcement[]> {
  const res = await fetch(`/api/classes/${class_id}/announcements`, {
    method: "GET",
  });
  return await res.json();
}

export async function getAnnouncement(
  class_id: string,
  id: string
): Promise<Announcement> {
  const res = await fetch(`/api/classes/${class_id}/announcements/${id}`, {
    method: "GET",
  });
  return await res.json();
}

export async function createAnnouncement(
  class_id: string,
  data: Omit<Announcement, "id" | "published_at">
) {
  return await fetch(`/api/classes/${class_id}/announcements`, {
    method: "PUT",
    headers: {
      "Content-Type": "json/application",
    },
    body: JSON.stringify(data),
  });
}

export async function updateAnnouncement(
  class_id: string,
  id: string,
  data: Omit<Announcement, "id" | "published_at" | "author">
) {
  return await fetch(`/api/classes/${class_id}/announcements/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "json/application",
    },
    body: JSON.stringify(data),
  });
}

export async function deleteAnnouncement(
  class_id: string,
  id: string
): Promise<Announcement> {
  const res = await fetch(`/api/classes/${class_id}/announcements/${id}`, {
    method: "DELETE",
  });
  return await res.json();
}