import { number, object, string } from "yup";

export const UserSchema = object().shape({
  id: string(),
  name: string(),
  role: string(),
  class_id: string(),
  join_status: string(),
  created_at: number(),
  updated_at: number(),
});
