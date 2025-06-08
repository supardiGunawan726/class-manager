import { updateTransaction } from "@/lib/firebase/admin/db/transaction";
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
      case "POST":
        await updateTransaction(class_id, id, data);
        res.status(200).end();
        break;
      default:
        res.status(404).json({ message: "not found" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message, stack: error.stack });
  }
}
