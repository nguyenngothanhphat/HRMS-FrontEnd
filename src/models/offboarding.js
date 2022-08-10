import { notification } from 'antd';
import { isEmpty } from 'lodash';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import { dialog } from '@/utils/utils';
import {
  createRequest,
  getEmployeeList,
  getList,
  getMyRequest,
  // helpers
  getProjectByEmployee,
  getRequestById,
  getTimeInDate,
  updateRequest,
  withdrawRequest,
  getLocationsOfCountries,
  // terminate
  terminateReason,
} from '../services/offboarding';
import { getOffboardingEmpMode, setHideOffboarding } from '@/utils/offboarding';

const offboarding = {
  namespace: 'offboarding',
  state: {
    selectedLocations: [],
    selectedDivisions: [],
    teamRequests: {
      list: [],
      totalStatus: {},
    },
    viewingRequest: {},
    myRequest: {},
    employeeProjects: [],
    employeeList: [],
    hourList: [],
    locationsOfCountries: [],
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
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *updateRequestEffect({ payload, replaceState = true, showNotification = true }, { call, put }) {
      let response;
      try {
        response = yield call(updateRequest, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, message = '', data = {} } = response;
        if (statusCode !== 200) throw response;
        if (showNotification) {
          notification.success({ message });
        }
        if (replaceState) {
          yield put({
            type: 'save',
            payload: {
              viewingRequest: data || {},
            },
          });
        }
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *getMyRequestEffect({ payload, userModelProp = '' }, { call, put }) {
      let response = {};
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
            myRequest: data || {},
          },
        });
        if (userModelProp) {
          if (isEmpty(data) && userModelProp.hideMenu && !getOffboardingEmpMode()) {
            setHideOffboarding(true);
          } else {
            setHideOffboarding(false);
          }
        }
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
    *withdrawRequestEffect({ payload }, { call }) {
      let response;
      try {
        response = yield call(withdrawRequest, {
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
    *getLocationsOfCountriesEffect({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getLocationsOfCountries, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;

        yield put({
          type: 'save',
          payload: { locationsOfCountries: data },
        });
      } catch (error) {
        dialog(error);
      }
      return response;
    },
    *terminateReason({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(terminateReason, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, message, data } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });

        yield put({ type: 'save', payload: { terminateData: data } });
      } catch (error) {
        dialog(error);
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
