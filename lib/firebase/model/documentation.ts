import { array, InferType, number, object, string } from "yup";

const DocumentationMediaSchema = object().shape({
  url: string().required(),
  type: string().required(),
  filename: string().required(),
});

const DocumentationSchema = object().shape({
  id: string().required(),
  author: string().required(),
  title: string().required(),
  description: string().required(),
  media: array().of(DocumentationMediaSchema).required(),
  published_at: object().shape({
    seconds: number().required(),
    nanoseconds: number().required(),
  }),
});

export type Documentation = InferType<typeof DocumentationSchema>;
export type DocumentationMedia = InferType<typeof DocumentationMediaSchema>;
