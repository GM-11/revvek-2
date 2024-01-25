/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          hostname: "ipfs.io",
        },
      ],
    },
  };
  
  export default nextConfig;
  