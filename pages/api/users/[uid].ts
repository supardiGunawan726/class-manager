import { getUserDataByUid, setUserData } from "@/lib/firebase/admin/db/user";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const uid = req.query.uid as string;

  switch (req.method) {
    case "GET":
      const user = await getUserDataByUid(uid);

      res.status(200).json(user);
      break;
    case "PUT":
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
