import { setUserData } from "@/lib/firebase/admin/db/user";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "PUT":
      const uid = req.query.uid as string;
      const data = JSON.parse(req.body);

      await setUserData(uid, {
        name: data.name,
        email: data.email,
        role: data.role,
        nim: data.nim,
        class_id: data.class_id,
        password: data.password,
      });
      res.status(200).end();
      break;
    default:
      res.status(404).json({ message: "not found" });
  }
}
