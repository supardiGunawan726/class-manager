import { array, number, object, string } from "yup";

export const DocumentationSchema = object().shape({
  id: string(),
  description: string(),
  tag: array().of(string()),
  file_type: string(),
  file_url: string(),
  class_id: string(),
  created_at: number(),
  updated_at: number(),
});
