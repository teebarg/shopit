import React from "react";
import HomeComponent from "@/components/home/HomeComponent";
import Footer from "@/components/Footer";
import Navbar from "@/components/home/navbar";

export default async function Home() {
    return (
        <main>
            <Navbar />
            <HomeComponent />
            <Footer />
        </main>
    );
}
