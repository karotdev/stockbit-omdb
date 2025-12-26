"use client";

import { Activity, useEffect, useEffectEvent, useRef } from "react";
import useGetMovies from "./repo/use-get-movies";
import Link from "next/link";
import { toKebabCase } from "@/utils/to-kebab-case";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoaderCircleIcon } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

export default function SearchResultView() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // data
  const keyword = searchParams.get("s") ?? "";
  const pageNumber = useRef(1);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const { getMovies, data, loading, error, errorMessage } = useGetMovies();

  const handleGetMovies = useEffectEvent(() => {
    getMovies(keyword, pageNumber.current);
  });

  useEffect(() => {
    handleGetMovies();
  }, []);

  const handleLoadMore = () => {
    pageNumber.current++;
    getMovies(keyword, pageNumber.current);
  };

  useIntersectionObserver({
    target: loadMoreRef,
    onIntersect: () => handleLoadMore(),
  });

  // error
  const handleToast = useEffectEvent(() => {
    if (error) {
      toast(errorMessage);
    }
  });

  useEffect(() => {
    handleToast();
  }, [error]);

  // lightbox
  const lightboxImage = searchParams.get("lightbox-image") ?? "";
  const toggle = Boolean(lightboxImage);

  const handleOpenLightbox = (value: string) => {
    router.push(`?lightbox-image=${encodeURI(value)}`);
  };

  const handleToggleLightbox = (open: boolean) => {
    if (!open) {
      router.back();
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <p>
          Search result for:&nbsp;
          <span className="font-semibold capitalize underline underline-offset-4">
            {keyword}
          </span>
        </p>
        <div className="flex flex-col gap-6">
          <ul className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {data.movies.map((item, index) => (
              <li
                key={`${item.imdbID}-${index}`}
                className="flex flex-col gap-2"
              >
                <Image
                  src={item.Poster}
                  alt={item.Title}
                  width={300}
                  height={445}
                  unoptimized
                  className="aspect-2/3 overflow-hidden w-full h-full object-cover cursor-pointer"
                  onClick={() => handleOpenLightbox(item.Poster)}
                />
                <Link
                  href={`/${toKebabCase(item.Title)}-${item.imdbID}`}
                  className="font-semibold truncate"
                >
                  {item.Title}
                </Link>
              </li>
            ))}
          </ul>
          <Activity mode={!loading && data.hasNextPage ? "visible" : "hidden"}>
            <div ref={loadMoreRef} className="flex items-center justify-center">
              <LoaderCircleIcon className="size-6 animate-spin" />
            </div>
          </Activity>
        </div>
      </div>
      <Dialog open={toggle} onOpenChange={(open) => handleToggleLightbox(open)}>
        <DialogContent className="rounded-2xl">
          <DialogHeader className="sr-only">
            <DialogTitle>{lightboxImage}</DialogTitle>
            <DialogDescription>{lightboxImage}</DialogDescription>
          </DialogHeader>
          {lightboxImage && (
            <div className="rounded-2xl bg-gray-200 overflow-hidden">
              <Image
                src={lightboxImage}
                alt={lightboxImage}
                width={2000}
                height={3000}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
