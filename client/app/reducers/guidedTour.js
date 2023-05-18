import * as actionTypes from '@actions/actionTypes';

const initialState = {
  tourCompleted: false,
  sequence: 0
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.TOUR_COMPLETION:
      return {
        tourCompleted: action.data
      };
      break;
    default:
      return state;
  }
};