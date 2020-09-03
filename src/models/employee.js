import { dialog } from '@/utils/utils';
import { LocationFilter } from '../services/employee';

const employee = {
  namespace: 'employee',
  state: {
    location: [],
  },
  effects: {
    *fetchLocation(_, { call, put }) {
      try {
        const response = yield call(LocationFilter);
        const { statusCode, data: location = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'employee/save', payload: { location } });
      } catch (errors) {
        dialog(errors);
      }
    },
    reducers: {
      save(state, action) {
        return {
          ...state,
          ...action.payload,
        };
      },
    },
  },
};
export default employee;
