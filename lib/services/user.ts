import { User } from "../firebase/model/user";

export async function setUserData(data: User) {
  try {
    return await fetch(`/api/users/${data.uid}`, {
      method: "POST",
      headers: {
        "content-type": "json/application",
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        role: data.role,
        nim: data.nim,
      }),
    });
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function getUsersByClassId(class_id: string): Promise<User[]> {
  try {
    const res = await fetch(`/api/users/?class_id=${class_id}`, {
      method: "GET",
    });

    if (res.status !== 200) {
      const json = await res.json();
      throw new Error(json.message);
    }

    return res.json();
  } catch (error) {
    return Promise.reject(error);
  }
}
