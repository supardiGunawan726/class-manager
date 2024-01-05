"use server";

import { setUserData } from "@/lib/firebase/admin/db/user";
import { cleanUndefined } from "@/lib/utils";
import { revalidateTag } from "next/cache";

export async function saveData(data) {
  await setUserData(
    data.uid,
    cleanUndefined({
      name: data.name,
      email: data.email,
      nim: data.nim,
    })
  );
  revalidateTag("current-user");
}
