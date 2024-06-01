"use client";

import React from "react";
import { useSession } from "next-auth/react";
import NextLink from "next/link";
import UserDropDown from "@/components/user-menu";
import { ThemeSwitch } from "@/components/theme-switch";

export default function Navbar() {
    const { data: session } = useSession();

    return (
        <div className="flex items-center justify-between px-12 py-2 border-b-1">
            <div className="">
                <NextLink href={"/"} className="text-xl font-semibold">
                    Nextjs Fastapi
                </NextLink>
            </div>
            <div className="flex gap-6">
                <ThemeSwitch />
                {session ? (
                    <UserDropDown />
                ) : (
                    <NextLink href="/login" className="text-sm font-semibold leading-6">
                        Log In <span aria-hidden="true">&rarr;</span>
                    </NextLink>
                )}
            </div>
        </div>
    );
}
