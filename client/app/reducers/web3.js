import * as actionTypes from '@actions/actionTypes';

const initialState = {};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.WEB3_DETAILS:
      return {
        blockchainDetails: action.data,
      };
    default:
      return state;
  }
};