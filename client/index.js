import { AppRegistry, Platform, LogBox } from 'react-native';
import "@react-native-anywhere/polyfill-base64";
import "./shim.js";
import 'react-native-get-random-values';

if (Platform.OS !== 'web') {
  require('react-native-get-random-values');
  LogBox.ignoreLogs(
    [
      "Warning: The provided value 'ms-stream' is not a valid 'responseType'.",
      "Warning: The provided value 'moz-chunked-arraybuffer' is not a valid 'responseType'.",
    ],
  );
}
// 
if (typeof Buffer === 'undefined') {
  global.Buffer = require('buffer').Buffer;
}

process.version = 'v9.40';

LogBox.ignoreAllLogs(true);

import App from "./app/index";

// const { default: AsyncStorage } = require('@react-native-async-storage/async-storage');

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in the Expo makendate or in a native build,
// the environment is set up appropriately
AppRegistry.registerComponent(Platform.OS === "ios" ? "client" : "main", () => App);
