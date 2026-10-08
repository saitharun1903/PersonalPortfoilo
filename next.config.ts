import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Include the download in the deployed server function, not just the public CDN.
  outputFileTracingIncludes: {
    '/resume': ['./public/resume.pdf'],
  },
};

export default nextConfig;
