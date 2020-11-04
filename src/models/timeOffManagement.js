import { dialog } from '@/utils/utils';
import getListTimeOff from '../services/timeOffManagement';

const timeOffManagement = {
  namespace: 'timeOffManagement',
  state: {
    listTimeOff: [],
  },
  effects: {
    *fetchListTimeOff({ data = {} }, { call, put }) {
      try {
        const response = yield call(getListTimeOff, { data });
        const { statusCode, data: listTimeOff = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { listTimeOff },
        });
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
export default timeOffManagement;
