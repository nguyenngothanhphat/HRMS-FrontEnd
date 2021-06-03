import { dialog } from '@/utils/utils';
import {
  getListTimeOff,
  getListEmployees,
  getRequestById,
  getListTimeOffManagement,
} from '../services/timeOffManagement';

const timeOffManagement = {
  namespace: 'timeOffManagement',
  state: {
    listTimeOff: [],
    listEmployee: [],
    requestDetail: {},
  },
  effects: {
    *fetchEmployeeList({ payload = {} }, { call, put }) {
      try {
        const response = yield call(getListEmployees, payload);
        const { statusCode, data = [] } = response;
        const listEmployee = data.map((item = {}) => {
          const { _id, generalInfo: { firstName = '', lastName = '' } = {} } = item;
          return {
            _id,
            name: firstName + lastName,
          };
        });
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { listEmployee } });
      } catch (error) {
        dialog(error);
      }
    },
    *fetchListTimeOffManagement({ payload = {} }, { call, put }) {
      try {
        const response = yield call(getListTimeOffManagement, payload);
        const { data: listTimeOff = [] } = response;
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { listTimeOff },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchListTimeOff({ payload = {} }, { call, put }) {
      try {
        const response = yield call(getListTimeOff, payload);
        let { data: listTimeOff = [] } = response;
        const { statusCode } = response;
        listTimeOff = listTimeOff.map((item = {}) => {
          const fullName = `${item.employee.generalInfo.firstName} ${item.employee.generalInfo.lastName}`;
          let newStatus = '';
          if (item.status === 'IN-PROGRESS') {
            newStatus = 'In progress';
          } else if (item.status === 'REJECTED') {
            newStatus = 'Rejected';
          } else if (item.status === 'ACCEPTED' || item.status === 'APPROVED') {
            newStatus = 'Accepted';
          } else if (item.status === 'WAITING-FOR-APPROVE' || item.status === 'HOLDING') {
            newStatus = 'Holding';
          }
          return {
            _id: item._id,
            employeeId: item.employee.employeeId,
            name: fullName,
            // country: item.employee.location.country.nativeName,
            cc: item.cc,
            fromDate: item.fromDate,
            toDate: item.toDate,
            type: item.type,
            updated: item.updated,
            description: item.description,
            duration: item.duration,
            employee: item.employee,
            status: newStatus,
          };
        });
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { listTimeOff },
        });
        // console.log('data', listTimeOff)
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchRequestById({ payload = {} }, { call, put }) {
      try {
        const response = yield call(getRequestById, payload);
        const { statusCode, data = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: {
            requestDetail: data,
          },
        });
      } catch (error) {
        dialog(error);
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
export default timeOffManagement;
