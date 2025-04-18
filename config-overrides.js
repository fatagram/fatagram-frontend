const path = require('path');

module.exports = function override(config, env) {
  config.resolve.alias = {
    ...config.resolve.alias,
    '@': path.resolve(__dirname, 'src'),  // Alias '@' trỏ đến thư mục 'src'
  };
  return config;
};
