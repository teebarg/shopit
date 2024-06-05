import React, { Suspense } from "react";
import Navbar from "@/components/home/navbar";
import Latest from "@/components/marketplace/Latest";
import Trending from "@/components/marketplace/Trending";
import LatestLoading from "@/components/marketplace/LatestLoading";
import Footer from "@/components/Footer";

export default async function Marketplace() {
    return (
        <div className="flex flex-col min-h-full">
            <Navbar />
            <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6 lg:max-w-7xl lg:px-8 w-full bg-content1 mt-2">
                <h2 className="text-2xl font-bold tracking-tight">Customers also purchased</h2>
                <Suspense fallback={<LatestLoading />}>
                    <Latest />
                </Suspense>
            </div>
            <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6 lg:max-w-7xl lg:px-8 w-full bg-content1 mt-4 min-h-12">
                <h2 className="text-2xl font-bold tracking-tight">Trending</h2>
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
