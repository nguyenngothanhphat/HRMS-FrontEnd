import { dialog } from '@/utils/utils';
import getListCountry from '../services/country';

const country = {
  namespace: 'country',
  state: {
    listCountry: [],
  },
  effects: {
    *fetchListCountry(_, { call, put }) {
      try {
        const response = yield call(getListCountry);
        const { statusCode, data: listCountry = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { listCountry } });
      } catch (errors) {
        dialog(errors);
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
export default country;
