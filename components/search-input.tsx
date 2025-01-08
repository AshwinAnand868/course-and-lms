"use client";

import { useDebounce } from "@/hooks/use-debounce";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";

const SearchInput = () => {

  const [value, setValue] = useState<string>("");
  const debouncedValue = useDebounce(value);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentCategoryId = searchParams.get("categoryId");

  useEffect(() => {
    const url = qs.stringifyUrl({
      url: pathname,
      query: {
        categoryId: currentCategoryId,
        title: debouncedValue
      }
    }, {
      skipEmptyString: true,
      skipNull: true
    })

    router.push(url);
  }, [currentCategoryId, debouncedValue, pathname, router]);

  return (
    <div className="relative flex items-center">
      <div className="bg-sky-700 absolute rounded-l-full p-2 flex items-center justify-center h-full">
        <Search className="h-4 w-4 text-white" />
      </div>

      <Input
        onChange={(e) => setValue(e.target.value)}
        value={value}
        className="w-full md:w-[300px] pl-9 bg-slate-100 rounded-full
            focus-visible:ring-slate-200"
        placeholder="Search for a course"
      />
    </div>
  );
};

export default SearchInput;
