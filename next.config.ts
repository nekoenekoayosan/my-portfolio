import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Notion のファイルストレージと外部画像を許可
    remotePatterns: [
      { protocol: "https", hostname: "**.amazonaws.com" },
      { protocol: "https", hostname: "**.notion.so" },
      { protocol: "https", hostname: "notion.so" },
    ],
  },
};

export default nextConfig;
