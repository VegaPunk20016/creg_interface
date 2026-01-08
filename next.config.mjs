/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/inegi/:path*',
        destination: 'https://gaia.inegi.org.mx/wscatgeo/v2/:path*', 
      },
    ];
  },
};

export default nextConfig;