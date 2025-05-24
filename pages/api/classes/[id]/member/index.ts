import {
  addClassMember,
  removeClassMember,
} from "@/lib/firebase/admin/db/class";
import {
  createUser,
  getUserDataByEmail,
  setUserData,
} from "@/lib/firebase/admin/db/user";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case "POST":
        const class_id = req.query.id as string;
        const { email, name, nim, password } = JSON.parse(req.body);
        const user = await getUserDataByEmail(email).catch(async function () {
          const newUser = await createUser({
            email: email as string,
            name: name as string,
            nim: nim as string,
            password: password as string,
          });

          return newUser;
        });

        if (!user) {
          throw new Error("Error creating user");
        }

        if (user.class_id) {
          throw new Error("User has join other class");
        }

        await addClassMember(class_id, user.uid);
        await setUserData(user.uid, {
          class_id,
          role: "anggota",
        });

        res.status(200).json(user);
        break;
      default:
        res.status(404).json({ message: "not found" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
