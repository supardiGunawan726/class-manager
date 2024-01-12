import { Input } from "@/components/ui/input";
import { unstable_cache } from "next/cache";
import { headers } from "next/headers";
import { getUserDataByUid } from "@/lib/firebase/admin/db/user";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { DocumentationList } from "./documentation-list";
import { getAllDocumentations } from "@/lib/firebase/admin/db/documentation";

const getCachedCurrentUser = unstable_cache(
  getUserDataByUid,
  ["current-user"],
  { tags: ["current-user"] }
);

const getCachedAllDocumentations = unstable_cache(
  getAllDocumentations,
  ["documentations"],
  { tags: ["documentations"] }
);

export default async function DocumentationPage() {
  const uid = headers().get("x-uid");
  const user = await getCachedCurrentUser(uid);

  const documentations = await getCachedAllDocumentations(user.class_id);

  return (
    <main className="px-12 pt-10">
      <header>
        <h1 className="font-semibold text-4xl">Dokumentasi</h1>
      </header>
      <section className="mt-12">
        <header className="flex items-center">
          <Input
            type="text"
            name="search"
            id="search"
            placeholder="Cari media"
            className="w-[276px]"
          />
          {user.role === "ketua" && (
            <>
              <Link
                href="/documentation/new"
                className={cn(buttonVariants(), "ml-auto")}
              >
                Upload
              </Link>
            </>
          )}
        </header>
        <DocumentationList documentations={documentations} />
      </section>
    </main>
  );
}
