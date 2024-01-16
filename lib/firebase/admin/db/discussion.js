import { cleanUndefined } from "@/lib/utils";
import { db } from "../../firebase-admin-config";

export async function getAllDiscussions(classId) {
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

    return discussions;
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function createDiscussion(classId, { name, description }) {
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

export async function getDiscussion(classId, discussionId) {
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
    const discussionData = discussionDoc.data();

    return {
      id: discussionDoc.id,
      name: discussionData.name,
      description: discussionData.description,
    };
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function getAllDiscussionChats(classId, discussionId) {
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
        sent_at: { ...data.sent_at },
      });
    }

    return chats;
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function createChat(
  classid,
  discussionId,
  { sender_id, content, sent_at }
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
        sent_at,
      });
  } catch (error) {
    return Promise.reject(error);
  }
}
