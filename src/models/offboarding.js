import { dialog } from '@/utils/utils';
import { notification } from 'antd';
import { getOffboardingList, sendRequest, getList1On1 } from '../services/offboarding';

const offboarding = {
  namespace: 'offboarding',
  state: {
    list: [],
    request: [],
    myRequest: {},
    list1On1: [],
  },
  effects: {
    *fetchList({ payload }, { call, put }) {
      try {
        const response = yield call(getOffboardingList, payload);
        const { statusCode, data: list = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { list } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *sendRequest({ payload }, { call, put }) {
      try {
        const response = yield call(sendRequest, payload);
        const { statusCode, data: request = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { request } });
        notification.success({ message: `Submit Request successfully!` });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchMyRequest({ payload }, { call, put }) {
      try {
        const response = yield call(getOffboardingList, payload);
        const { statusCode, data: myRequest = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { myRequest } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *getList1On1({ payload }, { call, put }) {
      try {
        const response = yield call(getList1On1, payload);
        const { statusCode, data: list1On1 = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { list1On1 } });
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
export default offboarding;
