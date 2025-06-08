import { collection, doc, Timestamp } from "firebase/firestore";
import { Transaction } from "../firebase/model/transaction";
import { db, storage } from "../firebase/firebase-config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export async function getTransactions(
  class_id: string
): Promise<Transaction[]> {
  const res = await fetch(`/api/classes/${class_id}/transactions`, {
    method: "GET",
  });

  if (res.status !== 200) {
    const json = await res.json();
    throw new Error(json.message);
  }

  return await res.json();
}

export async function createTransaction(
  class_id: string,
  data: Omit<Transaction, "id" | "proof"> & {
    proof: File;
  }
) {
  const { proof, ...restData } = data;

  const id = doc(collection(db, `classes/${class_id}/transactions`)).id;
  const convertedDate = new Timestamp(
    restData.date.seconds,
    restData.date.nanoseconds
  );

  const storageRef = ref(
    storage,
    `classes/${class_id}/transactions/${id}/${
      restData.user_id
    }_${convertedDate.toMillis()}`
  );

  const result = await uploadBytes(storageRef, proof);
  const proofUrl = await getDownloadURL(result.ref);

  return await fetch(`/api/classes/${class_id}/transactions`, {
    method: "PUT",
    headers: {
      "Content-Type": "json/application",
    },
    body: JSON.stringify({
      ...restData,
      id,
      proof: proofUrl,
    }),
  });
}

export async function updateTransaction(
  class_id: string,
  id: string,
  data: Partial<Omit<Transaction, "id">>
) {
  return await fetch(`/api/classes/${class_id}/transactions/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "json/application",
    },
    body: JSON.stringify(data),
  });
}
