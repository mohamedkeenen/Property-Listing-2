import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'https://property-listing.keenenter.com/api'}/:path*`, 
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: "frame-ancestors 'self' https://*.bitrix24.com https://*.bitrix24.ru https://*.bitrix24.eu https://*.bitrix24.de https://*.bitrix24.co.uk https://*.bitrix24.pl https://*.bitrix24.fr https://*.bitrix24.it https://*.bitrix24.ae https://*.bitrix24.com.tr https://*.bitrix24.in https://*.bitrix24.co https://*.bitrix24.mx https://*.bitrix24.es https://*.bitrix24.com.br https://*.bitrix24.cn https://*.bitrix24.vn https://*.bitrix24.jp https://*.bitrix24.id" },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'X-Requested-With, Content-Type, Authorization, X-Bitrix-24' },
          { key: 'X-Frame-Options', value: 'ALLOWALL' }, // Note: ALLOWALL is not a standard value but often used to bypass SAMEORIGIN in some environments, though CSP is preferred.
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'property-listing.keenenter.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      }
    ]
  }
};

export default nextConfig;
