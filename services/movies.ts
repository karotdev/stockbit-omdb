import axiosInstance from "@/configs/axios-interceptor.config";

export const fetchMovies = async (keyword: string, page: number) => {
  const { data } = await axiosInstance.get("/", {
    params: { s: keyword, page },
  });
  return data;
};

export const fetchMovieById = async (id: string) => {
  const { data } = await axiosInstance.get("/", {
    params: { i: id },
  });
  return data;
};
