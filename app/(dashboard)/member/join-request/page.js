import { Input } from "@/components/ui/input";
import { headers } from "next/headers";
import { getClassJoinRequest } from "@/lib/firebase/admin/db/class";
import { getUsersDataByUids } from "@/lib/firebase/admin/db/user";
import { JoinRequestTable } from "./join-request-table";

export default async function JoinRequestPage() {
  const userClassId = headers().get("x-class-id");
  const classJoinRequestIds = await getClassJoinRequest(userClassId);
  const classJoinRequests =
    classJoinRequestIds && classJoinRequestIds.length > 0
      ? await getUsersDataByUids(classJoinRequestIds)
      : [];

  return (
    <main className="px-12 pt-10">
      <header>
        <h1 className="font-semibold text-4xl">Permintaan bergabung</h1>
      </header>
      <div className="mt-12">
        <header className="flex items-center">
          <Input
            type="text"
            name="search"
            id="search"
            placeholder="Cari mahasiswa dengan nama"
            className="w-[276px]"
          />
        </header>
        <div className="mt-4">
          <JoinRequestTable
            classId={userClassId}
            classJoinRequests={classJoinRequests}
          />
        </div>
      </div>
    </main>
  );
}
