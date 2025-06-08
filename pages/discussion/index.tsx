import AppLayout from "@/components/app-layout";
import { DiscussionList } from "@/components/discussion/discussion-list";
import { NewDiscussionDialog } from "@/components/discussion/new-discussion-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetDiscussions } from "@/lib/queries/discussion";
import { useGetCurrentUser } from "@/lib/queries/session";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function DiscussionPage() {
  const { data: user } = useGetCurrentUser();
  const { data: discussions } = useGetDiscussions(user?.class_id);

  const [isNewDiscussionDialogOpen, setIsNewDiscussionDialogOpen] =
    useState(false);

  return (
    <AppLayout>
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
                <NewDiscussionDialog
                  user={user}
                  isOpen={isNewDiscussionDialogOpen}
                  onOpenChange={setIsNewDiscussionDialogOpen}
                />
                <Button
                  className={cn(buttonVariants(), "ml-auto")}
                  onClick={() => setIsNewDiscussionDialogOpen(true)}
                >
                  Buat forum
                </Button>
              </>
            )}
          </header>
          {discussions && <DiscussionList discussions={discussions} />}
        </section>
      </main>
    </AppLayout>
  );
}
