import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	images: {
		domains: ['avatars.githubusercontent.com'],
	},
	output: 'export',
};

export default nextConfig;
