"use client";

import React, { ReactNode } from "react";
import cn from "classnames";
import Link from "next/link";

type Types = "link" | "button" | "submit" | "reset";
type Mode = "primary" | "secondary" | "danger" | "success" | "neutral" | "white";

type BtnProps = {
    type?: Types;
    mode?: Mode;
    isLoading?: boolean;
    href?: string;
    css?: string;
    children?: ReactNode;
    click?: () => void;
};

export default function Button({ type = "button", mode = "primary", href = "/", css, children, isLoading, click }: BtnProps) {
    const color = () => {
        switch (mode) {
            case "primary":
                return "btn-primary";
            case "secondary":
                return "btn-secondary";
            case "danger":
                return "btn-error";
            case "success":
                return "btn-success";
            case "neutral":
                return "btn-neutral";
            case "white":
                return "";
            default:
                return "";
        }
    };

    if (type === "link") {
        return (
            <Link
                href={href}
                className={cn(
                    "rounded-md px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
                    color()
                )}
            >
                {children}
            </Link>
        );
    }

    return (
        <button type={type} onClick={() => (click ? click() : null)} className={cn("btn normal-case text-base btn-sm", color(), css)}>
            {isLoading ? <span className="loading loading-spinner"></span> : children}
        </button>
    );
}
