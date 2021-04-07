import {
  GET_CARS_INFO,
  GET_CARS_INFO_SUCCESS,
  GET_CARS_INFO_ERROR,
  SET_CARS,
  SET_ACTIVE_CARS,
} from './constants';

export const getCarsInfo = () => ({
  type: GET_CARS_INFO,
});

export const getCarsInfoSuccess = (cars, carTypes, models, cargoTypes) => ({
  type: GET_CARS_INFO_SUCCESS,
  cars,
  carTypes,
  models,
  cargoTypes,
});

export const setCars = (cars) => ({
  type: SET_CARS,
  cars,
});

export const setActiveCars = (activeCars) => ({
  type: SET_ACTIVE_CARS,
  activeCars,
});
