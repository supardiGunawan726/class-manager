import { getBillingsByClassId } from "@/lib/firebase/admin/db/billing";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case "GET":
        const q = {} as {
          datePeriod?: { seconds: number; nanoseconds: number };
        };

        if (req.query.datePeriod_seconds && req.query.datePeriod_nanoseconds) {
          q.datePeriod = {
            seconds: parseInt(req.query.datePeriod_seconds as string),
            nanoseconds: parseInt(req.query.datePeriod_nanoseconds as string),
          };
        }

        const billings = await getBillingsByClassId(
          req.query.class_id as string,
          q
        );
        res.status(200).json(billings);
        break;
      default:
        res.status(404).json({ message: "not found" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
