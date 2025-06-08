import {
  addClassJoinRequest,
  getClassJoinRequest,
} from "@/lib/firebase/admin/db/class";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const class_id = req.query.class_id as string;
    let data;
    try {
      data = JSON.parse(req.body);
    } catch (error) {
      data = {};
    }

    switch (req.method) {
      case "GET":
        const joinRequest = await getClassJoinRequest(class_id);
        res.status(200).json(joinRequest);
        break;
      case "PUT":
        await addClassJoinRequest(class_id, data.uid);
        res.status(200).end();
        break;
      default:
        res.status(404).json({ message: "not found" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
