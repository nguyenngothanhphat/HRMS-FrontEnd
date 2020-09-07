import { dialog } from '@/utils/utils';
import {
  LocationFilter,
  DepartmentFilter,
  getListEmployeeMyTeam,
  getListEmployeeActive,
  getListEmployeeInActive,
} from '../services/employee';

const employee = {
  namespace: 'employee',
  state: {
    filter: [],
    location: [],
    department: [],
    listEmployeeMyTeam: [],
    listEmployeeActive: [],
    listEmployeeInActive: [],
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
    *fetchListEmployeeMyTeam(
      { payload: { department = [], location = [], name = '' } = {} },
      { call, put },
    ) {
      try {
        const response = yield call(getListEmployeeMyTeam, {
          department: `{"$in":${department}}`,
          location,
          name,
        });
        const { statusCode, data: listEmployeeMyTeam = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'listEmployeeMyTeam', payload: { listEmployeeMyTeam } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchListEmployeeActive(
      { payload: { department = [], location = [], name = '' } = {} },
      { call, put },
    ) {
      try {
        const response = yield call(getListEmployeeActive, {
          department: { $in: department },
          location: { $in: location },
          name,
        });
        const { statusCode, data: listEmployeeActive = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'listEmployeeActive', payload: { listEmployeeActive } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchListEmployeeInActive(
      { payload: { department = [], location = [], name = '' } = {} },
      { call, put },
    ) {
      try {
        const response = yield call(getListEmployeeInActive, {
          department: { $in: department },
          location: { $in: location },
          name,
        });
        const { statusCode, data: listEmployeeInActive = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'listEmployeeInActive', payload: { listEmployeeInActive } });
      } catch (errors) {
        dialog(errors);
      }
    },
  },
  reducers: {
    saveFilter(state, action) {
      const data = [...state.filter];
      const actionFilter = action.payload;
      // const findIndex = data.findIndex((item) => item.name === actionFilter.name);
      const findIndex = data.findIndex((item) => item.actionFilter.name === actionFilter.name);
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
    listEmployeeMyTeam(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    listEmployeeActive(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    listEmployeeInActive(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
export default employee;
