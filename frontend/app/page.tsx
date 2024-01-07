import React from "react";
import HomeComponent from "@/components/home/HomeComponent";
import HomeNav from "@/components/home/Nav";
import Footer from "@/components/Footer";

export default async function Home() {
    return (
        <main className="bg-white">
            <HomeNav />
            <HomeComponent />
            <Footer />
        </main>
    );
}
