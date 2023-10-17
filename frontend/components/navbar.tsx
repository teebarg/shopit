"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
    const { data: session } = useSession();

    return (
        <div className="navbar bg-neutral text-neutral-content px-8">
            <div className="flex-1">
                <Link href={"/"} className="btn btn-ghost normal-case text-xl">
                    Nextjs Fastapi
                </Link>
            </div>
            <div className="flex-none">
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} className="flex items-center space-x-1 cursor-pointer">
                        <label className="btn btn-ghost btn-circle avatar">
                            <div className="relative h-10 w-10 rounded-full">
                                <Image fill src={session?.user?.image || "/avatar.png"} alt="avatar" />
                            </div>
                        </label>
                        <div>
                            <p>{session?.user?.name}</p>
                            <p className="text-xs">{session?.user?.email}</p>
                        </div>
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-neutral rounded-box w-52">
                        <li>
                            <Link href={"/profile"} className="justify-between">
                                Profile
                                <span className="badge">New</span>
                            </Link>
                        </li>
                        <li>
                            <a>Settings</a>
                        </li>
                        <li>
                            <a onClick={() => signOut()}>Logout</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
