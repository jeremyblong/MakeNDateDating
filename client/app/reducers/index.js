import {combineReducers} from 'redux';
import AuthReducer from './auth';
import location from "./locationBased.js";
import ApplicationReducer from './application';
import webThree from "./web3.js";
import intro from "./introCompleted.js";
import guidedTour from './guidedTour.js';

export default combineReducers({
  auth: AuthReducer,
  application: ApplicationReducer,
  location,
  webThree,
  intro,
  guidedTour
});
