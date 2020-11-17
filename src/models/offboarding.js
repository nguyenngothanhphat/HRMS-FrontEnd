import { dialog } from '@/utils/utils';
import { notification } from 'antd';
import { getOffboardingList, sendRequest, getapprovalflowList } from '../services/offboarding';

const offboarding = {
  namespace: 'offboarding',
  state: {
    listOffboarding: [],
    request: [],
    myRequest: {},
    approvalflow: [],
  },
  effects: {
    *fetchList({ payload }, { call, put }) {
      try {
        const response = yield call(getOffboardingList, payload);
        const { statusCode, data: listOffboarding = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { listOffboarding } });
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
    *fetchApprovalFlowList({ payload }, { call, put }) {
      try {
        const response = yield call(getapprovalflowList, payload);
        const { statusCode, data: approvalflow = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { approvalflow } });
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
