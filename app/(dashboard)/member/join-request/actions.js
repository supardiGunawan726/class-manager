"use server";

import * as userClassService from "@/lib/firebase/admin/db/class";
import { revalidateTag } from "next/cache";

export async function approveJoinRequest(formData) {
  try {
    await userClassService.approveJoinRequest(
      formData.get("class_id"),
      formData.get("uid")
    );
    revalidateTag("join_requests");
    revalidateTag("users");
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function declineJoinRequest(formData) {
  try {
    await userClassService.declineJoinRequest(
      formData.get("class_id"),
      formData.get("uid")
    );
    revalidateTag("join_requests");
    revalidateTag("users");
  } catch (error) {
    return Promise.reject(error);
  }
}
