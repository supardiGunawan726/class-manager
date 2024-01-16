import { unstable_cache } from "next/cache";
import { headers } from "next/headers";
import { getUserDataByUid } from "@/lib/firebase/admin/db/user";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { DiscussionList } from "./discussion-list";
import { getAllDiscussions } from "@/lib/firebase/admin/db/discussion";

const getCachedCurrentUser = unstable_cache(
  getUserDataByUid,
  ["current-user"],
  { tags: ["current-user"] }
);

const getCachedAllDiscussions = unstable_cache(
  getAllDiscussions,
  ["discussions"],
  { tags: ["discussions"] }
);

export default async function DiscussionPage() {
  const uid = headers().get("x-uid");
  const user = await getCachedCurrentUser(uid);
  const discussions = await getCachedAllDiscussions(user.class_id);

  return (
    <main className="px-12 pt-10">
      <header>
        <h1 className="font-semibold text-4xl">Forum diskusi</h1>
      </header>
      <section className="mt-12">
        <header className="flex items-center">
          <Input
            type="text"
            name="search"
            id="search"
            placeholder="Cari forum diskusi"
            className="w-[276px]"
          />
          {user && user.role === "ketua" && (
            <>
              <Link
                href="/discussion/new"
                className={cn(buttonVariants(), "ml-auto")}
              >
                Buat forum
              </Link>
            </>
          )}
        </header>
        <DiscussionList discussions={discussions} />
      </section>
    </main>
  );
}
