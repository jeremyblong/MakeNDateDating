import * as actionTypes from '@actions/actionTypes';

const initialState = {
  introCompleted: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.INTRO_SHOWN_ALREADY:
      return {
        introCompleted: action.data
      };
      break;
    default:
      return state;
  }
};
