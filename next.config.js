/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
}

module.exports = nextConfig


// module.exports = {
//     async rewrites() {
//         return [
//           {
//             source: '*',
//             destination: '*',
//           },
//         ]
//       },
//   };