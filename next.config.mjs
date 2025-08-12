/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/upload/**/*",
      },
      {
        protocol: "http",
        hostname: "strapi2-dev.dev.i2hk.net",
        pathname: "/**",
      },
    ],
  },

  // 重定向設置
  async redirects() {
    return [
      // 重定向 contactus 到 contact-us
      {
        source: '/:locale/contactus',
        destination: '/:locale/contact-us',
        permanent: true,
      },
      {
        source: '/contactus',
        destination: '/en/contact-us',
        permanent: true,
      },
    ];
  },

};

export default nextConfig;
