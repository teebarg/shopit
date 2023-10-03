/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        appDir: true,
    },
    images: {
        domains: ["tailwindui.com", "images.unsplash.com", "lh3.googleusercontent.com"],
        dangerouslyAllowSVG: true,
    },
    output: "standalone",
};

module.exports = nextConfig;
