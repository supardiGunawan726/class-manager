import {
  createTransaction,
  getAllTransactions,
  getTransactionsByUserId,
} from "@/lib/firebase/admin/db/transaction";
import { Transaction } from "@/lib/firebase/model/transaction";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const class_id = req.query.class_id as string;
    const user_id = req.query.user_id as string | undefined;

    let data;
    try {
      data = JSON.parse(req.body);
    } catch (error) {
      data = {};
    }

    switch (req.method) {
      case "GET":
        let transactions: Transaction[] = [];
        if (user_id) {
          transactions = await getTransactionsByUserId(class_id, user_id);
        } else {
          transactions = await getAllTransactions(class_id);
        }

        res.status(200).json(transactions);
        break;
      case "PUT":
        await createTransaction(class_id, data);
        res.status(200).end();
        break;
      default:
        res.status(404).json({ message: "not found" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message, stack: error.stack });
  }
}
