/** @type {import('next').NextConfig} */
const nextConfig = {
    // The certificate route reads its fonts and artwork from disk at request
    // time; tracing cannot see that, so ship them with the function.
    outputFileTracingIncludes: {
        "/api/certificate": [
            "./src/fonts/certificate/**",
            "./public/certificate/**",
            "./public/logo-brackets.svg",
            "./public/ticket/howrah_bridge.svg",
        ],
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
            }
        ]
    },
};

export default nextConfig;
