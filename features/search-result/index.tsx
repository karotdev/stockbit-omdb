"use client";

import { Activity, useEffect, useEffectEvent, useRef } from "react";
import useGetMovies from "./repo/use-get-movies";
import Link from "next/link";
import { toKebabCase } from "@/utils/to-kebab-case";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

export default function SearchResultView() {
  const searchParams = useSearchParams();

  // data
  const keyword = searchParams.get("s") ?? "";
  const pageNumber = useRef(1);

  const { getMovies, data, loading, error, errorMessage } = useGetMovies();

  const handleGetMovies = useEffectEvent(() => {
    getMovies(keyword, pageNumber.current);
  });

  useEffect(() => {
    handleGetMovies();
  }, []);

  // error
  const handleToast = useEffectEvent(() => {
    if (error) {
      toast(errorMessage);
    }
  });

  useEffect(() => {
    handleToast();
  }, [error]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col gap-6">
        <p>
          Search result for:&nbsp;
          <span className="font-semibold capitalize underline underline-offset-4">
            {keyword}
          </span>
        </p>
        <Activity mode={loading ? "hidden" : "visible"}>
          <ul className="grid grid-cols-5 gap-4">
            {data.movies.map((item, index) => (
              <li key={`${item.imdbID}-${index}`}>
                <Link href={`/${toKebabCase(item.Title)}-${item.imdbID}`}>
                  <Image
                    src={item.Poster}
                    alt={item.Title}
                    width={300}
                    height={445}
                    className="aspect-2/3 overflow-hidden"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </Activity>
      </div>
    </div>
  );
}
