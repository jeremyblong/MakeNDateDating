const path = require("path");

module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      ['@babel/preset-env', {targets: {node: 'current'}}],
      '@babel/preset-typescript',
      "module:metro-react-native-babel-preset"
    ],
    plugins: [
      ['@babel/plugin-proposal-private-property-in-object', {loose: true}],
      ["module:react-native-dotenv", {
        "moduleName": "@env",
        "path": ".env",
        "blacklist": null,
        "whitelist": null,
        "safe": false,
        "allowUndefined": true
      }],
      [

        "module-resolver",
        {
          root: ["."],
          alias: {
            'crypto': 'react-native-crypto',
            'stream': 'readable-stream'
          },
          resolvePath(sourcePath, currentFile) {
            if (
              sourcePath === "react-native" &&
              !(
                (
                  currentFile.includes("node_modules/react-native/") || // macos/linux paths
                  currentFile.includes("node_modules\\react-native\\")
                ) // windows path
              ) &&
              !(
                currentFile.includes("resolver/react-native/") ||
                currentFile.includes("resolver\\react-native\\")
              )
            ) {
              return path.resolve(__dirname, "resolver/react-native");
            }
            return undefined;
          },
        },
      ],
      'react-native-reanimated/plugin'
    ],
  };
};