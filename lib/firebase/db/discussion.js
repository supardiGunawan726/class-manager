import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../firebase-config";

export function subscribeChats(classId, discussionId, callback) {
  const chatsRef = query(
    collection(db, "classes", classId, "discussions", discussionId, "chats"),
    orderBy("sent_at", "asc")
  );

  return onSnapshot(chatsRef, { next: callback });
}
