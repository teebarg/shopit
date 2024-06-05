import React from "react";
import Navbar from "@/components/home/navbar";
import Head from "next/head";

export default async function SandBox() {
    return (
        <React.Fragment>
            <Head>
                <title>Sandbox - Explore and Play</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex flex-col">
                <Navbar />

                <main className="container mx-auto px-4 py-8 flex-1">
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Code Editor</h2>
                            <textarea
                                className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Write your code here..."
                            ></textarea>
                        </div>
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Preview</h2>
                            <iframe className="w-full h-64 border border-gray-300 rounded-lg" src="about:blank" title="Preview"></iframe>
                        </div>
                    </section>

                    <section className="mt-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Resources</h2>
                        <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <li className="bg-white rounded-lg shadow-lg p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Documentation</h3>
                                <p className="text-gray-700">Explore the documentation to learn more about the sandbox and its features.</p>
                            </li>
                            <li className="bg-white rounded-lg shadow-lg p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Examples</h3>
                                <p className="text-gray-700">Check out code examples and snippets to get started quickly.</p>
                            </li>
                            <li className="bg-white rounded-lg shadow-lg p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Community</h3>
                                <p className="text-gray-700">Join the community to collaborate, share ideas, and get support.</p>
                            </li>
                        </ul>
                    </section>
                </main>

                <footer className="shadow mt-8 bg-content2">
                    <div className="container mx-auto px-4 py-6 text-center">
                        <p>&copy; {new Date().getFullYear()} Sandbox. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        </React.Fragment>
    );
}
