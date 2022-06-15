import { notification } from 'antd';
import { getCurrentCompany, getCurrentLocation, getCurrentTenant } from '@/utils/authority';
import { dialog } from '@/utils/utils';
import {
  createRequest,
  getList,
  getMyRequest,
  getRequestById,
  withdrawRequest,
} from '../services/offboarding';

const offboarding = {
  namespace: 'offboarding',
  state: {
    selectedLocations: [getCurrentLocation()],
    list: [],
    viewingRequest: {},
    myRequest: {},
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
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: {
            list: data,
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
            myRequest: data || {},
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
