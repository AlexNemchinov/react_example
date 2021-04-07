import axios from 'axios';
import {
  all,
  call,
  cancelled,
  debounce,
  delay,
  put,
  select,
  takeLatest,
} from 'redux-saga/effects';
import {
  GET_CARS_INFO,
  GET_CARS_INFO_SUCCESS,
  GET_CARS_INFO_ERROR,
} from '~/components/MyOffers/OfferForm/constants';
import {
  getCarsInfo,
  getCarsInfoSuccess,
} from '~/components/MyOffers/OfferForm/actions';
import { serverError } from '~/components/Root/actions';

function* getCarsData(action) {
  try {
    const cars = yield select((state) => state.selectCars.cars);

    const response = yield axios.get(`/api/my_offers/get_cars_info`, {
      params: { cars },
    });

    const { data } = response;
    yield put(
      getCarsInfoSuccess(
        data.cars,
        data.car_types,
        data.models,
        data.cargo_types,
      ),
    );
  } catch (error) {
    yield put(serverError(error));
  }
}

export default function* offerFormSagas() {
  yield all([takeLatest(GET_CARS_INFO, getCarsData)]);
}
