import { number, object, string } from "yup";

export const ClassSchema = object().shape({
  id: string(),
  name: string(),
  description: string(),
  created_at: number(),
  updated_at: number(),
});
