import type { MovieItem, OMDbSearchResponse } from "@/schemas/movies.schema";
import { OMDbSearchSchema } from "@/schemas/movies.schema";
import { fetchMovies } from "@/services/movies";
import { useMemo, useState } from "react";

const useGetMovies = () => {
  const [data, setData] = useState<MovieItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const getMovies = async (keyword: string, page: number) => {
    if (loading) return;

    setLoading(true);
    setError(false);
    setErrorMessage("");

    try {
      const response = await fetchMovies(keyword, page);
      const safeData = OMDbSearchSchema.safeParse(response);

      if (!safeData.success) {
        setError(true);
        setErrorMessage("Invalid response from server");
        setData([]);
        return;
      }

      if (safeData.data.Response === "False") {
        setError(true);
        setErrorMessage(safeData.data.Error);
        setData([]);
        return;
      }

      setData((prev) =>
        page === 1
          ? (safeData.data as OMDbSearchResponse).Search
          : [...prev, ...(safeData.data as OMDbSearchResponse).Search]
      );
    } catch (err) {
      console.error(err);
      setError(true);
      setErrorMessage("Network error. Please try again.");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const posters = useMemo(() => data.map((movie) => movie.Poster), [data]);

  return {
    getMovies,
    data: { movies: data, posters },
    loading,
    error,
    errorMessage,
  };
};

export default useGetMovies;
