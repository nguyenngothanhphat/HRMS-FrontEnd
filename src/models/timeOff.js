import { dialog } from '@/utils/utils';
import {
  getHolidaysList,
  getLeavingListByEmployee,
  getLeaveBalanceOfUser,
  getLeaveRequestOfEmployee,
  addLeaveRequest,
  getTimeOffTypes,
} from '../services/timeOff';

const timeOff = {
  namespace: 'timeOff',
  state: {
    holidaysList: [],
    leavingList: [],
    totalLeaveBalance: {},
    leaveRequests: {
      type: '',
      status: '',
      employee: {},
      subject: '',
      fromDate: '',
      toDate: '',
      leaveDates: [
        {
          date: '',
          timeOfDay: '',
        },
      ],
      duration: 0,
      onDate: '',
      description: '',
      approvalManager: {},
      cc: [],
    },
    timeOffTypes: [],
  },
  effects: {
    *fetchTimeOffTypes(_, { call, put }) {
      try {
        const response = yield call(getTimeOffTypes);
        const { statusCode, data: timeOffTypes = {} } = response;
        console.log('timeOffTypes', timeOffTypes);
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
        console.log('totalLeaveBalance', totalLeaveBalance);
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { totalLeaveBalance },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchLeaveRequestOfEmployee(_, { call, put }) {
      try {
        const response = yield call(getLeaveRequestOfEmployee);
        const { statusCode, data: leaveRequests = {} } = response;
        console.log('leaveRequests', leaveRequests);
        if (statusCode !== 200) throw response;
        // yield put({
        //   type: 'save',
        //   payload: { leaveRequests },
        // });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchHolidaysList(_, { call, put }) {
      try {
        const response = yield call(getHolidaysList);
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
    *addLeaveRequest(_, { call, put }) {
      try {
        const response = yield call(addLeaveRequest);
        const { statusCode, data: addedLeaveRequest = {} } = response;
        console.log('addedLeaveRequest', addedLeaveRequest);
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { addedLeaveRequest },
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
