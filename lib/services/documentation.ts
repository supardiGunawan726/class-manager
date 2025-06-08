import {
  getDownloadURL,
  ref,
  uploadBytes,
  UploadResult,
} from "firebase/storage";
import { Documentation } from "../firebase/model/documentation";
import { db, storage } from "../firebase/firebase-config";
import { collection, doc } from "firebase/firestore";

export async function getDocumentations(
  class_id: string
): Promise<Documentation[]> {
  const res = await fetch(`/api/classes/${class_id}/documentations`, {
    method: "GET",
  });
  return await res.json();
}

export async function getDocumentation(
  class_id: string,
  id: string
): Promise<Documentation> {
  const res = await fetch(`/api/classes/${class_id}/documentations/${id}`, {
    method: "GET",
  });
  return await res.json();
}

export async function deleteDocumentation(class_id: string, id: string) {
  return await fetch(`/api/classes/${class_id}/documentations/${id}`, {
    method: "DELETE",
  });
}

export async function updateDocumentation(
  class_id: string,
  id: string,
  data: Omit<Documentation, "id" | "published_at" | "media" | "author"> & {
    new_media: File[];
    remove_media_filename: string[];
  }
) {
  const { new_media, remove_media_filename, ...restData } = data;

  const uploadPromises: Promise<UploadResult>[] = [];
  for (const media of new_media) {
    const storageRef = ref(
      storage,
      `classes/${class_id}/documentation/${id}/${media.name}`
    );
    uploadPromises.push(uploadBytes(storageRef, media));
  }
  const results = await Promise.all(uploadPromises);

  const newMediaFile: {
    filename: string;
    type?: string;
    url: string;
  }[] = [];
  for (const result of results) {
    const url = await getDownloadURL(result.ref);
    newMediaFile.push({
      filename: result.metadata.name,
      type: result.metadata.contentType,
      url,
    });
  }

  return await fetch(`/api/classes/${class_id}/documentations/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "json/application",
    },
    body: JSON.stringify({
      ...restData,
      new_media_file: newMediaFile,
      remove_media_filename,
    }),
  });
}

export async function createDocumentation(
  class_id: string,
  data: Omit<Documentation, "id" | "published_at" | "media"> & {
    media_file: File[];
  }
) {
  const { media_file, ...restData } = data;

  const id = doc(collection(db, `classes/${class_id}/documentation`)).id;

  const uploadPromises: Promise<UploadResult>[] = [];
  for (const media of media_file) {
    const storageRef = ref(
      storage,
      `classes/${class_id}/documentation/${id}/${media.name}`
    );
    uploadPromises.push(uploadBytes(storageRef, media));
  }
  const results = await Promise.all(uploadPromises);

  const media: {
    filename: string;
    type?: string;
    url: string;
  }[] = [];
  for (const result of results) {
    const url = await getDownloadURL(result.ref);
    media.push({
      filename: result.metadata.name,
      type: result.metadata.contentType,
      url,
    });
  }

  return await fetch(`/api/classes/${class_id}/documentations`, {
    method: "POST",
    headers: {
      "Content-Type": "json/application",
    },
    body: JSON.stringify({
      ...restData,
      id,
      media,
    }),
  });
}
