import { Discussion, DiscussionChat } from "../firebase/model/discussion";

export async function getDiscussions(class_id: string): Promise<Discussion[]> {
  const res = await fetch(`/api/classes/${class_id}/discussions`, {
    method: "GET",
    headers: {
      "Content-Type": "json/application",
    },
  });
  return await res.json();
}

export async function getDiscussion(
  class_id: string,
  id: string
): Promise<Discussion> {
  const res = await fetch(`/api/classes/${class_id}/discussions/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "json/application",
    },
  });
  return await res.json();
}

export async function createDiscussions(
  class_id: string,
  data: Omit<Discussion, "id">
) {
  return await fetch(`/api/classes/${class_id}/discussions`, {
    method: "PUT",
    headers: {
      "Content-Type": "json/application",
    },
    body: JSON.stringify(data),
  });
}

export async function createDiscussionChat(
  class_id: string,
  discussion_id: string,
  data: Omit<DiscussionChat, "id" | "sent_at">
) {
  return await fetch(
    `/api/classes/${class_id}/discussions/${discussion_id}/chats`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "json/application",
      },
      body: JSON.stringify(data),
    }
  );
}
