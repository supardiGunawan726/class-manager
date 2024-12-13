import { number, object, string } from "yup";

export const MessageSchema = object().shape({
  id: string(),
  room_id: string(),
  content: string(),
  class_id: string(),
  created_at: number(),
  updated_at: number(),
});
