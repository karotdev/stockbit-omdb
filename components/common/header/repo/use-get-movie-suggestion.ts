import type { MovieItem, OMDbSearchResponse } from "@/schemas/movies.schema";
import { OMDbSearchSchema } from "@/schemas/movies.schema";
import { fetchMovies } from "@/services/movies";
import { toKebabCase } from "@/utils/to-kebab-case";
import { useState } from "react";

interface NormalizedMovieSuggestion {
  key: string;
  name: string;
  url: string;
}

const normalizer = (data: MovieItem[]): NormalizedMovieSuggestion[] => {
  const normalized = data.map<NormalizedMovieSuggestion>((item, index) => ({
    key: `${item.imdbID}-${index}`,
    name: item.Title,
    url: `${toKebabCase(item.Title)}-${item.imdbID}`,
  }));

  return normalized;
};

const useGetMoviesSuggestion = () => {
  const [data, setData] = useState<NormalizedMovieSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const getMovieSuggestion = async (keyword: string, page: number) => {
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
        // graceful handling
        setData(normalizer((response as OMDbSearchResponse).Search));
        console.warn(safeData.error);
        // setData([]);
        return;
      }

      if (safeData.data.Response === "False") {
        setError(true);
        setErrorMessage(safeData.data.Error);
        setData([]);
        return;
      }

      setData(normalizer((safeData.data as OMDbSearchResponse).Search));
    } catch (err) {
      console.error(err);
      setError(true);
      setErrorMessage("Network error. Please try again.");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  return { getMovieSuggestion, data, loading, error, errorMessage };
};

export default useGetMoviesSuggestion;
