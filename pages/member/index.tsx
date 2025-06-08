import { useGetUsersByClassId } from "@/lib/queries/user";
import {
  MemberTable,
  MemberTableToolbar,
} from "../../components/member/member-table";
import { useGetCurrentUser } from "@/lib/queries/session";
import AppLayout from "@/components/app-layout";

export default function Member() {
  const { data: user } = useGetCurrentUser();
  const { data: userClassMembers = [] } = useGetUsersByClassId(user?.class_id!);

  return (
    <AppLayout>
      <main className="px-12 pt-10">
        <header>
          <h1 className="font-semibold text-4xl">Data mahasiswa</h1>
        </header>
        {user && (
          <div className="mt-12">
            <MemberTableToolbar user={user} />
            <div className="mt-4">
              <MemberTable user={user} userClassMembers={userClassMembers} />
            </div>
          </div>
        )}
      </main>
    </AppLayout>
  );
}
