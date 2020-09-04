import { dialog } from '@/utils/utils';
import { LocationFilter, DepartmentFilter } from '../services/employee';

const employee = {
  namespace: 'employee',
  state: {
    location: [],
    department: [],
  },
  effects: {
    *fetchLocation(_, { call, put }) {
      try {
        const response = yield call(LocationFilter);
        const { statusCode, data: location = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'saveLocation', payload: { location } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchDepartment(_, { call, put }) {
      try {
        const response = yield call(DepartmentFilter);
        const { statusCode, data: department = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'saveDeparment', payload: { department } });
      } catch (errors) {
        dialog(errors);
      }
    },
  },
  reducers: {
    saveLocation(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    saveDeparment(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
export default employee;
