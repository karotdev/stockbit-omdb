"use client";

import { useEffect, useEffectEvent } from "react";
import useGetMovieById from "./repo/use-get-movie-by-id";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function MovieSingleView() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  // data
  const { getMovieById, data, loading, error, errorMessage } =
    useGetMovieById();

  const handleGetMovieById = useEffectEvent(() => {
    const segments = pathname.split("-");
    const id = segments[segments.length - 1];

    getMovieById(id);
  });

  useEffect(() => {
    handleGetMovieById();
  }, []);

  // error
  const handleToast = useEffectEvent(() => {
    if (error) {
      toast.error(errorMessage);
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

  if (loading || !data) return;

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="shrink-0 flex flex-col gap-2">
          <h1 className="text-4xl font-bold">{data.Title}</h1>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="capitalize">
              {data.Type}
            </Badge>
            <Badge variant="secondary">{data.Year}</Badge>
            <Badge variant="secondary">{data.Rated}</Badge>
            <Badge variant="secondary">{data.Runtime}</Badge>
          </div>
        </div>
        {data.Ratings && (
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {data.Ratings.map((rating, i) => (
              <li
                key={i}
                className="p-2 flex flex-col items-center justify-center gap-1 text-center"
              >
                <span className="text-xl font-bold">{rating.Value}</span>
                <span className="text-xs truncate">{rating.Source}</span>
              </li>
            ))}
            {data.BoxOffice && (
              <li className="p-2 flex flex-col items-center justify-center gap-1 text-center">
                <span className="text-xl font-bold">{data.BoxOffice}</span>
                <span className="text-xs truncate">Earnings</span>
              </li>
            )}
          </ul>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-4">
          <div className="md:row-span-2 rounded-2xl bg-gray-200 overflow-hidden">
            <Image
              src={data.Poster}
              alt={data.Title}
              width={300}
              height={445}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => handleOpenLightbox(data.Poster)}
            />
          </div>
          <div className="md:col-span-2 md:row-span-2 rounded-2xl bg-gray-200 overflow-hidden"></div>
          <div className="rounded-2xl bg-gray-200 overflow-hidden"></div>
          <div className="rounded-2xl bg-gray-200 overflow-hidden"></div>
        </div>
        <div className="flex items-center gap-2">
          {data.Genre.split(", ").map((genre) => (
            <Badge key={genre} variant="outline">
              {genre}
            </Badge>
          ))}
        </div>
        <p className="font-semibold">{data.Plot}</p>
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
          <div className="md:order-last">
            <div className="sticky top-24 right-0 flex flex-col gap-4">
              <div className="rounded-2xl bg-gray-100 p-2 flex items-center gap-4">
                <div className="shrink-0 rounded-xl min-w-20 p-2 bg-green-600 text-white flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-bold">{data.Metascore}</span>
                  <span className="text-xs font-semibold">Metascore</span>
                </div>
                <span className="font-semibold">
                  <span>Awards</span> {data.Awards}
                </span>
              </div>
              <div className="rounded-2xl bg-gray-100 p-2 flex items-center gap-4">
                <div className="shrink-0 rounded-xl min-w-20 p-2 bg-green-600 text-white flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-bold">{data.imdbRating}</span>
                  <span className="text-xs font-semibold">IMDB</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-semibold">
                    {data.imdbVotes} <span>Votes</span>
                  </span>
                  <span className="text-xs text-gray-500">#{data.imdbID}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <ul className="flex flex-col">
              <li className="border-b-2 py-2">
                <span className="font-semibold">Director: </span>
                {data.Director}
              </li>
              <li className="border-b-2 py-2">
                <span className="font-semibold">Writer: </span>
                {data.Writer}
              </li>
              <li className="border-b-2 py-2">
                <span className="font-semibold">Actors: </span>
                {data.Actors}
              </li>
              <li className="border-b-2 py-2">
                <span className="font-semibold">Released: </span>
                {data.Released}
              </li>
              <li className="border-b-2 py-2">
                <span className="font-semibold">Language: </span>
                {data.Language}
              </li>
              <li className="border-b-2 py-2">
                <span className="font-semibold">Country: </span>
                {data.Country}
              </li>
              {data.DVD && (
                <li className="border-b-2 py-2">
                  <span className="font-semibold">DVD: </span>
                  {data.DVD}
                </li>
              )}
              {data.Production && (
                <li className="border-b-2 py-2">
                  <span className="font-semibold">Production: </span>
                  {data.Production}
                </li>
              )}
              {data.Website && (
                <li className="border-b-2 py-2">
                  <span className="font-semibold">Website: </span>
                  {data.Website}
                </li>
              )}
              {data.totalSeasons && (
                <li className="py-2">
                  <span className="font-semibold">Total Seasons: </span>
                  {data.totalSeasons}
                </li>
              )}
            </ul>
            <div className="h-[2000px] rounded-2xl bg-blue-50" />
          </div>
        </div>
      </div>
      <Dialog open={toggle} onOpenChange={(open) => handleToggleLightbox(open)}>
        <DialogContent className="rounded-2xl">
          <DialogHeader className="sr-only">
            <DialogTitle>{data.Title}</DialogTitle>
            <DialogDescription>{data.Title}</DialogDescription>
          </DialogHeader>
          {lightboxImage && (
            <div className="rounded-2xl bg-gray-200 overflow-hidden">
              <Image
                src={lightboxImage}
                alt={data.Title}
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
