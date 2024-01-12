"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import Link from "next/link";

export function DocumentationList({ documentations }) {
  return (
    <div className="mt-4 grid grid-cols-2 gap-4">
      {documentations.map((documentation) => (
        <Carousel className="w-full" key={documentation.id}>
          <CarouselContent>
            {documentation.media.map((mediaItem) => (
              <CarouselItem key={mediaItem.url}>
                <Link href={`/documentation/${documentation.id}`}>
                  <figure className="aspect-video relative">
                    <Image
                      src={mediaItem.url}
                      alt="documentation"
                      className="object-cover"
                      fill
                    />
                  </figure>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      ))}
    </div>
  );
}
