import { dialog } from '@/utils/utils';
import {
  getListUsersActive,
  getListUsersInActive,
  getLocationsList,
  getCompaniesList,
  getRolesList,
  getUserProfile,
} from '../services/usersManagement';

const usersManagement = {
  namespace: 'usersManagement',
  state: {
    listUsersActive: [],
    listUsersInActive: [],
    clearFilter: false,
    clearName: false,
    filter: [],
  },
  effects: {
    *fetchLocationList(_, { call, put }) {
      try {
        const response = yield call(getLocationsList);
        const { statusCode, data: listLocations = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'listLocations', payload: { listLocations } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchCompaniesList(_, { call, put }) {
      try {
        const response = yield call(getCompaniesList);
        const { statusCode, data: listCompanies = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'listCompanies', payload: { listCompanies } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchRolesList(_, { call, put }) {
      try {
        const response = yield call(getRolesList);
        const { statusCode, data: listRoles = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'listRoles', payload: { listRoles } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchListUsersActive(
      { payload: { company = [], location = [], role = [], name = '' } = {} },
      { call, put },
    ) {
      try {
        const response = yield call(getListUsersActive, { company, location, role, name });
        const { statusCode, data: listUsersActive = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'listUsersActive', payload: { listUsersActive } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchListUsersInActive(
      { payload: { company = [], location = [], role = [], name = '' } = {} },
      { call, put },
    ) {
      try {
        const response = yield call(getListUsersInActive, { company, location, role, name });
        const { statusCode, data: listUsersInActive = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'listUsersInActive', payload: { listUsersInActive } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchUserProfile({ payload: userId = '' }, { call, put }) {
      try {
        const response = yield call(getUserProfile, { userId });
        const { statusCode, data: listUserProfile = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'listUserProfile', payload: { listUserProfile } });
      } catch (errors) {
        dialog(errors);
      }
    },
  },
  reducers: {
    listLocations(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    listCompanies(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    listRoles(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    listUsersActive(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    listUsersInActive(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    listUserProfile(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    saveFilter(state, action) {
      const data = [...state.filter];
      const actionFilter = action.payload;
      const findIndex = data.findIndex((item) => item.actionFilter.name === actionFilter.name);
      if (findIndex < 0) {
        const item = { actionFilter };
        data.push(item);
      } else {
        data[findIndex] = {
          ...data[findIndex],
          checkedList: actionFilter.checkedList,
        };
      }
      return {
        ...state,
        clearFilter: false,
        filter: [...data],
      };
    },
    clearFilter(state) {
      return {
        ...state,
        clearFilter: true,
        clearName: true,
        filter: [],
      };
    },
    offClearName(state) {
      return {
        ...state,
        clearName: false,
      };
    },
  },
};
export default usersManagement;
