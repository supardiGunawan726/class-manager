import { getUserDataByUid } from "@/lib/firebase/admin/db/user";
import { notFound } from "next/navigation";
import * as Icon from "lucide-react";
import { MemberToolbar } from "./member-toolbar";
import { Separator } from "@/components/ui/separator";
import { unstable_cache } from "next/cache";

const getCachedCurrentUser = unstable_cache(
  getUserDataByUid,
  ["current-user"],
  { tags: ["current-user"] }
);

export default async function MemberPage({ params }) {
  const { uid } = params;

  if (!uid) {
    return notFound();
  }

  const user = await getCachedCurrentUser(uid);

  if (!user) {
    return notFound();
  }

  return (
    <main className="px-12 pt-10">
      <header className="flex items-center justify-start gap-6">
        <div>
          <figure className="w-24 h-24 bg-slate-500 text-white grid place-items-center rounded-full">
            <Icon.User2 />
          </figure>
        </div>
        <div>
          <h1 className="font-semibold text-4xl">{user.name}</h1>
          <p>
            {user.email} - {user.nim}
          </p>
        </div>
        <MemberToolbar user={user} />
      </header>
      <Separator className="my-6" />
    </main>
  );
}
