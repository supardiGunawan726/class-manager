import {
  createDiscussion,
  getAllDiscussions,
} from "@/lib/firebase/admin/db/discussion";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const class_id = req.query.class_id as string;

  let data;
  try {
    data = JSON.parse(req.body);
  } catch (error) {
    data = {};
  }

  try {
    switch (req.method) {
      case "GET":
        const discussions = await getAllDiscussions(class_id);
        res.status(200).json(discussions);
        break;
      case "PUT":
        await createDiscussion(class_id, data);
        res.status(200).end();
        break;
      default:
        res.status(404).json({ message: "not found" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
