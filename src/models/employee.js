import { dialog } from '@/utils/utils';
import { LocationFilter, DepartmentFilter } from '../services/employee';

const employee = {
  namespace: 'employee',
  state: {
    filter: [],
    location: [],
    department: [],
    clearFilter: false,
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
    saveFilter(state, action) {
      const data = [...state.filter];
      const actionFilter = action.payload;
      const findIndex = data.findIndex((item) => item.name === actionFilter.name);
      if (findIndex < 0) {
        const item = { name: actionFilter.name, checkList: actionFilter.checkedList };
        data.push(item);
      } else {
        data[findIndex] = {
          ...data[findIndex],
          checkList: actionFilter.checkedList,
        };
      }
      return {
        ...state,
        clearFilter: false,
        filter: [...data],
      };
    },
    ClearFilter(state) {
      return {
        ...state,
        clearFilter: true,
        filter: [],
      };
    },
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
