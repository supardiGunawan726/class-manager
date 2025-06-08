import { getFundByClassId } from "@/lib/firebase/admin/db/fund";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      const class_id = req.query.class_id as string;

      const fund = await getFundByClassId(class_id);
      res.status(200).json(fund);
      break;
    default:
      res.status(404).json({ message: "not found" });
  }
}
