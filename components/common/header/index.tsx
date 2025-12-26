"use client";

import Link from "next/link";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../../ui/input-group";
import { SearchIcon, XIcon } from "lucide-react";
import { Activity, useEffect, useEffectEvent, useRef, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import useGetMoviesSuggestion from "./repo/use-get-movie-suggestion";
import { MIN_KEYWORD_LENGTH } from "@/constants";
import { useRouter, useSearchParams } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isShowSuggestions, setIsShowSuggestions] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // data
  const [keyword, setKeyword] = useState(searchParams.get("s") ?? "");
  const pageNumber = useRef(1);

  const { getMovieSuggestion, data, loading, error, errorMessage } =
    useGetMoviesSuggestion();

  useDebounce(
    keyword,
    () => {
      if (keyword.length <= MIN_KEYWORD_LENGTH) {
        setIsShowSuggestions(false);
        return;
      }
      getMovieSuggestion(keyword, pageNumber.current);
      setIsShowSuggestions(true);
    },
    500
  );

  // outside click
  const handleClickOutside = useEffectEvent((event: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node)
    ) {
      setIsShowSuggestions(false);
    }
  });

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    router.push(`/search?s=${keyword}`);
    inputRef.current?.blur();
    setIsShowSuggestions(false);
  };

  const handleReset = () => {
    setKeyword("");
    setIsShowSuggestions(false);
  };

  const isShowDropdown =
    keyword.length > MIN_KEYWORD_LENGTH && isShowSuggestions;

  return (
    <div className="sticky top-0 left-0 w-full grid grid-cols-1 md:grid-cols-[200px_1fr_200px] gap-2 md:gap-10 p-4 md:px-8 pt-6 bg-white/10 saturate-200 backdrop-blur-3xl z-50">
      <Link href="/" onClick={handleReset} className="text-2xl font-semibold">
        StockBuster
      </Link>
      <div ref={containerRef} className="relative">
        <InputGroup className="rounded-xl shadow-none bg-white">
          <InputGroupInput
            ref={inputRef}
            placeholder="Search..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            onFocus={() =>
              keyword.length > MIN_KEYWORD_LENGTH && setIsShowSuggestions(true)
            }
          />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <Activity mode={keyword ? "visible" : "hidden"}>
            <InputGroupAddon align="inline-end">
              <XIcon className="cursor-pointer" onClick={handleReset} />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">
              <button
                type="button"
                className="px-2 cursor-pointer"
                onClick={handleSearch}
              >
                Search
              </button>
            </InputGroupAddon>
          </Activity>
        </InputGroup>
        <Activity mode={isShowDropdown ? "visible" : "hidden"}>
          <div className="absolute top-full left-0 w-full rounded-2xl bg-white shadow-xl p-4 mt-2 ring-1 ring-gray-50">
            <Activity mode={loading ? "visible" : "hidden"}>
              <ul>
                <li className="py-2">
                  <div className="rounded-2xl bg-gray-100 h-4 animate-pulse w-1/3" />
                </li>
                <li className="py-2">
                  <div className="rounded-2xl bg-gray-100 h-4 animate-pulse w-2/5" />
                </li>
                <li className="py-2">
                  <div className="rounded-2xl bg-gray-100 h-4 animate-pulse w-1/4" />
                </li>
              </ul>
            </Activity>
            <Activity mode={!loading && error ? "visible" : "hidden"}>
              <p className="py-2">{errorMessage}</p>
            </Activity>
            <Activity mode={!loading && !error ? "visible" : "hidden"}>
              <ul>
                {data.map((item) => (
                  <li key={item.key} className="py-2">
                    <Link href={item.url} onClick={handleReset}>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </Activity>
          </div>
        </Activity>
      </div>
      <div className="hidden md:block" />
    </div>
  );
}
