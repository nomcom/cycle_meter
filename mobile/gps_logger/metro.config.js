// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

module.exports = getDefaultConfig(__dirname);
// defaultConfig.resolver.assetExts.push('cjs');

// module.exports = defaultConfig;