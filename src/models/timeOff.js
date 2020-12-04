import { dialog } from '@/utils/utils';
import {
  getHolidaysList,
  getLeavingListByEmployee,
  getLeaveBalanceOfUser,
  getLeaveRequestOfEmployee,
  addLeaveRequest,
  getTimeOffTypes,
  getEmailsListByCompany,
  getLeaveRequestById,
} from '../services/timeOff';

const timeOff = {
  namespace: 'timeOff',
  state: {
    holidaysList: [],
    leavingList: [],
    totalLeaveBalance: {},
    leaveRequests: [],
    timeOffTypes: [],
    employeeInfo: {},
    emailsList: [],
    viewingLeaveRequest: {},
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
          console.log('response', response);
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
    *fetchLeavingList(_, { call, put }) {
      try {
        const response = yield call(getLeavingListByEmployee);
        const { statusCode, data: leavingList = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { leavingList },
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
        return response;
      } catch (errors) {
        dialog(errors);
        return {};
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
