import { db } from "../../firebase-admin-config";

export async function getAnnouncements(classId) {
  try {
    const announcementDocs = await db
      .collection("classes")
      .doc(classId)
      .collection("announcements")
      .orderBy("published_at", "desc")
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
