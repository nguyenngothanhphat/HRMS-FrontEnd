import { notification } from 'antd';
import router from 'umi/router';
import { formatMessage } from 'umi-plugin-react/locale';
import queryLocation, {
  saveLocation,
  getLocationByID,
  removeLocationById,
  updateGeneral,
  updateFinancier,
  getAllCountry,
} from '@/services/locations';
import { dialog } from '@/utils/utils';

export default {
  namespace: 'locations',

  state: {
    list: [],
    item: undefined,
    countryList: [],
  },

  effects: {
    *fetch({ payload: options = {}, defaultLocation = 1 }, { call, put }) {
      try {
        const response = yield call(queryLocation, options);
        yield put({
          type: 'save',
          payload: {
            list: response.data,
            ...(defaultLocation ? { defaultLocation } : { defaultLocation: response.data[0]._id }),
          },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchItem({ payload: id }, { call, put }) {
      let item = {};
      try {
        if (id) {
          const response = yield call(getLocationByID, id);
          const { statusCode, data } = response;
          if (statusCode !== 200) throw response;
          item = data;
        }
      } catch (errors) {
        dialog(errors);
      }
      yield put({ type: 'save', payload: { item } });
    },
    *updateGeneral(
      {
        payload: { id },
        payload,
      },
      { call }
    ) {
      try {
        const response = yield call(updateGeneral, payload);
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message: formatMessage({ id: 'location.general.update.success' }),
        });
        yield call(router.push, `/admin/location/${id}/general`);
      } catch (errors) {
        dialog(errors);
      }
    },
    *updateFinancier(
      {
        payload: { id },
        payload,
      },
      { call }
    ) {
      try {
        const response = yield call(updateFinancier, payload);
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message: formatMessage({ id: 'location.financiers.update.success' }),
        });
        yield call(router.push, `/admin/location/${id}/financier`);
      } catch (errors) {
        dialog(errors);
      }
    },
    *saveItem({ payload: item }, { call, put }) {
      try {
        const response = yield call(saveLocation, item);
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'refreshItem' });
        notification.success({
          message: formatMessage({ id: 'location.submit.success' }),
        });
        yield call(router.push, `/admin/location/active`);
      } catch (errors) {
        dialog(errors);
      }
    },
    *remove({ payload: id }, { call }) {
      try {
        const response = yield call(removeLocationById, id);
        const { statusCode = 400 } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message: formatMessage({ id: 'location.remove.success' }),
        });
        yield call(router.push, '/admin/location/active');
      } catch (errors) {
        dialog(errors);
      }
    },
    *getAllCountry(_, { call, put }) {
      try {
        const response = yield call(getAllCountry);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { countryList: data } });
      } catch (errors) {
        dialog(errors);
      }
    },
  },

  reducers: {
    changeSelectedLocation(state, action) {
      return {
        ...state,
        ...(action.payload ? { defaultLocation: action.payload } : {}),
      };
    },
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    refreshItem(state) {
      return {
        ...state,
        item: undefined,
      };
    },
  },
};
