import {
  getCurrentUser,
  getUsersDataByClassId,
} from "@/lib/firebase/admin/db/user";
import { GroupsGenerator } from "./groups-generator";
import { unstable_cache } from "next/cache";

const getCachedUsersDataByClassId = unstable_cache(
  getUsersDataByClassId,
  ["users"],
  { tags: ["users"] }
);

export default async function GroupsGeneratorPage() {
  const user = await getCurrentUser();
  const users = await getCachedUsersDataByClassId(user.class_id);

  return (
    <main className="px-12 pt-10">
      <header>
        <h1 className="font-semibold text-4xl">Buat kelompok</h1>
      </header>
      <div className="mt-12">
        <GroupsGenerator users={users} />
      </div>
    </main>
  );
}
