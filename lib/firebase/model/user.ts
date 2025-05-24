import { InferType, object, string } from "yup";

const UserSchema = object().shape({
  uid: string().required(),
  email: string().email().required(),
  role: string().oneOf(["ketua", "anggota"]),
  name: string().required(),
  nim: string().required(),
  class_id: string(),
});

export type User = InferType<typeof UserSchema>;
export type UserOnFirebase = Omit<User, "role" | "uid">;
