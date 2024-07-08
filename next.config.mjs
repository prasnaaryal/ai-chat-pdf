/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["github.com", "images.clerk.dev", "your-image-domain.com"], // Add any additional domains you are using for images
  },
};

export default nextConfig;
