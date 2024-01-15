"use server";

import { updateTransaction } from "@/lib/firebase/admin/db/fund";
import { revalidateTag } from "next/cache";

export async function verifyTransactions(formData) {
  try {
    const updateAllTransactions = [];

    for (const transactionId of formData.getAll("transactions_id")) {
      updateAllTransactions.push(
        updateTransaction(formData.get("class_id"), transactionId, {
          verified: true,
        })
      );
    }

    await Promise.all(updateAllTransactions);
    revalidateTag("billings");
    revalidateTag("transactions");
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function unverifyTransactions(formData) {
  try {
    const updateAllTransactions = [];

    for (const transactionId of formData.getAll("transactions_id")) {
      updateAllTransactions.push(
        updateTransaction(formData.get("class_id"), transactionId, {
          verified: false,
        })
      );
    }

    await Promise.all(updateAllTransactions);
    revalidateTag("billings");
    revalidateTag("transactions");
  } catch (error) {
    return Promise.reject(error);
  }
}
