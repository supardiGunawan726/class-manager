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

export async function removeCookie() {
  return await fetch("/api/session/cookie", {
    method: "DELETE",
  });
}

export async function getCurrentUser(): Promise<User> {
  const res = await fetch("/api/session/user", {
    method: "GET",
  });

  if (res.status !== 200) {
    const json = await res.json();
    throw new Error(json.message);
  }

  return await res.json();
}
