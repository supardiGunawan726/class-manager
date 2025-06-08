import { AnnouncementCard } from "@/components/announcement/announcement";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { useGetCurrentUser } from "@/lib/queries/session";
import { useGetAnnouncements } from "@/lib/queries/announcement";
import AppLayout from "@/components/app-layout";
import { NewAnnouncementDialog } from "@/components/announcement/new-announcement-dialog";
import { useState } from "react";

export default function AnnouncementPage() {
  const { data: user } = useGetCurrentUser();
  const { data: announcements } = useGetAnnouncements(user?.class_id);

  const [isNewAnnouncementDialogOpen, setisNewAnnouncementDialogOpen] =
    useState(false);

  return (
    <AppLayout>
      {user && (
        <NewAnnouncementDialog
          user={user}
          isOpen={isNewAnnouncementDialogOpen}
          openOpenChange={setisNewAnnouncementDialogOpen}
        />
      )}
      <main className="px-12 pt-10">
        <header>
          <h1 className="font-semibold text-4xl">Pengumuman</h1>
        </header>
        {user && announcements && (
          <section className="mt-12">
            <header className="flex items-center">
              {/* <Input
                type="text"
                name="search"
                id="search"
                placeholder="Cari pengumuman"
                className="w-[276px]"
              /> */}
              {user.role === "ketua" && (
                <>
                  <Button
                    className={cn(buttonVariants(), "ml-auto cursor-pointer")}
                    onClick={() => setisNewAnnouncementDialogOpen(true)}
                  >
                    Buat pengumuman
                  </Button>
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
                  />
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </AppLayout>
  );
}
