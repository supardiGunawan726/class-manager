import { Input } from "@/components/ui/input";
import { getClassJoinRequest } from "@/lib/firebase/admin/db/class";
import {
  getCurrentUser,
  getUsersDataByUids,
} from "@/lib/firebase/admin/db/user";
import { JoinRequestTable } from "./join-request-table";
import { revalidateTag, unstable_cache } from "next/cache";

const getCachedClassJoinRequest = unstable_cache(
  getClassJoinRequest,
  ["join_requests"],
  { tags: ["join_requests"] }
);

const getCachedUsersDataByUids = unstable_cache(
  getUsersDataByUids,
  ["join_requests"],
  { tags: ["join_requests"] }
);

export default async function JoinRequestPage() {
  const user = await getCurrentUser();
  const classJoinRequestIds = await getCachedClassJoinRequest(user.class_id);
  const userClassJoinRequests =
    classJoinRequestIds && classJoinRequestIds.length > 0
      ? await getCachedUsersDataByUids(classJoinRequestIds)
      : [];

  return (
    <main className="px-12 pt-10">
      <header>
        <h1 className="font-semibold text-4xl">Permintaan bergabung</h1>
      </header>
      <div className="mt-12">
        <div className="mt-4">
          {userClassJoinRequests.length < 1 && (
            <div className="flex flex-col items-center justify-center gap-4 min-h-[500px]">
              <p className="text-sm text-slate-500 text-center">
                Permintaan bergabung kosong
              </p>
            </div>
          )}
          {userClassJoinRequests.length > 0 && (
            <>
              <header className="flex items-center">
                <Input
                  type="text"
                  name="search"
                  id="search"
                  placeholder="Cari mahasiswa dengan nama"
                  className="w-[276px]"
                />
              </header>
              <JoinRequestTable
                user={user}
                userClassJoinRequests={userClassJoinRequests}
              />
            </>
          )}
        </div>
      </div>
    </main>
  );
}
