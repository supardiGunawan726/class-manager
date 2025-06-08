import { Input } from "@/components/ui/input";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { useGetCurrentUser } from "@/lib/queries/session";
import { useGetDocumentations } from "@/lib/queries/documentations";
import { DocumentationList } from "@/components/documentation/documentation-list";
import AppLayout from "@/components/app-layout";
import { useState } from "react";
import { NewDocumentationDialog } from "@/components/documentation/new-documentation-dialog";

export default function DocumentationPage() {
  const { data: user } = useGetCurrentUser();
  const { data: documentations = [] } = useGetDocumentations(user?.class_id);

  const [isNewDocumentationDialogOpen, setIsNewDocumentationDialogOpen] =
    useState(false);

  return (
    <AppLayout>
      <NewDocumentationDialog
        isOpen={isNewDocumentationDialogOpen}
        handleOpenChange={setIsNewDocumentationDialogOpen}
      />
      <main className="px-12 pt-10">
        <header>
          <h1 className="font-semibold text-4xl">Dokumentasi</h1>
        </header>
        <section className="mt-12">
          <header className="flex items-center">
            {/* <Input
              type="text"
              name="search"
              id="search"
              placeholder="Cari media"
              className="w-[276px]"
            /> */}
            {user && user.role === "ketua" && (
              <>
                <Button
                  type="button"
                  className={cn(buttonVariants(), "ml-auto")}
                  onClick={() => setIsNewDocumentationDialogOpen(true)}
                >
                  Upload
                </Button>
              </>
            )}
          </header>
          <DocumentationList documentations={documentations} />
        </section>
      </main>
    </AppLayout>
  );
}
