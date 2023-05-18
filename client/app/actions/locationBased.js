import * as actionTypes from './actionTypes';

export const updateLocationData = (item) => {
    return {
        type: actionTypes.LOCATION,
        payload: item
    }
}