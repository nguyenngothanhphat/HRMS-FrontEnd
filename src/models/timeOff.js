import { dialog } from '@/utils/utils';
import { notification } from 'antd';
import {
  getHolidaysList,
  getLeaveBalanceOfUser,
  getLeaveRequestOfEmployee,
  addLeaveRequest,
  withdrawLeaveRequest,
  addCompoffRequest,
  updateCompoffRequest,
  getMyCompoffRequests,
  getCompoffRequestById,
  getTimeOffTypes,
  getEmailsListByCompany,
  getProjectsListByCompany,
  getLeaveRequestById,
  updateLeaveRequestById,
  saveDraftLeaveRequest,
  updateDraftLeaveRequest,
  getTeamCompoffRequests,
  getTeamLeaveRequests,
  uploadFile,
  uploadBalances,
  withdrawCompoffRequest,
} from '../services/timeOff';

const timeOff = {
  namespace: 'timeOff',
  state: {
    holidaysList: [],
    allMyLeaveRequests: {},
    leavingList: [],
    totalLeaveBalance: {},
    leaveRequests: {},
    compoffRequests: {},
    allMyCompoffRequests: {},
    timeOffTypes: [],
    employeeInfo: {},
    emailsList: [],
    projectsList: [],
    viewingLeaveRequest: {},
    savedDraftLR: {},
    teamCompoffRequests: {},
    teamLeaveRequests: {},
    urlExcel: undefined,
    balances: {},
    allTeamLeaveRequests: {},
    allTeamCompoffRequests: {},
  },
  effects: {
    *fetchTimeOffTypes(_, { call, put }) {
      try {
        const response = yield call(getTimeOffTypes);
        const { statusCode, data: timeOffTypes = {} } = response;
        // console.log('timeOffTypes', timeOffTypes);
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { timeOffTypes },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchLeaveBalanceOfUser(_, { call, put }) {
      try {
        const response = yield call(getLeaveBalanceOfUser);
        const { statusCode, data: totalLeaveBalance = {} } = response;
        // console.log('totalLeaveBalance', totalLeaveBalance);
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { totalLeaveBalance },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchLeaveRequestOfEmployee({ employee = '', status = '' }, { call, put }) {
      try {
        if (status !== '') {
          const response = yield call(getLeaveRequestOfEmployee, { employee, status });
          const { statusCode, data: leaveRequests = [] } = response;
          if (statusCode !== 200) throw response;

          yield put({
            type: 'save',
            payload: { leaveRequests },
          });
          return response;
        }
        if (status === '') {
          const response = yield call(getLeaveRequestOfEmployee, { employee });
          const { statusCode, data: allMyLeaveRequests = [] } = response;
          if (statusCode !== 200) throw response;
          yield put({
            type: 'save',
            payload: { allMyLeaveRequests },
          });
          return response;
        }
      } catch (errors) {
        dialog(errors);
      }
      return {};
    },

    *fetchLeaveRequestById({ id = '' }, { call, put }) {
      try {
        if (id !== '') {
          const response = yield call(getLeaveRequestById, { id });
          const { statusCode, data: viewingLeaveRequest = [] } = response;
          if (statusCode !== 200) throw response;
          yield put({
            type: 'save',
            payload: { viewingLeaveRequest },
          });
        }
      } catch (errors) {
        dialog(errors);
      }
    },
    *updateLeaveRequestById({ payload = {} }, { call }) {
      try {
        const response = yield call(updateLeaveRequestById, payload);
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        return statusCode;
      } catch (errors) {
        dialog(errors);
      }
      return 0;
    },
    *fetchHolidaysList({ payload: { year = '', month = '' } = {} }, { call, put }) {
      let response;
      try {
        response = yield call(getHolidaysList, { year, month });
        const { statusCode, data: holidaysList = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { holidaysList },
        });
      } catch (errors) {
        // dialog(errors);
        // eslint-disable-next-line no-console
        // console.log('errors of holiday list', erros);
      }
      return response;
    },
    *addLeaveRequest({ payload = {} }, { call, put }) {
      try {
        const response = yield call(addLeaveRequest, payload);
        const { statusCode, data: addedLeaveRequest = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { addedLeaveRequest },
        });
        return statusCode;
      } catch (errors) {
        dialog(errors);
        return {};
      }
    },
    *withdrawLeaveRequest({ id = '' }, { call, put }) {
      try {
        if (id !== '') {
          const response = yield call(withdrawLeaveRequest, { id });
          const { statusCode, data: withdrawnLeaveRequest = [] } = response;
          if (statusCode !== 200) throw response;
          yield put({
            type: 'save',
            payload: { withdrawnLeaveRequest },
          });
          return statusCode;
        }
      } catch (errors) {
        dialog(errors);
      }
      return 0;
    },
    *saveDraftLeaveRequest({ payload = {} }, { call, put }) {
      try {
        const response = yield call(saveDraftLeaveRequest, payload);
        const { statusCode, data: savedDraftLR = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { savedDraftLR },
        });
        return statusCode;
      } catch (errors) {
        dialog(errors);
        return {};
      }
    },
    *updateDraftLeaveRequest({ payload = {} }, { call, put }) {
      try {
        const response = yield call(updateDraftLeaveRequest, payload);
        const { statusCode, data: savedDraftLR = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { savedDraftLR },
        });
        return statusCode;
      } catch (errors) {
        dialog(errors);
        return {};
      }
    },
    *addCompoffRequest({ payload = {} }, { call, put }) {
      try {
        const response = yield call(addCompoffRequest, payload);
        const { statusCode, data: addedCompoffRequest = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { addedCompoffRequest },
        });
        return response;
      } catch (errors) {
        dialog(errors);
        return {};
      }
    },
    *updateCompoffRequest({ payload = {} }, { call, put }) {
      try {
        const response = yield call(updateCompoffRequest, payload);
        const { statusCode, data: updatedCompoffRequest = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { updatedCompoffRequest },
        });
        return { statusCode: 200, data: {} };
      } catch (errors) {
        dialog(errors);
        return {};
      }
    },
    *fetchMyCompoffRequests({ status = '' }, { call, put }) {
      try {
        if (status !== '') {
          const response = yield call(getMyCompoffRequests, { status });
          const { statusCode, data: compoffRequests = {} } = response;
          // console.log('response', response);
          if (statusCode !== 200) throw response;
          yield put({
            type: 'save',
            payload: { compoffRequests },
          });
          return response;
        }
        if (status === '') {
          const response = yield call(getMyCompoffRequests, { status });
          const { statusCode, data: allMyCompoffRequests = {} } = response;
          if (statusCode !== 200) throw response;
          yield put({
            type: 'save',
            payload: { allMyCompoffRequests },
          });
          return response;
        }
      } catch (errors) {
        // dialog(errors);
      }
      return {};
    },
    *fetchCompoffRequestById({ id = '' }, { call, put }) {
      try {
        if (id !== '') {
          const response = yield call(getCompoffRequestById, { id });
          const { statusCode, data: viewingCompoffRequest = [] } = response;
          if (statusCode !== 200) throw response;
          yield put({
            type: 'save',
            payload: { viewingCompoffRequest },
          });
        }
      } catch (errors) {
        dialog(errors);
      }
    },

    *withdrawCompoffRequest({ id = '' }, { call, put }) {
      try {
        if (id !== '') {
          const response = yield call(withdrawCompoffRequest, { id });
          const { statusCode, data: withdrawnCompoffRequest = [] } = response;
          if (statusCode !== 200) throw response;
          yield put({
            type: 'save',
            payload: { withdrawnCompoffRequest },
          });
          return statusCode;
        }
      } catch (errors) {
        dialog(errors);
      }
      return 0;
    },

    *fetchEmailsListByCompany({ payload: { company = [] } = {} }, { call, put }) {
      try {
        const response = yield call(getEmailsListByCompany, {
          company,
        });
        // console.log('email res', response);
        const { statusCode, data: emailsList = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { emailsList },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchProjectsListByCompany({ payload: { company = '', location = '' } = {} }, { call, put }) {
      try {
        const response = yield call(getProjectsListByCompany, {
          company,
          location,
        });
        // console.log('email res', response);
        const { statusCode, data: projectsList = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { projectsList },
        });
      } catch (errors) {
        dialog(errors);
      }
    },

    // MANAGER
    *fetchTeamCompoffRequests({ status = '' }, { call, put }) {
      try {
        if (status !== '') {
          const response = yield call(getTeamCompoffRequests, { status });
          const { statusCode, data: teamCompoffRequests = {} } = response;
          // console.log('response', response);
          if (statusCode !== 200) throw response;
          yield put({
            type: 'save',
            payload: { teamCompoffRequests },
          });
          return response;
        }
        if (status === '') {
          const response = yield call(getTeamCompoffRequests, {});
          const { statusCode, data: allTeamCompoffRequests = {} } = response;
          // console.log('response', response);
          if (statusCode !== 200) throw response;
          yield put({
            type: 'save',
            payload: { allTeamCompoffRequests },
          });
          return response;
        }
      } catch (errors) {
        dialog(errors);
      }
      return {};
    },

    *fetchTeamLeaveRequests({ status = '' }, { call, put }) {
      try {
        if (status !== '') {
          const response = yield call(getTeamLeaveRequests, { status });
          const { statusCode, data: teamLeaveRequests = {} } = response;
          // console.log('response', response);
          if (statusCode !== 200) throw response;
          yield put({
            type: 'save',
            payload: { teamLeaveRequests },
          });
          return response;
        }
        if (status === '') {
          const response = yield call(getTeamLeaveRequests, {});
          const { statusCode, data: allTeamLeaveRequests = {} } = response;
          // console.log('response', response);
          if (statusCode !== 200) throw response;
          yield put({
            type: 'save',
            payload: { allTeamLeaveRequests },
          });
          return response;
        }
      } catch (errors) {
        // dialog(errors);
      }
      return {};
    },
    *uploadFileExcel({ payload = {} }, { call, put }) {
      try {
        const response = yield call(uploadFile, payload);
        const { statusCode, data } = response;
        // console.log('response', response);
        if (statusCode !== 200) throw response;
        notification.success({
          message: 'Upload file Successfully',
        });
        yield put({
          type: 'save',
          payload: { urlExcel: data[0].id },
        });
      } catch (errors) {
        // dialog(errors);
      }
    },
    *uploadBalances({ payload = {} }, { call, put }) {
      try {
        const response = yield call(uploadBalances, payload);
        const { statusCode, data: balances } = response;
        // console.log('response', response);
        if (statusCode !== 200) throw response;
        notification.success({
          message: 'Upload file Successfully',
        });
        yield put({
          type: 'save',
          payload: balances,
        });
      } catch (errors) {
        // dialog(errors);
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

export default timeOff;
