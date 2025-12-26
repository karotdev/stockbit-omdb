import SearchResultView from "@/features/search-result";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Movie",
  description: "Search Movie",
};

export default function SearchResultPage() {
  return <SearchResultView />;
}
