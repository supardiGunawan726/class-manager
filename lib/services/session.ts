import { User } from "../firebase/model/user";

export async function createCookie(idToken: string) {
  return await fetch("/api/session/cookie", {
    method: "POST",
    headers: {
      "content-type": "json/application",
    },
    body: JSON.stringify({ idToken }),
  });
}

export async function getCurrentUser(): Promise<User> {
  const res = await fetch("/api/session/user", {
    method: "GET",
  });
  return await res.json();
}
