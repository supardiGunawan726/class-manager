import { InferType, number, object, string } from "yup";

export const DiscussionSchema = object().shape({
  id: string().required(),
  name: string().required(),
  description: string().required(),
});

export const DiscussionChatSchema = object().shape({
  id: string().required(),
  sender_id: string().required(),
  content: string().required(),
  sent_at: object().shape({
    seconds: number().required(),
    nanoseconds: number().required(),
  }),
});

export type Discussion = InferType<typeof DiscussionSchema>;
export type DiscussionChat = InferType<typeof DiscussionChatSchema>;
