import * as actionTypes from './actionTypes';

export const introShown = data => {
  return {
    type: actionTypes.INTRO_SHOWN_ALREADY,
    data
  };
};