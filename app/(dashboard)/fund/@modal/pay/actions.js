"use server";

import * as fundService from "@/lib/firebase/admin/db/fund";
import * as DateFns from "date-fns";
import { Timestamp } from "firebase-admin/firestore";
import { revalidateTag } from "next/cache";

export async function createTransaction(formData) {
  try {
    const billingDate = DateFns.parse(
      formData.get("billing_date"),
      "dd-MM-yyyy",
      new Date()
    );

    await fundService.createTransaction(formData.get("class_id"), {
      user_id: formData.get("user_id"),
      amount: parseInt(formData.get("amount")),
      billing_date: Timestamp.fromDate(billingDate),
      date: Timestamp.fromMillis(parseInt(formData.get("date"), 10)),
      proof: formData.get("proof"),
      verified: false,
    });
    revalidateTag("billings");
    revalidateTag("transactions");
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}
