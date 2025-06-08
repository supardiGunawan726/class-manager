import { getDiscussion } from "@/lib/firebase/admin/db/discussion";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const class_id = req.query.class_id as string;
  const id = req.query.id as string;

  let data;
  try {
    data = JSON.parse(req.body);
  } catch (error) {
    data = {};
  }

  try {
    switch (req.method) {
      case "GET":
        const discussion = await getDiscussion(class_id, id);
        res.status(200).json(discussion);
        break;
      default:
        res.status(404).json({ message: "not found" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
