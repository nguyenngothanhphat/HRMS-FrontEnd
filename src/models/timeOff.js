import { dialog } from '@/utils/utils';
import { getHolidaysList, getLeavingListByEmployee } from '../services/timeOff';

const timeOff = {
  namespace: 'timeOff',
  state: {
    holidaysList: [],
    leavingList: [],
  },
  effects: {
    *fetchHolidaysList(_, { call, put }) {
      try {
        const response = yield call(getHolidaysList);
        const { statusCode, data: holidaysList = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { holidaysList },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchLeavingList(_, { call, put }) {
      try {
        const response = yield call(getLeavingListByEmployee);
        const { statusCode, data: leavingList = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { leavingList },
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

export default timeOff;
