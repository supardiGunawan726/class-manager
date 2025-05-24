import { getAnnouncements } from "@/lib/firebase/admin/db/announcement";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case "GET":
        const class_id = req.query.class_id as string;
        const announcements = await getAnnouncements(class_id);
        res.status(200).json(announcements);
        break;
      default:
        res.status(404).json({ message: "not found" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
