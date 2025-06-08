import { FieldValue } from "firebase-admin/firestore";
import { db, bucket } from "../../firebase-admin-config";
import { Documentation, DocumentationMedia } from "../../model/documentation";

export async function getAllDocumentations(classId: string) {
  try {
    const documentationDocs = await db
      .collection("classes")
      .doc(classId)
      .collection("documentation")
      .orderBy("published_at", "desc")
      .get();
    const documentationData = [];

    for (const doc of documentationDocs.docs) {
      const data = doc.data();

      documentationData.push({
        id: doc.id,
        author: data.author,
        title: data.title,
        description: data.description,
        media: data.media,
        published_at: {
          seconds: data.published_at.seconds,
          nanoseconds: data.published_at.nanoseconds,
        },
      } as Documentation);
    }

    return documentationData;
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function getDocumentation(classId: string, id: string) {
  try {
    const documentationDoc = await db
      .collection("classes")
      .doc(classId)
      .collection("documentation")
      .doc(id)
      .get();

    if (!documentationDoc.exists) {
      return new Error("documentation missing from database");
    }

    const data = documentationDoc.data();

    return {
      id: documentationDoc.id,
      author: data?.author,
      title: data?.title,
      description: data?.description,
      media: data?.media,
      published_at: {
        seconds: data?.published_at.seconds,
        nanoseconds: data?.published_at.nanoseconds,
      },
    } as Documentation;
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function createNewDocumentation(
  classId: string,
  data: Omit<Documentation, "published_at">
) {
  try {
    const documentationDoc = db
      .collection("classes")
      .doc(classId)
      .collection("documentation")
      .doc(data.id);

    await documentationDoc.set({
      published_at: FieldValue.serverTimestamp(),
      author: data.author,
      title: data.title,
      description: data.description,
      media: data.media,
    });
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function deleteDocumentation(classId: string, id: string) {
  try {
    await bucket.deleteFiles({
      prefix: `classes/${classId}/documentation/${id}/`,
    });

    db.collection("classes")
      .doc(classId)
      .collection("documentation")
      .doc(id)
      .delete();
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function updateDocumentation(
  classId: string,
  id: string,
  data: Omit<Documentation, "id" | "published_at" | "media" | "author"> & {
    new_media_file: {
      url: string;
      filename: string;
      type: string;
    }[];
    remove_media_filename: string[];
  }
) {
  try {
    const { title, description, new_media_file, remove_media_filename } = data;

    const documentationRef = db
      .collection("classes")
      .doc(classId)
      .collection("documentation")
      .doc(id);
    const documentationDoc = await documentationRef.get();

    if (!documentationDoc.exists) {
      throw new Error("Documentation not exist in db");
    }

    const documentationData = documentationDoc.data() as Documentation;
    let media = documentationData.media;

    if (remove_media_filename) {
      // delete files
      const deleteFilesPromise = [];
      for (const filename of remove_media_filename) {
        const fileRef = bucket.file(
          `classes/${classId}/documentation/${documentationDoc.id}/${filename}`
        );
        deleteFilesPromise.push(fileRef.delete({ ignoreNotFound: true }));
      }
      await Promise.all(deleteFilesPromise);
      media = media.filter(
        (mediaItem) =>
          !remove_media_filename.find(
            (removeMediaFilenameItem) =>
              removeMediaFilenameItem === mediaItem.filename
          )
      );
    }

    if (new_media_file) {
      media.push(...new_media_file);
    }

    await documentationRef.update({
      title,
      description,
      media,
    });
  } catch (error) {
    return Promise.reject(error);
  }
}
