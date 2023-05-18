import * as actionTypes from './actionTypes';

export const saveWeb3Details = data => {
  return {
    type: actionTypes.WEB3_DETAILS,
    data,
  };
};