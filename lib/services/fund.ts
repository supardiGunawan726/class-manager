import { Fund } from "../firebase/model/fund";

export async function getFundByClassId(class_id: string): Promise<Fund> {
  const res = await fetch(`/api/funds/${class_id}`, {
    method: "GET",
  });

  if (res.status !== 200) {
    const json = await res.json();
    throw new Error(json.message);
  }

  return await res.json();
}
