import {
  collection,
  DocumentData,
  onSnapshot,
  orderBy,
  query,
  QuerySnapshot,
} from "firebase/firestore";
import { db } from "../firebase-config";

export function subscribeChats(
  classId: string,
  discussionId: string,
  callback: (snapshot: QuerySnapshot<DocumentData, DocumentData>) => void
) {
  const chatsRef = query(
    collection(db, "classes", classId, "discussions", discussionId, "chats"),
    orderBy("sent_at", "asc")
  );

  return onSnapshot(chatsRef, { next: callback });
}
