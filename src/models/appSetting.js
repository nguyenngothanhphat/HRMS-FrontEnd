import { getByLocation } from '@/services/appSetting';
import { dialog } from '@/utils/utils';

export default {
  namespace: 'appSetting',

  state: {},

  effects: {
    *fetchByLocation({ payload }, { put, call }) {
      try {
        const response = yield call(getByLocation, payload);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { ...data },
        });

        return data;
      } catch (errors) {
        dialog(errors);
        return errors;
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
