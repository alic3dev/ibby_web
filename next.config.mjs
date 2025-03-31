/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: function next_config_webpack_config(config) {
    config.module.rules.push({
      test: /.node$/,
      loader: 'node-loader'
    });
    
    return config
  }
};

export default nextConfig;
