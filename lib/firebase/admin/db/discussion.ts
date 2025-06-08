import { cleanUndefined } from "@/lib/utils";
import { db } from "../../firebase-admin-config";
import { Discussion, DiscussionChat } from "../../model/discussion";
import { Timestamp } from "firebase-admin/firestore";

export async function getAllDiscussions(classId: string) {
  try {
    const discussionsDoc = await db
      .collection("classes")
      .doc(classId)
      .collection("discussions")
      .get();

    const discussions = [];
    for (const doc of discussionsDoc.docs) {
      const data = doc.data();
      discussions.push({
        id: doc.id,
        name: data.name,
        description: data.description,
      });
    }

    return discussions as Discussion[];
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function createDiscussion(
  classId: string,
  { name, description }: Omit<Discussion, "id">
) {
  try {
    await db.collection("classes").doc(classId).collection("discussions").add(
      cleanUndefined({
        name,
        description,
      })
    );
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function getDiscussion(classId: string, discussionId: string) {
  try {
    const discussionDoc = await db
      .collection("classes")
      .doc(classId)
      .collection("discussions")
      .doc(discussionId)
      .get();

    if (!discussionDoc.exists) {
      throw new Error("Discussion not exist in the database");
    }
    const discussionData = discussionDoc.data() as Discussion;

    return {
      id: discussionDoc.id,
      name: discussionData.name,
      description: discussionData.description,
    };
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function getAllDiscussionChats(
  classId: string,
  discussionId: string
) {
  try {
    const chatsDoc = await db
      .collection("classes")
      .doc(classId)
      .collection("discussions")
      .doc(discussionId)
      .collection("chats")
      .orderBy("sent_at", "asc")
      .get();

    const chats = [];

    for (const doc of chatsDoc.docs) {
      const data = doc.data();

      chats.push({
        id: doc.id,
        sender_id: data.sender_id,
        content: data.content,
        sent_at: {
          seconds: data.sent_at.seconds,
          nanoseconds: data.sent_at.nanoseconds,
        },
      });
    }

    return chats as DiscussionChat[];
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function createChat(
  classid: string,
  discussionId: string,
  { sender_id, content }: Omit<DiscussionChat, "id" | "sent_at">
) {
  try {
    await db
      .collection("classes")
      .doc(classid)
      .collection("discussions")
      .doc(discussionId)
      .collection("chats")
      .add({
        sender_id,
        content,
        sent_at: Timestamp.now(),
      });
  } catch (error) {
    return Promise.reject(error);
  }
}
