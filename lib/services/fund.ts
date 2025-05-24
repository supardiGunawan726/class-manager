import { Fund } from "../firebase/model/fund";

export async function getFundByClassId(class_id: string): Promise<Fund> {
  const res = await fetch(`/api/funds/${class_id}`, {
    method: "GET",
  });
  return await res.json();
}
