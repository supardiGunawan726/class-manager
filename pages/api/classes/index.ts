import { createClass, getClassById } from "@/lib/firebase/admin/db/class";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    let data;
    try {
      data = JSON.parse(req.body);
    } catch (error) {
      data = {};
    }

    switch (req.method) {
      case "PUT":
        const userClass = await createClass(data);
        res.status(200).json(userClass);
        break;
      default:
        res.status(404).json({ message: "not found" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
