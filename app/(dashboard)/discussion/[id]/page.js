import { unstable_cache } from "next/cache";
import {
  getCurrentUser,
  getUsersDataByClassId,
} from "@/lib/firebase/admin/db/user";
import { getDiscussion } from "@/lib/firebase/admin/db/discussion";
import { DiscussionRoom } from "./discussion-room";

const getCachedUsersDataByClassId = unstable_cache(
  getUsersDataByClassId,
  ["users"],
  { tags: ["users"] }
);

const getCachedDiscussion = unstable_cache(getDiscussion, ["discussion"], {
  tags: ["discussion"],
});

export default async function DiscussionRoomPage({ params }) {
  const user = await getCurrentUser();
  const users = await getCachedUsersDataByClassId(user.class_id);
  const discussion = await getCachedDiscussion(user.class_id, params.id);

  return (
    <main className="h-screen grid grid-rows-[90px_1fr]">
      <header className="px-6 bg-slate-800 flex items-center">
        <h1 className="font-semibold text-4xl text-background">
          {discussion.name}
        </h1>
      </header>
      <DiscussionRoom user={user} users={users} discussion={discussion} />
    </main>
  );
}
