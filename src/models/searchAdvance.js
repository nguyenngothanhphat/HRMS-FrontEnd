import { dialog } from '@/utils/utils';
import searchAdvance from '../services/searchAdvance';

export default {
  namespace: 'searchAdvance',
  state: {
    result: {},
  },
  effects: {
    *search({ payload }, { call, put }) {
      try {
        const response = yield call(searchAdvance, payload);

        const { statusCode, data: result = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { result } });
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
