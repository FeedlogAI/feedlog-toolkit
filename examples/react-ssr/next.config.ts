import type { NextConfig } from 'next';
import { withFeedlogSSR } from '@feedlog-ai/react/next';

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
};

export default withFeedlogSSR(nextConfig);
