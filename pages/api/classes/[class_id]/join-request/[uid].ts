import {
  approveJoinRequest,
  declineJoinRequest,
} from "@/lib/firebase/admin/db/class";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const class_id = req.query.class_id as string;
    const uid = req.query.uid as string;
    switch (req.method) {
      case "POST":
        await approveJoinRequest(class_id, uid);
        res.status(200).end();
        break;
      case "DELETE":
        await declineJoinRequest(class_id, uid);
        res.status(200).end();
        break;
      default:
        res.status(404).json({ message: "not found" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
