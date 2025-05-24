import { GroupsGenerator } from "./groups-generator";
import { useGetCurrentUser } from "@/lib/queries/session";
import { useGetUsersByClassId } from "@/lib/queries/user";
import AppLayout from "@/pages/_layout";

export default function GroupsGeneratorPage() {
  const { data: user } = useGetCurrentUser();
  const { data: users = [] } = useGetUsersByClassId(user?.class_id);

  return (
    <AppLayout>
      <main className="px-12 pt-10">
        <header>
          <h1 className="font-semibold text-4xl">Buat kelompok</h1>
        </header>
        <div className="mt-12">
          <GroupsGenerator users={users} />
        </div>
      </main>
    </AppLayout>
  );
}
