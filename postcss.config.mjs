/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    // Note: autoprefixer removed as it's included in Next.js by default
  },
};

export default config;
