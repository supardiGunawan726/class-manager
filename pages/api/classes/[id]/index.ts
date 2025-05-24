import { getClassById } from "@/lib/firebase/admin/db/class";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      const id = req.query.id as string;

      const userClass = await getClassById(id);
      res.status(200).json(userClass);
      break;
    default:
      res.status(404).json({ message: "not found" });
  }
}
