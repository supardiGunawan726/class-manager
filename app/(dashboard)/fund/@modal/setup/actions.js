"use server";

import * as fundService from "@/lib/firebase/admin/db/fund";
import { Timestamp } from "firebase-admin/firestore";
import { revalidateTag } from "next/cache";

export async function setupFund(formData) {
  try {
    await fundService.setFund(formData.get("class_id"), {
      billing_amount: parseInt(formData.get("billing_amount"), 10),
      billing_period: formData.get("billing_period"),
      billing_start_date: Timestamp.fromMillis(
        parseInt(formData.get("billing_start_date"), 10)
      ),
    });
    revalidateTag("fund");
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}
