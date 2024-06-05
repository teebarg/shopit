/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["lh3.googleusercontent.com", "firebasestorage.googleapis.com"],
        dangerouslyAllowSVG: true,
    },
    output: "standalone",
};

module.exports = nextConfig;
