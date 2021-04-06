// import { history } from 'umi';
import { setCurrentLocation, getCurrentLocation } from '@/utils/authority';
import { dialog } from '@/utils/utils';
import getLocationListByCompany from '../services/locationSelection';

const LocationSelection = {
  namespace: 'locationSelection',
  state: {
    listLocationsByCompany: [],
  },
  effects: {
    *fetchLocationsByCompany({ payload }, { call, put }) {
      try {
        const res = yield call(getLocationListByCompany, payload);
        const { statusCode, data = [] } = res;

        if (statusCode !== 200) throw res;
        yield put({
          type: 'save',
          payload: { listLocationsByCompany: data },
        });
        let currentLocation = getCurrentLocation();
        if (!currentLocation) {
          const hasHeadQuarter = data.find((value) => value?.isHeadQuarter);
          if (hasHeadQuarter) {
            setCurrentLocation(hasHeadQuarter._id);
          } else {
            currentLocation = localStorage.setItem(
              'currentLocationId',
              data.length > 0 ? data[0]?._id : '',
            );
          }
        }

        return data;
      } catch (errors) {
        dialog(errors);
        return [];
      }
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

export default LocationSelection;
