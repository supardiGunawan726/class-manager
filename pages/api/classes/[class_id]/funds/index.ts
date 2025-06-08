import { getFundByClassId, setFund } from "@/lib/firebase/admin/db/fund";
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

  switch (req.method) {
    case "GET":
      const fund = await getFundByClassId(class_id);
      res.status(200).json(fund);
      break;
    case "POST":
      await setFund(class_id, data);
      res.status(200).end();
      break;
    default:
      res.status(404).json({ message: "not found" });
  }
}
