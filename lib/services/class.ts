import { UserClass } from "../firebase/model/class";
import { User } from "../firebase/model/user";

export async function getClassById(id: string): Promise<UserClass> {
  const res = await fetch(`/api/classes/${id}`, {
    method: "GET",
  });
  return await res.json();
}

export async function addClassMember(
  user: Omit<User, "uid"> & { password: string }
) {
  const res = await fetch(`/api/classes/${user.class_id}/member`, {
    method: "POST",
    headers: {
      "Content-Type": "json/application",
    },
    body: JSON.stringify(user),
  });
  return res.json();
}

export async function removeClassMember(class_id: string, uid: string) {
  await fetch(`/api/classes/${class_id}/member/${uid}`, {
    method: "DELETE",
  });
}

export async function getClassJoinRequest(class_id: string): Promise<User[]> {
  const res = await fetch(`/api/classes/${class_id}/join-request`, {
    method: "GET",
  });
  return res.json();
}

export async function approveJoinRequest(class_id: string, uid: string) {
  await fetch(`/api/classes/${class_id}/join-request/${uid}`, {
    method: "POST",
  });
}

export async function declineJoinRequest(class_id: string, uid: string) {
  await fetch(`/api/classes/${class_id}/join-request/${uid}`, {
    method: "DELETE",
  });
}
