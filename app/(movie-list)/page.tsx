import MovieListView from "@/features/movie-list";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Movie List",
  description: "Movie List",
};

export default function MovieListPage() {
  return <MovieListView />;
}
