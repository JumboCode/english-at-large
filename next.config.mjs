/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ["covers.openlibrary.org"],
        // remotePatterns: [
        //   {
        //     protocol: 'https',
        //     hostname: "covers.openlibrary.org",
        //     port: '3000',
        //     // pathname: '/account123/**',
        //   },
        // ],
      },
};

export default nextConfig;
