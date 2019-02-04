/** @format */

import 'abortcontroller-polyfill';
// import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only';

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
