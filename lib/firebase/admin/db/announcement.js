import { FieldValue } from "firebase-admin/firestore";
import { db } from "../../firebase-admin-config";

export async function getAnnouncements(classId, limit = 3) {
  try {
    const announcementDocs = await db
      .collection("classes")
      .doc(classId)
      .collection("announcements")
      .orderBy("published_at", "desc")
      .limit(limit)
      .get();

    const announcements = [];

    for (const doc of announcementDocs.docs) {
      announcements.push({
        id: doc.id,
        ...doc.data(),
      });
    }

    return announcements;
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function createAnnouncement(classId, data) {
  try {
    const announcementData = {
      published_at: FieldValue.serverTimestamp(),
      title: data.title,
      content: data.content,
      author: data.author,
    };

    const announcementDoc = await db
      .collection("classes")
      .doc(classId)
      .collection("announcements")
      .add(announcementData);

    return {
      id: announcementDoc.id,
      ...announcementData,
    };
  } catch (error) {
    return Promise.reject(error);
  }
}
