import {
  getCurrentUser,
  getUsersDataByClassId,
} from "@/lib/firebase/admin/db/user";
import { MemberTable, MemberTableToolbar } from "./member-table";
import { unstable_cache } from "next/cache";

const getCachedUsersDataByClassId = unstable_cache(
  getUsersDataByClassId,
  ["users"],
  { tags: ["users"] }
);

export default async function MemberPage() {
  const user = await getCurrentUser();
  const userClassMembers = await getCachedUsersDataByClassId(user.class_id);

  return (
    <main className="px-12 pt-10">
      <header>
        <h1 className="font-semibold text-4xl">Data mahasiswa</h1>
      </header>
      <div className="mt-12">
        <MemberTableToolbar />
        <div className="mt-4">
          <MemberTable currentUser={user} userClassMembers={userClassMembers} />
        </div>
      </div>
    </main>
  );
}
