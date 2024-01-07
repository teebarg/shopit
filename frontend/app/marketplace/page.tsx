import React, { Suspense } from "react";
import HomeNav from "@/components/home/Nav";
import Latest from "@/components/marketplace/Latest";
import Trending from "@/components/marketplace/Trending";
import LatestLoading from "@/components/marketplace/LatestLoading";
import Footer from "@/components/Footer";

export default async function Marketplace() {
    return (
        <div className="bg-white flex flex-col min-h-full">
            <HomeNav />
            <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6 lg:max-w-7xl lg:px-8 w-full">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">Customers also purchased</h2>
                <Suspense fallback={<LatestLoading />}>
                    <Latest />
                </Suspense>
            </div>
            <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6 lg:max-w-7xl lg:px-8 w-full">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">Trending</h2>
                <Suspense fallback={<LatestLoading />}>
                    <Trending />
                </Suspense>
            </div>
            <div className="mt-auto">
                <Footer />
            </div>
        </div>
    );
}
