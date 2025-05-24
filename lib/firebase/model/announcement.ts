import { InferType, number, object, string } from "yup";

const AnnouncementSchema = object().shape({
  id: string().required(),
  author: string().required(),
  title: string().required(),
  content: string().required(),
  published_at: object().shape({
    seconds: number().required(),
    nanoseconds: number().required(),
  }),
});

export type Announcement = InferType<typeof AnnouncementSchema>;
