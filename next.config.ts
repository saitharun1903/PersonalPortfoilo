import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: { serverActions: { bodySizeLimit: '4mb' } },
  // Include the download in the deployed server function, not just the public CDN.
  outputFileTracingIncludes: {
    '/resume': ['./public/resume.pdf'],
  },
  // Certificate files and site images rarely change, so browsers and the CDN keep them for a day and
  // refresh them quietly in the background for a week after, instead of re-checking on every visit.
  async headers() {
    const cached = [{ key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' }];
    return [
      { source: '/certificates/:file*', headers: cached },
      { source: '/images/:file*', headers: cached },
    ];
  },
};

export default nextConfig;
