import { FieldValue } from "firebase-admin/firestore";
import { db, bucket } from "../../firebase-admin-config";

export async function getAllDocumentations(classId) {
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
        published_at: { ...data.published_at },
        title: data.title,
        description: data.description,
        media: data.media,
      });
    }

    return documentationData;
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function getDocumentation(classId, id) {
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
      title: data.title,
      description: data.description,
      published_at: { ...data.published_at },
      author: data.author,
      media: data.media,
    };
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function createNewDocumentation(classId, data) {
  try {
    const documentationDoc = db
      .collection("classes")
      .doc(classId)
      .collection("documentation")
      .doc();

    const media = [];
    for (const mediaFile of data.media) {
      const { name, type } = mediaFile;

      const fileRef = bucket.file(
        `classes/${classId}/documentation/${documentationDoc.id}/${name}`
      );

      const arrayBuffer = await mediaFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await fileRef.save(buffer, {
        contentType: type,
      });
      await fileRef.makePublic();

      media.push({
        url: fileRef.publicUrl(),
        type: type,
        filename: name,
      });
    }

    await documentationDoc.set({
      published_at: FieldValue.serverTimestamp(),
      author: data.author,
      title: data.title,
      description: data.description,
      media,
    });
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function deleteDocumentation(classId, id) {
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

export async function updateDocumentation(classId, id, data) {
  try {
    const { title, description, new_media_file, remove_media_filename } = data;

    const documentationRef = await db
      .collection("classes")
      .doc(classId)
      .collection("documentation")
      .doc(id);
    const documentationDoc = await documentationRef.get();

    if (!documentationDoc.exists) {
      throw new Error("Documentation not exist in db");
    }

    const documentationData = documentationDoc.data();
    let media = documentationData.media;

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

    // upload new files
    for (const newMediaFile of new_media_file) {
      const { name, type } = newMediaFile;

      const fileRef = bucket.file(
        `classes/${classId}/documentation/${documentationDoc.id}/${name}`
      );

      const arrayBuffer = await newMediaFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await fileRef.save(buffer, {
        contentType: type,
      });
      await fileRef.makePublic();

      media.push({
        url: fileRef.publicUrl(),
        type: type,
        filename: name,
      });
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
