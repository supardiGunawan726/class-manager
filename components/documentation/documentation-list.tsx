import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Documentation } from "@/lib/firebase/model/documentation";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { DocumentationDialog } from "./documentation-dialog";
import { EditDocumentationDialog } from "./edit-documentation-dialog";
import { NewDocumentationDialog } from "./new-documentation-dialog";

type DocumentationListProps = {
  documentations: Documentation[];
};

export function DocumentationList({ documentations }: DocumentationListProps) {
  const [documentationDialog, setDocumentationDialog] = useState({
    isOpen: false,
    documentationId: "",
  });
  const [editDocumentationDialog, setEditDocumentationDialog] = useState({
    isOpen: false,
    documentationId: "",
  });

  if (documentations.length < 1) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 min-h-[500px]">
        <p className="text-sm text-slate-500 text-center">
          Belum ada dokumentasi
        </p>
      </div>
    );
  }

  return (
    <>
      <DocumentationDialog
        documentationId={documentationDialog.documentationId}
        isOpen={documentationDialog.isOpen}
        handleOpenChange={(isOpen) =>
          setDocumentationDialog((prev) => ({ ...prev, isOpen }))
        }
        onClickEdit={() => {
          setDocumentationDialog((prev) => ({ ...prev, isOpen: false }));
          setEditDocumentationDialog({
            documentationId: documentationDialog.documentationId,
            isOpen: true,
          });
        }}
        onDelete={() => {
          setDocumentationDialog((prev) => ({ ...prev, isOpen: false }));
        }}
      />
      <EditDocumentationDialog
        documentationId={editDocumentationDialog.documentationId}
        isOpen={editDocumentationDialog.isOpen}
        handleOpenChange={(isOpen) =>
          setEditDocumentationDialog((prev) => ({ ...prev, isOpen }))
        }
      />
      <div className="mt-4 grid grid-cols-2 gap-4">
        {documentations.map((documentation) => (
          <Carousel className="w-full" key={documentation.id}>
            <CarouselContent>
              {documentation.media.map((mediaItem) => (
                <CarouselItem key={mediaItem.url}>
                  <figure
                    className="aspect-video relative cursor-pointer"
                    onClick={() => {
                      setDocumentationDialog({
                        isOpen: true,
                        documentationId: documentation.id,
                      });
                    }}
                  >
                    <Image
                      src={mediaItem.url}
                      alt="documentation"
                      className="object-cover"
                      fill
                    />
                  </figure>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        ))}
      </div>
    </>
  );
}
