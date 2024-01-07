import React from "react";
import Navbar from "@/components/navbar";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="flex min-h-screen flex-col px-4">
            <div className="-mx-4">
                <Navbar />
            </div>
            <div className="flex-1">
                <div className="mx-auto max-w-6xl">{children}</div>
            </div>
        </main>
    );
}
