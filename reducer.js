import produce from 'immer';
import { GET_CARS_INFO, GET_CARS_INFO_SUCCESS, SET_CARS, SET_ACTIVE_CARS } from './constants';

const initialState = {
  cars: [],
  // new_cars: [],
  activeCars: [],
  carTypes: [],
  models: [],
  cargoTypes: [],
  loading: false,
  loaded: false,
  error: false,
};

/* eslint-disable default-case, no-param-reassign */
const offerFormReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case GET_CARS_INFO:
        draft.loading = true;
        break;

      case GET_CARS_INFO_SUCCESS:
        draft.cars = action.cars;
        draft.carTypes = action.carTypes;
        draft.models = action.models;
        draft.cargoTypes = action.cargoTypes;
        draft.loading = false;
        break;

      case SET_CARS:
        draft.cars = action.cars;
        break;

      case SET_ACTIVE_CARS:
        draft.activeCars = action.activeCars;
        break;
    }
  });

export default offerFormReducer;
