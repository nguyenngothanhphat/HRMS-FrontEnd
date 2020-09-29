import { dialog } from '@/utils/utils';
import { getListCountry, getListState } from '../services/country';

const country = {
  namespace: 'country',
  state: {
    listCountry: [],
    listState: [],
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
    *fetchListState({ payload }, { call, put }) {
      try {
        const response = yield call(getListState, payload);
        const { statusCode, data: listState = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { listState } });
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
