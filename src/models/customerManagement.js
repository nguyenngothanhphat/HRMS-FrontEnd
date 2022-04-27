import { message, notification } from 'antd';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import {
  getCustomerList,
  getCompaniesList,
  getEmployeeList,
  addCustomer,
  genCustomerID,
  getTagList,
  getCountryList,
  getStateListByCountry,
  getCustomerFilterList,
  exportCustomer,
} from '../services/customerManagement';
import { dialog } from '@/utils/utils';

const customerManagement = {
  namespace: 'customerManagement',
  state: {
    listTags: [],
    country: [],
    state: [],
    city: [],
    listCustomer: [],
    customer: {},
    filter: {},
    employeeInfo: {},
    temp: {
      customerID: '',
      status: '',
      tag: [],
    },
    employeeList: [],
    companyList: [],
  },
  effects: {
    *fetchCustomerList({ payload }, { call, put }) {
      try {
        const response = yield call(getCustomerList, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { listCustomer: data } });
      } catch (error) {
        dialog(error);
      }
    },

    *filterListCustomer({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getCustomerFilterList, {
          ...payload,
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { listCustomer: data } });
      } catch (error) {
        dialog(error);
      }
      return response;
    },

    *addNewCustomer({ payload }, { call }) {
      try {
        const newPayload = JSON.stringify(payload);
        const response = yield call(addCustomer, newPayload);
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({ message });
      } catch (error) {
        dialog(error);
      }
    },

    *genCustomerID(_, { call, put }) {
      try {
        const response = yield call(genCustomerID, { tenantId: getCurrentTenant() });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'saveTemp', payload: { customerID: data } });
      } catch (error) {
        dialog(error);
      }
    },

    *fetchTagList({ payload }, { call, put }) {
      try {
        const response = yield call(getTagList, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;
        if (data.length > 0) {
          yield put({ type: 'save', payload: { listTags: data[0]?.tagDivision } });
        }
      } catch (error) {
        dialog(error);
      }
    },

    *fetchCountryList(_, { call, put }) {
      try {
        const response = yield call(getCountryList);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { country: data } });
      } catch (error) {
        dialog(error);
      }
    },

    *fetchStateByCountry({ payload }, { call, put }) {
      try {
        const response = yield call(getStateListByCountry, { id: payload });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: {
            state: data,
          },
        });
      } catch (error) {
        dialog();
      }
    },

    *exportReport(_, { call }) {
      let response = '';
      const hide = message.loading('Exporting data...', 0);
      try {
        response = yield call(exportCustomer, {
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
      } catch (error) {
        dialog(error);
      }
      hide();
      return response;
    },

    *fetchEmployeeList({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getEmployeeList, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { employeeList: data } });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },

    *fetchCompanyList({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getCompaniesList, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { companyList: data } });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
  },
  reducers: {
    clearFilter(state) {
      return {
        ...state,
        filter: {},
      };
    },
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    saveTemp(state, action) {
      const { temp } = state;
      return {
        ...state,
        temp: {
          ...temp,
          ...action.payload,
        },
      };
    },
  },
};
export default customerManagement;
