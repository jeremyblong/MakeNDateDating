import * as actionTypes from '@actions/actionTypes';

const initialState = {
  login: {
    success: false,
  },
  tempUserData: {},
  businessAccountTempData: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOGIN:
      return {
        login: action.data,
      };
      break;
    case actionTypes.TEMP_AUTH_DATA:
      return {
        tempUserData: action.data
      };
      break;
    case actionTypes.COUNSELOR_ACCOUNT_TEMP_DETAILS:
      return {
        businessAccountTempData: action.data
      };
      break;
    default:
      return state;
  }
};
