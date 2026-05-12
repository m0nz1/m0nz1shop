/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['your-project.supabase.co', 'images.unsplash.com'],
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;