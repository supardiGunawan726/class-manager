import { headers } from "next/headers";
import { getClassById } from "@/lib/firebase/admin/db/class";
import { getUsersDataByUids } from "@/lib/firebase/admin/db/user";
import { MemberTable, MemberTableToolbar } from "./member-table";

export default async function MemberPage() {
  const userClassId = headers().get("x-class-id");
  const userClass = await getClassById(userClassId);
  const userClassMembers = await getUsersDataByUids(userClass.member);

  return (
    <main className="px-12 pt-10">
      <header>
        <h1 className="font-semibold text-4xl">Data mahasiswa</h1>
      </header>
      <div className="mt-12">
        <MemberTableToolbar />
        <div className="mt-4">
          <MemberTable
            userClassId={userClassId}
            userClassMembers={userClassMembers}
          />
        </div>
      </div>
    </main>
  );
}
