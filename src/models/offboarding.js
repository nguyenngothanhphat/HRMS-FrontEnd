import { dialog } from '@/utils/utils';
import { notification } from 'antd';
import {
  getOffboardingList,
  sendRequest,
  getList1On1,
  getapprovalflowList,
  getRequestById,
  getMeetingTime,
  create1On1,
  teamRequestList,
  getListProjectByEmployee,
  complete1On1,
  reviewRequest,
} from '../services/offboarding';

const offboarding = {
  namespace: 'offboarding',
  state: {
    listOffboarding: [],
    listTeamRequest: [],
    request: [],
    sendrequest: false,
    myRequest: {},
    list1On1: [],
    approvalflow: [],
    listMeetingTime: [],
    listProjectByEmployee: [],
    itemNewCreate1On1: {},
    totalList: [],
    totalListTeamRequest: [],
    showModalSuccessfully: false,
    relievingDetails: {},
  },
  effects: {
    *fetchList({ payload }, { call, put }) {
      try {
        const response = yield call(getOffboardingList, payload);
        const {
          statusCode,
          data: { items: listOffboarding = [], total: totalList = [] } = {},
        } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { listOffboarding, totalList } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchListTeamRequest({ payload }, { call, put }) {
      try {
        const response = yield call(teamRequestList, payload);
        const {
          statusCode,
          data: { items: listTeamRequest = [], total: totalListTeamRequest = [] } = {},
        } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { listTeamRequest, totalListTeamRequest } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *sendRequest({ payload }, { call, put }) {
      let response;
      try {
        response = yield call(sendRequest, payload);
        const { statusCode, data: request = [] } = response;

        if (statusCode !== 200) throw response;

        yield put({ type: 'save', payload: { request, sendrequest: true } });
        notification.success({ message: `Submit Request successfully!` });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *fetchRequestById({ payload }, { call, put }) {
      try {
        const response = yield call(getRequestById, payload);
        const { statusCode, data: myRequest = {} } = response;
        const { employee: { _id: employee } = {} } = myRequest;
        if (statusCode !== 200) throw response;
        yield put({ type: 'getListProjectByEmployee', payload: { employee } });
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
    *getMeetingTime(_, { call, put }) {
      try {
        const response = yield call(getMeetingTime);
        const { statusCode, data: listMeetingTime = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { listMeetingTime } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *create1On1({ payload, isEmployee = false }, { call, put }) {
      let response = {};
      try {
        response = yield call(create1On1, payload);
        const { statusCode, data: itemNewCreate1On1 = {} } = response;
        if (statusCode !== 200) throw response;
        if (isEmployee) {
          notification.success({ message: `Create 1 on 1 successfully!` });
        }
        yield put({ type: 'save', payload: { itemNewCreate1On1 } });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *getListProjectByEmployee({ payload }, { call, put }) {
      try {
        const response = yield call(getListProjectByEmployee, payload);
        const { statusCode, data: listProjectByEmployee = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { listProjectByEmployee } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *complete1On1({ payload }, { call }) {
      let response = {};
      try {
        response = yield call(complete1On1, payload);
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *reviewRequest({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(reviewRequest, payload);
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        const { id } = payload;
        yield put({ type: 'fetchRequestById', payload: { id } });
        yield put({ type: 'save', payload: { showModalSuccessfully: true } });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    // Relieving Formalities
    *fetchRelievingDetailsById({ payload }, { call, put }) {
      try {
        const response = yield call(getRequestById, payload);
        const { statusCode, data: relievingDetails = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { relievingDetails } });
      } catch (errors) {
        dialog(errors);
      }
    },
    // End Relieving Formalities
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
