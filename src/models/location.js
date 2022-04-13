// import { history } from 'umi';
import {
  setCurrentLocation,
  getCurrentLocation,
  getCurrentTenant,
  getCurrentCompany,
} from '@/utils/authority';
import { dialog } from '@/utils/utils';
import { getLocationListByCompany, getLocationListByParentCompany } from '../services/location';

const Location = {
  namespace: 'location',
  state: {
    companyLocationList: [],
  },
  effects: {
    *fetchLocationsByCompany({ payload }, { call, put }) {
      try {
        const res = yield call(getLocationListByCompany, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data = [] } = res;

        if (statusCode !== 200) throw res;
        yield put({
          type: 'save',
          payload: { companyLocationList: data },
        });

        const currentLocation = getCurrentLocation();
        if (!currentLocation || currentLocation === 'undefined') {
          setCurrentLocation(data.length > 0 ? data[0]?._id : '');
        }

        return data;
      } catch (errors) {
        dialog(errors);
        return [];
      }
    },
    *fetchLocationListByParentCompany({ payload }, { call, put }) {
      try {
        const res = yield call(getLocationListByParentCompany, payload);
        const { statusCode, data = [] } = res;

        if (statusCode !== 200) throw res;
        yield put({
          type: 'save',
          payload: { companyLocationList: data },
        });

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

export default Location;
