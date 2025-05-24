import { array, InferType, object, string } from "yup";

const UserClassSchema = object().shape({
  id: string().required(),
  name: string().required(),
  description: string().required(),
  member: array().of(string()).default([]),
});

export type UserClass = InferType<typeof UserClassSchema>;
