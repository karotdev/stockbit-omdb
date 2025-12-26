import type { MovieDetail } from "@/schemas/movies.schema";
import { OMDbDetailSchema } from "@/schemas/movies.schema";
import { fetchMovieById } from "@/services/movies";
import { useState } from "react";

const useGetMovieById = () => {
  const [data, setData] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const getMovieById = async (id: string) => {
    if (loading) return;

    setLoading(true);
    setError(false);
    setErrorMessage("");

    try {
      const response = await fetchMovieById(id);
      const safeData = OMDbDetailSchema.safeParse(response);

      if (!safeData.success) {
        setError(true);
        setErrorMessage("Invalid response from server");
        // graceful handling
        setData(response);
        console.warn(safeData.error);
        // setData(null);
        return;
      }

      if (safeData.data.Response === "False") {
        setError(true);
        setErrorMessage(safeData.data.Error);
        setData(null);
        return;
      }

      setData(safeData.data);
    } catch (err) {
      console.error(err);
      setError(true);
      setErrorMessage("Network error. Please try again.");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return { getMovieById, data, loading, error, errorMessage };
};

export default useGetMovieById;
