import * as actionTypes from '@actions/actionTypes';

const initialState = {};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOCATION:
      return {
        currentLoc: action.data,
      };
    default:
      return state;
  }
};
