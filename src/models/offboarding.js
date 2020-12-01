import { dialog } from '@/utils/utils';
import { notification } from 'antd';
import {
  getOffboardingList,
  sendRequest,
  getList1On1,
  getapprovalflowList,
  getRequestById,
  getMeetingTime,
  getDefaultTemplates,
  getCustomTemplates,
  getTemplateById,
  addCustomTemplate,
  getListRelieving,
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
    defaultExitPackage: [],
    defaultClosingPackage: [],
    customExitPackage: [],
    customClosingPackage: [],
    currentTemplate: {},
    inQueuesList: [],
    closeRecordsList: [],
    itemCreateScheduleInterview: {},
    exitPackageDummy: [
      {
        attachment: {
          category: 'attachments',
          createdAt: '2020-11-25T10:09:32.117Z',
          fileName: '1482c4c8-257a-4f3f-8050-e1f0e4d7cf62.pdf',
          id: '5fbe2d5c91a5331e2ca60565',
          name: 'Exit Interview.pdf',
          size: 23084,
          status: 0,
          type: 'application/pdf',
          updatedAt: '2020-11-25T10:09:32.117Z',
          url:
            'http://api-stghrms.paxanimi.ai/api/attachments/5fbe2d5c91a5331e2ca60565/Exit%20Interview.pdf',
          user: '5f57544e899f4743e8fdb3f0',
        },
        createdAt: '2020-11-25T10:09:32.129Z',
        default: true,
        settings: [],
        thumbnail:
          'http://api-stghrms.paxanimi.ai/api/attachments/5fa37887edc16635fad0051c/NoPath%20-%20Copy%20(12)@3x.png',
        title: 'Exit Interview',
        type: 'OFF_BOARDING-EXIT_PACKAGE',
        updatedAt: '2020-11-25T10:09:32.129Z',
        _id: '5fbe2d5c91a5331e2ca60566',
      },
      {
        attachment: {
          category: 'attachments',
          createdAt: '2020-11-25T10:09:32.117Z',
          fileName: '1482c4c8-257a-4f3f-8050-e1f0e4d7cf62.pdf',
          id: '5fbe2d5c91a5331e2ca60565',
          name: 'Exit Interview.pdf',
          size: 23084,
          status: 0,
          type: 'application/pdf',
          updatedAt: '2020-11-25T10:09:32.117Z',
          url:
            'http://api-stghrms.paxanimi.ai/api/attachments/5fbe2d5c91a5331e2ca60565/Exit%20Interview.pdf',
          user: '5f57544e899f4743e8fdb3f0',
        },
        createdAt: '2020-11-25T10:09:32.129Z',
        default: true,
        settings: [],
        thumbnail:
          'http://api-stghrms.paxanimi.ai/api/attachments/5fa37887edc16635fad0051c/NoPath%20-%20Copy%20(12)@3x.png',
        title: 'NOC form',
        type: 'OFF_BOARDING-EXIT_PACKAGE',
        updatedAt: '2020-11-25T10:09:32.129Z',
        _id: '5fbe2d5c91a5331e2ca60567',
      },
      {
        attachment: {
          category: 'attachments',
          createdAt: '2020-11-25T10:09:32.117Z',
          fileName: '1482c4c8-257a-4f3f-8050-e1f0e4d7cf62.pdf',
          id: '5fbe2d5c91a5331e2ca60565',
          name: 'Exit Interview.pdf',
          size: 23084,
          status: 0,
          type: 'application/pdf',
          updatedAt: '2020-11-25T10:09:32.117Z',
          url:
            'http://api-stghrms.paxanimi.ai/api/attachments/5fbe2d5c91a5331e2ca60565/Exit%20Interview.pdf',
          user: '5f57544e899f4743e8fdb3f0',
        },
        createdAt: '2020-11-25T10:09:32.129Z',
        default: true,
        settings: [],
        thumbnail:
          'http://api-stghrms.paxanimi.ai/api/attachments/5fa37887edc16635fad0051c/NoPath%20-%20Copy%20(12)@3x.png',
        title: 'Off boarding checklist',
        type: 'OFF_BOARDING-EXIT_PACKAGE',
        updatedAt: '2020-11-25T10:09:32.129Z',
        _id: '5fbe2d5c91a5331e2ca60568',
      },
    ],
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
    *getDefaultExitPackage({ payload }, { call, put }) {
      try {
        const response = yield call(getDefaultTemplates, payload);
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { defaultExitPackage: data } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *getDefaultClosingPackage({ payload }, { call, put }) {
      try {
        const response = yield call(getDefaultTemplates, payload);
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { defaultClosingPackage: data } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *getCustomExitPackage({ payload }, { call, put }) {
      try {
        const response = yield call(getCustomTemplates, payload);
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { customExitPackage: data } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *getCustomClosingPackage({ payload }, { call, put }) {
      try {
        const response = yield call(getCustomTemplates, payload);
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { customClosingPackage: data } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchTemplateById({ payload = {} }, { call, put }) {
      try {
        const response = yield call(getTemplateById, payload);
        const { statusCode, data } = response;
        console.log(response);
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { currentTemplate: data } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *addCustomTemplate({ payload = {} }, { call, put }) {
      let response = {};
      try {
        response = yield call(addCustomTemplate, payload);
        const { statusCode, data } = response;
        console.log(response);
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { newTemplate: data } });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *getListRelieving({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getListRelieving, payload);
        const { relievingStatus } = payload;
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;
        switch (relievingStatus) {
          case 'CLOSE-RECORDS':
            yield put({ type: 'save', payload: { closeRecordsList: data.items } });
            break;
          case 'IN-QUEUES':
            yield put({ type: 'save', payload: { inQueuesList: data.items } });
            break;
          default:
            return null;
        }
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *createScheduleInterview({ payload, isEmployee = false }, { call, put }) {
      let response = {};
      try {
        response = yield call(create1On1, payload);
        const { statusCode, data: itemCreateScheduleInterview = {} } = response;
        if (statusCode !== 200) throw response;
        if (isEmployee) {
          notification.success({ message: `Set schedule interview successfully!` });
        }
        yield put({ type: 'save', payload: { itemCreateScheduleInterview } });
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
    saveCurrentTemplateSetting(state, action) {
      const { currentTemplate } = state;
      return {
        ...state,
        currentTemplate: {
          ...currentTemplate,
          ...action.payload,
        },
      };
    },
  },
};
export default offboarding;
