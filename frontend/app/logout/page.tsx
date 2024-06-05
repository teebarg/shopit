"use client";

import React, { useEffect } from "react";
import { signOut } from "next-auth/react";

export default function Logout() {
    useEffect(() => {
        signOut({
            redirect: true,
            callbackUrl: "/login",
        });
    }, []);
    return <div className="flex flex-col items-center justify-center h-screen"></div>;
}
