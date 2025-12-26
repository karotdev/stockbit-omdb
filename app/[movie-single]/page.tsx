import MovieSingleView from "@/features/movie-single";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Movie Detail",
  description: "Movie Detail",
};

export default function MovieListPage() {
  return <MovieSingleView />;
}
