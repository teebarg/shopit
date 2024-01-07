import React from "react";
import Navbar from "@/components/navbar";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="flex min-h-screen flex-col px-4">
            <div className="-mx-4">
                <Navbar />
            </div>
            <div>
                <div className="xl:pr-80">{children}</div>
                <aside className="fixed inset-y-0 right-0 hidden w-80 overflow-y-auto top-16 border-l border-gray-200 px-4 py-6 xl:flex xl:flex-col items-center ">
                    <p>Aside content</p>
                </aside>
            </div>
        </main>
    );
}
