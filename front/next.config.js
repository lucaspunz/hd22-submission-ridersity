const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Content-Security-Policy",
    value: `${process.env.policy}`,
  },
  {
    key: "Access-Control-Allow-Origin",
    value: `${process.env.accesscontrol}`,
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "geolocation=(), microphone=()",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
];
module.exports = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};
