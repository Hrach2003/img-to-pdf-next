/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  basePath:
    process.env.NODE_ENV === "production"
      ? "https://aua-helper.vercel.app"
      : "http://localhost:3000",
};
