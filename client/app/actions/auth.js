import * as actionTypes from './actionTypes';

export const authentication = data => {
  return {
    type: actionTypes.LOGIN,
    data,
  };
};
export const saveAuthenticationDetails = data => {
  return {
    type: actionTypes.TEMP_AUTH_DATA,
    data
  };
};
export const saveAuthenticationDetailsCounselor = data => {
  return {
    type: actionTypes.COUNSELOR_ACCOUNT_TEMP_DETAILS,
    data
  };
};