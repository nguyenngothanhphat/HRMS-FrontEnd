import { getCurrentCompany } from '@/utils/authority';
import { TIMEOFF_STATUS } from '@/utils/timeOff';
import { dialog } from '@/utils/utils';
import {
  getListTimeOff,
  getListEmployees,
  getRequestById,
  // getListTimeOffManagement,
} from '../services/timeOffManagement';

const options = [
  { value: TIMEOFF_STATUS.ACCEPTED, label: 'Approved' },
  { value: TIMEOFF_STATUS.IN_PROGRESS, label: 'In Progress' },
  { value: TIMEOFF_STATUS.IN_PROGRESS_NEXT, label: 'In Progress' },
  { value: TIMEOFF_STATUS.REJECTED, label: 'Rejected' },
  { value: TIMEOFF_STATUS.DRAFTS, label: 'Draft' },
  { value: TIMEOFF_STATUS.ON_HOLD, label: 'On-hold' },
  { value: TIMEOFF_STATUS.DELETED, label: 'Deleted' },
  { value: TIMEOFF_STATUS.WITHDRAWN, label: 'Withdrawn' },
];

const timeOffManagement = {
  namespace: 'timeOffManagement',
  state: {
    listTimeOff: [],
    listEmployee: [],
    requestDetail: {},
    selectedLocations: [],
  },
  effects: {
    *fetchEmployeeList({ payload = {} }, { call, put }) {
      try {
        const response = yield call(getListEmployees, payload);
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { listEmployee: data } });
      } catch (error) {
        dialog(error);
      }
    },

    *fetchListTimeOff({ payload = {} }, { call, put }) {
      try {
        const response = yield call(getListTimeOff, { ...payload, company: getCurrentCompany() });
        let { data: listTimeOff = [] } = response;
        const { statusCode } = response;
        if (statusCode !== 200) throw response;

        listTimeOff = listTimeOff.map((item = {}) => {
          const fullName = `${item.employee.generalInfo.firstName} ${item.employee.generalInfo.lastName}`;
          let newStatus = '';

          options.forEach((op) => {
            if (op.value === item.status) {
              newStatus = op.label;
            }
          });

          return {
            _id: item._id,
            ticketID: item.ticketID,
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
        const response = yield call(getRequestById, { ...payload, company: getCurrentCompany() });
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
