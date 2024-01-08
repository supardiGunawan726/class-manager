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

export async function getAnnouncementById(classId, id) {
  try {
    const announcementDoc = await db
      .collection("classes")
      .doc(classId)
      .collection("announcements")
      .doc(id)
      .get();

    if (!announcementDoc.exists) {
      throw new Error("Announcement missing from database");
    }

    const announcementData = announcementDoc.data();

    return {
      id: announcementDoc.id,
      published_at: { ...announcementData.published_at },
      author: announcementData.author,
      title: announcementData.title,
      content: announcementData.content,
    };
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function updateAnnouncement(classId, id, data) {
  try {
    await db
      .collection("classes")
      .doc(classId)
      .collection("announcements")
      .doc(id)
      .update(data);
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function deleteAnnouncement(classId, id) {
  try {
    await db
      .collection("classes")
      .doc(classId)
      .collection("announcements")
      .doc(id)
      .delete();
  } catch (error) {
    return Promise.reject(error);
  }
}