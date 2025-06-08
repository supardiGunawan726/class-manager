import { FieldValue } from "firebase-admin/firestore";
import { db } from "../../firebase-admin-config";
import { Announcement } from "../../model/announcement";

export async function getAnnouncements(
  classId: string,
  limit = 3
): Promise<Announcement[]> {
  try {
    const announcementDocs = await db
      .collection("classes")
      .doc(classId)
      .collection("announcements")
      .orderBy("published_at", "desc")
      .limit(limit)
      .get();

    const announcements: Announcement[] = [];

    for (const doc of announcementDocs.docs) {
      const data = doc.data() as Omit<Announcement, "id">;
      announcements.push({
        id: doc.id,
        author: data.author,
        content: data.content,
        title: data.title,
        published_at: {
          seconds: data.published_at.seconds,
          nanoseconds: data.published_at.nanoseconds,
        },
      });
    }

    return announcements;
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function createAnnouncement(
  classId: string,
  data: Omit<Announcement, "id" | "published_at">
) {
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
    } as unknown as Announcement;
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function getAnnouncement(classId: string, id: string) {
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

    const announcementData = announcementDoc.data() as Omit<Announcement, "id">;

    return {
      id: announcementDoc.id,
      published_at: {
        seconds: announcementData.published_at.seconds,
        nanoseconds: announcementData.published_at.nanoseconds,
      },
      author: announcementData.author,
      title: announcementData.title,
      content: announcementData.content,
    };
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function updateAnnouncement(
  classId: string,
  id: string,
  data: Partial<Omit<Announcement, "id" | "published_at" | "author">>
) {
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

export async function deleteAnnouncement(classId: string, id: string) {
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
