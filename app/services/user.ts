import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase";

export async function register({
  email,
  name,
  password,
}: {
  email: string;
  name: string;
  password: string;
}) {
  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCred.user;
  await updateProfile(user, { displayName: name });
}

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  await signInWithEmailAndPassword(auth, email, password);
}
