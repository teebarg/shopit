import React, { ReactNode } from "react";

type SVGProps = {
    viewBox?: string;
    width?: string;
    height?: string;
    className?: string;
    children?: ReactNode;
};

export default function SVG({ width = "24", height = "24", viewBox = "0 0 24 24", className = "fill-current", children }: SVGProps) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox={viewBox} className={className}>
            {children}
        </svg>
    );
}
