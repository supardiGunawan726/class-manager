import AppLayout from "@/components/app-layout";
import { DiscussionRoom } from "@/components/discussion/discussion-room";
import { useGetDiscussion } from "@/lib/queries/discussion";
import { useGetCurrentUser } from "@/lib/queries/session";
import { useGetUsersByClassId } from "@/lib/queries/user";
import { useRouter } from "next/router";

export default function DiscussionChat() {
  const router = useRouter();

  const { data: user } = useGetCurrentUser();
  const { data: users } = useGetUsersByClassId(user?.class_id);
  const { data: discussion } = useGetDiscussion(
    user?.class_id,
    router.query.id as string
  );

  return (
    <AppLayout>
      <main className="h-screen grid grid-rows-[90px_1fr]">
        {user && users && discussion && (
          <>
            <header className="px-6 bg-slate-800 flex items-center">
              <h1 className="font-semibold text-4xl text-background">
                {discussion.name}
              </h1>
            </header>
            <DiscussionRoom user={user} users={users} discussion={discussion} />
          </>
        )}
      </main>
    </AppLayout>
  );
}
