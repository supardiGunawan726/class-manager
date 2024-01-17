import { AnnouncementCard } from "@/components/announcement";
import { getAnnouncements } from "@/lib/firebase/admin/db/announcement";
import { unstable_cache } from "next/cache";
import { getCurrentUser } from "@/lib/firebase/admin/db/user";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const getCachedAllAnnouncements = unstable_cache(
  getAnnouncements,
  ["announcements"],
  { tags: ["announcements"] }
);

export default async function AnnouncementPage() {
  const user = await getCurrentUser();

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
        {announcements.length < 1 && (
          <div className="mt-4 flex flex-col items-center justify-center gap-4 min-h-[500px]">
            <p className="text-sm text-slate-500 text-center">
              Belum ada pengumuman
            </p>
          </div>
        )}
        {announcements.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-4">
            {announcements.map((announcement) => (
              <AnnouncementCard
                key={announcement.id}
                announcement={announcement}
                user={user}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
