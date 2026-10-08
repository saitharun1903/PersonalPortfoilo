// The real domain is the safe default even when the hosting environment has no variables.
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://saitharunreddy.me').replace(/\/$/, '');
