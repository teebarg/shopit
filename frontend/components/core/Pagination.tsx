"use client";

import { useCallback } from "react";
import { Pagination as Pag } from "@/lib/types";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function Pagination({ details }: { details: Pag }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const { page, per_page, total_count } = details;
    const page_count = page * per_page;

    // Get a new searchParams string by merging the current
    // searchParams with a provided key/value pair
    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams?.toString());
            params.set(name, value);

            return params.toString();
        },
        [searchParams]
    );

    // Go to next page
    const nextPage = () => {
        router.push(pathname + "?" + createQueryString("page", `${page + 1}`));
    };
    // Go to previous page
    const prevPage = () => {
        router.push(pathname + "?" + createQueryString("page", `${page - 1}`));
    };

    if (!page || per_page > total_count) {
        return <></>;
    }
    return (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="join grid grid-cols-2 sm:hidden">
                <button onClick={prevPage} className="join-item btn btn-outline" disabled={page < 2}>
                    Previous
                </button>
                <button onClick={nextPage} className="join-item btn btn-outline" disabled={page_count >= total_count}>
                    Next
                </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{page * per_page - (per_page - 1)}</span> to{" "}
                        <span className="font-medium">{page_count < total_count ? page_count : total_count}</span> of{" "}
                        <span className="font-medium">{total_count}</span> results
                    </p>
                </div>
                <div>
                    <div className="join">
                        <button onClick={prevPage} className="join-item btn" disabled={page < 2}>
                            «
                        </button>
                        <button className="join-item btn">Page {page}</button>
                        <button onClick={nextPage} className="join-item btn" disabled={page_count >= total_count}>
                            »
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
