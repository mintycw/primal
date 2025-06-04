import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com",
				pathname: "**",
			},
			{
				protocol: "https",
				hostname: "cdn.discordapp.com",
				pathname: "**",
			},
		],
	},
	experimental: {
		serverActions: {
			bodySizeLimit: "1000MB",
		},
	},
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
