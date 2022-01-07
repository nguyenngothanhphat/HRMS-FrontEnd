import { notification } from 'antd';
import { dialog } from '@/utils/utils';
import {
  getListTicket,
  getListMyTicket,
  aprovalCompoffRequest,
  aprovalLeaveRequest,
  rejectLeaveRequest,
  rejectCompoffRequest,
  getListEmployee,
  updateTicket,
  uploadFile,
  addNotes,

  // NEW DASHBOARD
  syncGoogleCalendar,
  getWidgets,
  updateWidgets,
  getMyTeam,
  getMyTimesheet,
  getListMyTeam,
} from '../services/dashboard';
import { getCurrentTenant, getCurrentCompany } from '../utils/authority';

const defaultState = {
  listTicket: [],
  listMyTicket: {},
  totalMyTicket: 0,
  isLoadData: false,
  totalTicket: 0,
  googleCalendarList: [],
  employeeInfo: {},
  employeeWidgets: [],
  employeeId: '',
  myTeam: [],
  myTimesheet: [],
  listEmployee: [],
  status: '',
};
const dashboard = {
  namespace: 'dashboard',
  state: defaultState,
  effects: {
    *fetchListTicket({ payload = {} }, { call, put }) {
      try {
        const response = yield call(getListTicket, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        const {
          data: { compoffRequest = [], leaveRequest = [] },
          total = 0,
        } = response;
        const listTicket = [];
        compoffRequest.forEach((item) =>
          listTicket.push({ typeTicket: 'compoffRequest', ...item }),
        );
        leaveRequest.forEach((item) => listTicket.push({ typeTicket: 'leaveRequest', ...item }));

        yield put({ type: 'save', payload: { listTicket, isLoadData: false, totalTicket: total } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchListMyTicket({ payload = {} }, { call, put }) {
      try {
        const response = yield call(getListMyTicket, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { listMyTicket: data } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *approvalTicket({ payload: { typeTicket = '', _id, comment } = {} }, { call, put }) {
      try {
        let response;
        switch (typeTicket) {
          case 'compoffRequest':
            response = yield call(aprovalCompoffRequest, {
              _id,
              comment,
              tenantId: getCurrentTenant(),
            });
            break;
          case 'leaveRequest':
            response = yield call(aprovalLeaveRequest, {
              _id,
              comment,
              tenantId: getCurrentTenant(),
            });
            break;
          default:
            break;
        }
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message: 'Approval ticket successfully',
        });
        yield put({ type: 'save', payload: { isLoadData: true } });
        return response;
      } catch (errors) {
        dialog(errors);
        return {};
      }
    },
    *rejectTicket({ payload: { typeTicket = '', _id, comment } = {} }, { call, put }) {
      try {
        let response;
        switch (typeTicket) {
          case 'compoffRequest':
            response = yield call(rejectCompoffRequest, {
              _id,
              comment,
              tenantId: getCurrentTenant(),
            });
            break;
          case 'leaveRequest':
            response = yield call(rejectLeaveRequest, {
              _id,
              comment,
              tenantId: getCurrentTenant(),
            });
            break;
          default:
            break;
        }
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message: 'Reject ticket successfully',
        });
        yield put({ type: 'save', payload: { isLoadData: true } });
        return response;
      } catch (errors) {
        dialog(errors);
        return {};
      }
    },

    *syncGoogleCalendarEffect({ payload = {} }, { call, put }) {
      let response = {};
      try {
        response = yield call(syncGoogleCalendar, {
          ...payload,
          tenantId: getCurrentTenant(),
        });

        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;
        // console.log('googleCalendarList', googleCalendarList);
        yield put({ type: 'save', payload: { googleCalendarList: data } });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *getWidgetsEffect({ payload = {} }, { call, put }) {
      let response = {};
      try {
        response = yield call(getWidgets, {
          ...payload,
          tenantId: getCurrentTenant(),
        });

        const { statusCode, data = {} } = response;
        if (statusCode !== 200) throw response;

        yield put({
          type: 'save',
          payload: {
            employeeInfo: data,
            // employeeWidgets: data.widgetDashboardShow || [],
            // employeeId: data._id,
          },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *updateWidgetsEffect({ payload = {} }, { call, put }) {
      let response = {};
      try {
        response = yield call(updateWidgets, payload);

        const { statusCode, data = {} } = response;
        if (statusCode !== 200) throw response;

        // refresh the dashboard
        yield put({
          type: 'save',
          payload: {
            employeeWidgets: data?.userMap?.widgetDashboardShow || [],
          },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *updateTicket({ payload }, { call, put }) {
      try {
        const response = yield call(updateTicket, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;
        notification.success({ message: 'Update Ticket successfully' });
        yield put({
          type: 'save',
          payload: { status: data.length > 0 ? data[0].status : '' },
        });
      } catch (error) {
        dialog(error);
      }
    },

    *fetchListEmployee({ payload = {} }, { call, put }) {
      try {
        const response = yield call(getListEmployee, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { listEmployee: data },
        });
      } catch (error) {
        dialog(error);
      }
    },

    *fetchMyTeam({ payload = {} }, { call, put }) {
      let response = {};
      try {
        response = yield call(getListMyTeam, {
          ...payload,
          // tenantId: getCurrentTenant(),
          // company: getCurrentCompany(),
        });
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;

        yield put({ type: 'save', payload: { myTeam: data } });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    // UPLOAD FILE
    *uploadFileAttachments({ payload }, { call }) {
      let response = {};
      try {
        response = yield call(uploadFile, payload);
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message: 'Upload File Successfully',
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    // ADDNOTE
    *addNotes({ payload }, { call, put }) {
      let response;
      try {
        response = yield call(addNotes, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'fetchListMyTicket',
          payload: {},
        });
      } catch (error) {
        dialog(error);
      }
      return response;
    },

    // TIMESHEET
    *fetchMyTimesheetEffect({ payload }, { call, put }) {
      const response = {};
      try {
        const res = yield call(getMyTimesheet, {}, { ...payload, tenantId: getCurrentTenant() });
        const { code, data = [] } = res;
        if (code !== 200) {
          notification.error('Error occurred when fetching timesheet in dashboard');
        }

        yield put({
          type: 'save',
          payload: {
            myTimesheet: data,
          },
        });
      } catch (errors) {
        dialog(errors);
        return [];
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
    clearState() {
      return defaultState;
    },
  },
};
export default dashboard;
