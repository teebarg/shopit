import React, { Suspense } from "react";
import HomeNav from "@/components/home/Nav";
import Latest from "@/components/marketplace/Latest";
import Trending from "@/components/marketplace/Trending";
import LatestLoading from "@/components/marketplace/LatestLoading";

export default async function Marketplace() {
    return (
        <div className="bg-white">
            <HomeNav />
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">Customers also purchased</h2>
                <Suspense fallback={<LatestLoading />}>
                    <Latest />
                </Suspense>
            </div>
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">Trending</h2>
                <Suspense fallback={<LatestLoading />}>
                    <Trending />
                </Suspense>
            </div>
        </div>
    );
}
