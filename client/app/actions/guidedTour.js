import * as actionTypes from './actionTypes';

export const guidedTourCompletedAction = data => {
  return {
    type: actionTypes.TOUR_COMPLETION,
    data
  };
};