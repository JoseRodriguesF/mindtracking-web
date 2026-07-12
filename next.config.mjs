const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;
