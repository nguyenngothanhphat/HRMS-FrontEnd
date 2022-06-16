import { notification } from 'antd';
import { getCurrentCompany, getCurrentLocation, getCurrentTenant } from '@/utils/authority';
import { dialog } from '@/utils/utils';
import {
  createRequest,
  getList,
  getMyRequest,
  getRequestById,
  getTimeInDate,

  // helpers
  getProjectByEmployee,
  getEmployeeList,
} from '../services/offboarding';

const offboarding = {
  namespace: 'offboarding',
  state: {
    selectedLocations: [],
    teamRequests: {
      list: [],
      totalStatus: {},
    },
    viewingRequest: {},
    myRequest: {},
    employeeProjects: [],
    employeeList: [],
    hourList: [],
  },
  effects: {
    *fetchListEffect({ payload }, { call, put }) {
      let response;
      try {
        response = yield call(getList, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: {
            teamRequests: {
              list: data.list,
              totalStatus: data.totalStatus,
            },
          },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *createRequestEffect({ payload }, { call }) {
      let response;
      try {
        response = yield call(createRequest, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, message = '' } = response;
        if (statusCode !== 200) throw response;
        notification.success({ message });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *getMyRequestEffect({ payload }, { call, put }) {
      let response;
      try {
        response = yield call(getMyRequest, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: {
            myRequest: data,
          },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *getRequestByIdEffect({ payload }, { call, put }) {
      let response;
      try {
        response = yield call(getRequestById, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: {
            viewingRequest: data,
          },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *getTimeInDateEffect({ payload }, { call, put }) {
      let response;
      try {
        response = yield call(getTimeInDate, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: {
            hourList: data,
          },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },

    // helpers
    *fetchEmployeeProjectEffect({ payload }, { call, put }) {
      let response;
      try {
        response = yield call(getProjectByEmployee, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: {
            employeeProjects: data,
          },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *fetchEmployeeListEffect({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getEmployeeList, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: {
            employeeList: data,
          },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
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
