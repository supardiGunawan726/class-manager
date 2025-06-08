import {
  deleteAnnouncement,
  getAnnouncement,
  updateAnnouncement,
} from "@/lib/firebase/admin/db/announcement";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const class_id = req.query.class_id as string;
    const id = req.query.id as string;
    let data;
    try {
      data = JSON.parse(req.body);
    } catch (error) {
      data = {};
    }

    switch (req.method) {
      case "GET":
        const announcement = await getAnnouncement(class_id, id);
        res.status(200).json(announcement);
        break;
      case "POST":
        await updateAnnouncement(class_id, id, data);
        res.status(200).end();
        break;
      case "DELETE":
        await deleteAnnouncement(class_id, id);
        res.status(200).end();
        break;
      default:
        res.status(404).json({ message: "not found" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
