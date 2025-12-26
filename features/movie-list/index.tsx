"use client";

import { useEffect, useEffectEvent, useRef } from "react";
import useGetMovies from "./repo/use-get-movies";
import Link from "next/link";
import { toKebabCase } from "@/utils/to-kebab-case";
import { toast } from "sonner";
import { DEFAULT_KEYWORD } from "@/constants";
import Image from "next/image";

export default function MovieListView() {
  const pageNumber = useRef(1);

  // data
  const { getMovies, data, loading, error, errorMessage } = useGetMovies();

  const handleGetMovieById = useEffectEvent(() => {
    getMovies(DEFAULT_KEYWORD, pageNumber.current);
  });

  useEffect(() => {
    handleGetMovieById();
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

  console.log({ data, loading });

  return (
    <div className="container mx-auto p-4">
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
    </div>
  );
}
