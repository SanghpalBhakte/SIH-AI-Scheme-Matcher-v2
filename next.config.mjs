/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // The service worker script itself must never be long-cached —
        // browsers already re-check it on every navigation, but an
        // aggressive CDN/browser cache header here would delay picking
        // up a new sw.js (e.g. after CACHE_VERSION changes) far longer
        // than intended.
        source: '/sw.js',
        headers: [{ key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' }],
      },
    ]
  },
}

export default nextConfig
