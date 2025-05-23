const { getDefaultConfig } = require("expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.extraNodeModules = {
  events: require.resolve("events"),
  https: require.resolve("https-browserify"),
  stream: require.resolve("stream-browserify"),
  http: require.resolve("stream-http"),
  net: require.resolve("net-browserify"),
  crypto: require.resolve("crypto-browserify"),
  tls: require.resolve("./emptyModule.js"),
  url: require.resolve("react-native-url-polyfill"),
  util: require.resolve("util"),
  zlib: require.resolve("./emptyModule.js"),
  timers: require.resolve("timers-browserify"),
  // add other Node core modules here if needed
};

module.exports = defaultConfig;
