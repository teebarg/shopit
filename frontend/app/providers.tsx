"use client";

import React from "react";
import { NextUIProvider } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    return (
        <NextUIProvider navigate={router.push}>
            <ThemeProvider attribute="class">{children}</ThemeProvider>
        </NextUIProvider>
    );
}
