import { AnnouncementCard } from "@/components/announcement";
import { getAnnouncements } from "@/lib/firebase/admin/db/announcement";
import { unstable_cache } from "next/cache";
import { headers } from "next/headers";
import { getUserDataByUid } from "@/lib/firebase/admin/db/user";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const getCachedCurrentUser = unstable_cache(
  getUserDataByUid,
  ["current-user"],
  { tags: ["current-user"] }
);

const getCachedAllAnnouncements = unstable_cache(
  getAnnouncements,
  ["announcements"],
  { tags: ["announcements"] }
);

export default async function AnnouncementPage() {
  const uid = headers().get("x-uid");
  const user = await getCachedCurrentUser(uid);

  const announcements = await getCachedAllAnnouncements(user.class_id, 50);

  return (
    <main className="px-12 pt-10">
      <header>
        <h1 className="font-semibold text-4xl">Pengumuman</h1>
      </header>
      <section className="mt-12">
        <header className="flex items-center">
          <Input
            type="text"
            name="search"
            id="search"
            placeholder="Cari pengumuman"
            className="w-[276px]"
          />
          {user.role === "ketua" && (
            <>
              <Link
                href="/announcement/new"
                className={cn(buttonVariants(), "ml-auto")}
              >
                Buat pengumuman
              </Link>
            </>
          )}
        </header>
        <div className="mt-4 grid grid-cols-3 gap-4">
          {announcements.map((announcement) => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
              user={user}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
