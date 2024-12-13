import { number, object, string } from "yup";

export const ChatRoomSchema = object().shape({
  id: string(),
  title: string(),
  description: string(),
  class_id: string(),
  created_at: number(),
  updated_at: number(),
});
