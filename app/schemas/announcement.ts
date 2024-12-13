import { number, object, string } from "yup";

export const AnnouncementSchema = object().shape({
  id: string(),
  name: string(),
  class_id: string(),
  created_at: number(),
  updated_at: number(),
});
