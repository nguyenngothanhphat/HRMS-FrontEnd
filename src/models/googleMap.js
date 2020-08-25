import { notification } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import { searchLocation, getDetailPlace } from '@/services/googleMap';
import { dialog } from '@/utils/utils';

export default {
  namespace: 'googleMap',

  state: {
    list: [],
    detail: {},
  },

  effects: {
    *searchLocation(
      {
        payload: { input },
      },
      { call, put }
    ) {
      try {
        const response = yield call(searchLocation, { input });
        const { predictions = [], status, error_message: description } = response || {};
        if (status !== 'OK')
          notification.error({
            message: formatMessage({ id: 'location.search.unsuccess' }),
            description,
          });
        yield put({
          type: 'save',
          payload: { list: predictions },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchDetail(
      {
        payload: { placeid, onChange },
      },
      { call, select, put }
    ) {
      let newLocation;
      try {
        const {
          result: { geometry: { location } } = { geometry: { location: {} } },
          status,
          error_message: description,
        } = yield call(getDetailPlace, { placeid }) || {};

        const { list } = yield select(state => state.googleMap);
        const { description: address, place_id: placeID } = list.find(
          prediction => prediction.place_id === placeid
        );
        if (status !== 'OK')
          notification.error({
            message: formatMessage({ id: 'location.fetchDetail.unsuccess' }),
            description,
          });
        newLocation = {
          address,
          placeID,
          longitude: location && location.lng,
          latitude: location && location.lat,
        };
        yield put({
          type: 'save',
          payload: { detail: newLocation },
        });
        if (typeof onChange === 'function')
          onChange(
            status === 'OK'
              ? { address, placeID, longitude: location.lng, latitude: location.lat }
              : {}
          );
      } catch (errors) {
        dialog(errors);
      }
      return newLocation;
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
