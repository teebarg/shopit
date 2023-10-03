import React, { Suspense } from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getGreetingMessage } from "@/lib/utils";
import Loading from "@/components/loading";
import Navbar from "@/components/navbar";
import HomeComponent from "./HomeComponent";

export default async function Home() {
    // @ts-expect-error
    const session = await getServerSession(authOptions);
    const user: string = session?.user?.name || "";

    return (
        <main className="flex min-h-screen flex-col px-4">
            <div className="-mx-4">
                <Navbar />
            </div>
            <h2 className="text-2xl font-semibold">{getGreetingMessage(user)}</h2>
            <div className="">
                <div className="xl:pr-80">
                    <Suspense fallback={<Loading />}>
                        <HomeComponent />
                    </Suspense>
                </div>

                <aside className="fixed inset-y-0 right-0 hidden w-80 overflow-y-auto top-16 border-l border-gray-200 px-4 py-6 xl:flex xl:flex-col items-center ">
                    <p>Aside content</p>
                </aside>
            </div>
        </main>
    );
}
