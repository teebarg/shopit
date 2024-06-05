"use client";

import { useEffect } from "react";
import Navbar from "@/components/home/navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Button } from "@nextui-org/react";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
    useEffect(() => {
        // Log the error to an error reporting service
        /* eslint-disable no-console */
        console.error(error);
    }, [error]);
    return (
        <div className="bg-white h-screen flex flex-col">
            <Navbar />
            <div className="bg-gray-100 flex items-center justify-center flex-1">
                <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="px-6 py-8">
                        <h1 className="text-4xl font-bold mb-2 text-gray-800">500</h1>
                        <p className="text-xl text-gray-600 mb-6">Internal Server Error</p>
                        <p className="text-gray-700 mb-8">Oops! Something went wrong on our end. We apologize for the inconvenience.</p>
                        <Link href="/" className="inline-block bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded">
                            Go back to homepage
                        </Link>
                        <Button onClick={() => reset()} color="danger" className="block mt-6">
                            Try again
                        </Button>
                    </div>
                    <div className="px-6 py-4 bg-gray-100 border-t border-gray-200 text-sm text-gray-700">
                        If the problem persists, please contact our support team.
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
