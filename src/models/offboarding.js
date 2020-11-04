import { dialog } from '@/utils/utils';
import { getOffboardingList, getOffboardingHRList } from '../services/offboarding';

const offboarding = {
  namespace: 'offboarding',
  state: {
    list: [],
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
