"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Navbar() {
    const { data: session } = useSession();
    const router = useRouter();

    const signOutHandler = async (e) => {
        e.preventDefault();
        await signOut({ redirect: false, callbackUrl: "/" });
        router.push(process.env.NEXT_PUBLIC_DOMAIN + "/");
    };

    return (
        <div className="navbar bg-neutral text-neutral-content px-8">
            <div className="flex-1">
                <a className="btn btn-ghost normal-case text-xl">Nextjs Fastapi</a>
            </div>
            <div className="flex-none">
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} className="flex items-center space-x-1 cursor-pointer">
                        <label className="btn btn-ghost btn-circle avatar">
                            <div className="relative h-10 w-10 rounded-full">
                                <Image fill src="/avatar.png" alt="avatar" />
                            </div>
                        </label>
                        <div>
                            <p>{session?.user?.name}</p>
                            <p className="text-xs">{session?.user?.email}</p>
                        </div>
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-neutral rounded-box w-52">
                        <li>
                            <a className="justify-between">
                                Profile
                                <span className="badge">New</span>
                            </a>
                        </li>
                        <li>
                            <a>Settings</a>
                        </li>
                        <li>
                            <a onClick={signOutHandler}>Logout</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
