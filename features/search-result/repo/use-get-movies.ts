import type { MovieItem, OMDbSearchResponse } from "@/schemas/movies.schema";
import { OMDbSearchSchema } from "@/schemas/movies.schema";
import { fetchMovies } from "@/services/movies";
import { useMemo, useState } from "react";

const useGetMovies = () => {
  const [data, setData] = useState<MovieItem[]>([]);
  const [totalResults, setTotalResults] = useState(0);
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
        if (page === 1) {
          setError(true);
          setErrorMessage("Invalid response from server");
          setData([]);
          setTotalResults(0);
        }
        return;
      }

      if (safeData.data.Response === "False") {
        if (page === 1) {
          setError(true);
          setErrorMessage(safeData.data.Error);
          setData([]);
          setTotalResults(0);
        }
        return;
      }

      const searchResponse = safeData.data as OMDbSearchResponse;
      setTotalResults(Number(searchResponse.totalResults));

      setData((prev) =>
        page === 1 ? searchResponse.Search : [...prev, ...searchResponse.Search]
      );
    } catch (err) {
      console.error(err);
      if (page === 1) {
        setError(true);
        setErrorMessage("Network error. Please try again.");
        setData([]);
        setTotalResults(0);
      }
    } finally {
      setLoading(false);
    }
  };

  const posters = useMemo(() => data.map((movie) => movie.Poster), [data]);
  const hasNextPage = useMemo(
    () => data.length < totalResults,
    [data.length, totalResults]
  );

  return {
    getMovies,
    data: { movies: data, posters, hasNextPage },
    loading,
    error,
    errorMessage,
  };
};

export default useGetMovies;
