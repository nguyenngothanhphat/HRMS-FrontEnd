import { dialog } from '@/utils/utils';
import {
  getHolidaysList,
  getLeaveBalanceOfUser,
  getLeaveRequestOfEmployee,
  addLeaveRequest,
  withdrawLeaveRequest,
  addCompoffRequest,
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
} from '../services/timeOff';

const timeOff = {
  namespace: 'timeOff',
  state: {
    holidaysList: [],
    leavingList: [],
    totalLeaveBalance: {},
    leaveRequests: {},
    compoffRequests: {},
    timeOffTypes: [],
    employeeInfo: {},
    emailsList: [],
    projectsList: [],
    viewingLeaveRequest: {},
    savedDraftLR: {},
    teamCompoffRequests: {},
    teamLeaveRequests: {},
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
    *fetchLeaveRequestOfEmployee({ employee = '' }, { call, put }) {
      try {
        if (employee !== '') {
          const response = yield call(getLeaveRequestOfEmployee, { employee });
          const { statusCode, data: leaveRequests = [] } = response;
          // console.log('response', response);
          if (statusCode !== 200) throw response;
          yield put({
            type: 'save',
            payload: { leaveRequests },
          });
        }
      } catch (errors) {
        dialog(errors);
      }
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
      try {
        const response = yield call(getHolidaysList, { year, month });
        const { statusCode, data: holidaysList = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { holidaysList },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *addLeaveRequest({ payload = {} }, { call, put }) {
      try {
        console.log('payload', payload);
        const response = yield call(addLeaveRequest, payload);
        const { statusCode, data: addedLeaveRequest = {} } = response;
        console.log('response', response);
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
        console.log('payload saved draft', payload);
        const response = yield call(saveDraftLeaveRequest, payload);
        const { statusCode, data: savedDraftLR = {} } = response;
        console.log('response saved draft', response);
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
        console.log('payload update draft', payload);
        const response = yield call(updateDraftLeaveRequest, payload);
        const { statusCode, data: savedDraftLR = {} } = response;
        console.log('response update draft', response);
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
        console.log('payload', payload);
        const response = yield call(addCompoffRequest, payload);
        const { statusCode, data: addedCompoffRequest = {} } = response;
        console.log('response', response);
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
    *fetchMyCompoffRequests(_, { call, put }) {
      try {
        const response = yield call(getMyCompoffRequests, {});
        const { statusCode, data: compoffRequests = {} } = response;
        // console.log('response', response);
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { compoffRequests },
        });
      } catch (errors) {
        // dialog(errors);
      }
    },
    *fetchCompoffRequestById({ id: _id = '' }, { call, put }) {
      try {
        if (_id !== '') {
          const response = yield call(getCompoffRequestById, { _id });
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
    *fetchTeamCompoffRequests(_, { call, put }) {
      try {
        const response = yield call(getTeamCompoffRequests, {});
        const { statusCode, data: teamCompoffRequests = {} } = response;
        // console.log('response', response);
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { teamCompoffRequests },
        });
      } catch (errors) {
        // dialog(errors);
      }
    },

    *fetchTeamLeaveRequests(_, { call, put }) {
      try {
        const response = yield call(getTeamLeaveRequests, {});
        const { statusCode, data: teamLeaveRequests = {} } = response;
        // console.log('response', response);
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { teamLeaveRequests },
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
