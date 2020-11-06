import { dialog } from '@/utils/utils';
import { getOffboardingList, sendRequest } from '../services/offboarding';

const offboarding = {
  namespace: 'offboarding',
  state: {
    list: [],
    request: [],
  },
  effects: {
    *fetchList(_, { call, put }) {
      try {
        const response = yield call(getOffboardingList);
        const { statusCode, data: list = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { list } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *sendRequest({ payload }, { call, put }) {
      try {
        const response = yield call(sendRequest, payload);
        const { statusCode, data: request = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { request } });
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
export default offboarding;
