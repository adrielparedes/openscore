/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ["countryflagsapi.com"],
  },
};

module.exports = nextConfig;
