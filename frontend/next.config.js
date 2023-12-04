/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        appDir: true,
        serverActions: true,
    },
    images: {
        domains: ["lh3.googleusercontent.com", "firebasestorage.googleapis.com"],
        dangerouslyAllowSVG: true,
    },
    output: "standalone",
};

module.exports = nextConfig;
