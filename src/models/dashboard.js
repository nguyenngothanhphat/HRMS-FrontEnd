import { notification } from 'antd';
import { dialog } from '@/utils/utils';
import {
  getListTicket,
  getListTimeSheetTicket,
  getAllListTicket,
  getListMyTicket,
  getLeaveRequestOfEmployee,
  aprovalCompoffRequest,
  approveRequest,
  rejectRequest,
  approveTimeSheetRequest,
  rejectCompoffRequest,
  getListEmployee,
  updateTicket,
  uploadFile,
  addNotes,
  getProjectList,
  getMyResoucreList,

  // NEW DASHBOARD
  syncGoogleCalendar,
  getWidgets,
  updateWidgets,
  // getMyTeam,
  getMyTimesheet,
  getListMyTeam,
  getHolidaysByCountry,
  getMyTeamLeaveRequestList,
  getTimeOffTypeByCountry,
} from '../services/dashboard';
import { getCurrentTenant, getCurrentCompany } from '../utils/authority';

const defaultState = {
  listTicket: [],
  listMyTicket: [],
  listTimeSheetTicket: [],
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
  leaveRequests: [],
  status: '',
  statusApproval: '',
  birthdayInWeekList: [],
  teamLeaveRequestList: [],
  timeOffTypesByCountry: [],
  allTicket: [],
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
    *fetchListTimeSheetTicket({ payload = {} }, { call, put }) {
      try {
        const response = yield call(getListTimeSheetTicket, {
          ...payload,
          tenantId: getCurrentTenant(),
          companyId: getCurrentCompany(),
        });

        const {
          code,
          data: { reports, total = 0 },
        } = response;
        if (code !== 200) throw response;
        yield put({
          type: 'save',
          payload: { listTimeSheetTicket: reports, totalTimeSheetTicket: total },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchAllListTicket({ payload = {} }, { call, put }) {
      try {
        const response = yield call(getAllListTicket, {
          ...payload,
          tenantId: getCurrentTenant(),
          companyId: getCurrentCompany(),
          roles: ['MANAGER'],
          status: ['PENDING', 'IN-PROGRESS'],
        });

        const {
          code,
          data: { reports },
        } = response;
        if (code !== 200) throw response;
        yield put({
          type: 'save',
          payload: { allTicket: reports },
        });
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
    *fetchLeaveRequestOfEmployee({ payload }, { call, put }) {
      try {
        const tenantId = getCurrentTenant();
        const response = yield call(getLeaveRequestOfEmployee, {
          ...payload,
          tenantId,
          company: getCurrentCompany(),
        });
        const { statusCode, data: { items: leaveRequests = [] } = {} } = response;
        if (statusCode !== 200) throw response;

        yield put({
          type: 'save',
          payload: { leaveRequests },
        });
        return response;
      } catch (errors) {
        dialog(errors);
      }
      return {};
    },

    // REPORTING MANAGER
    *approveRequest({ payload: { typeTicket = '', _id } = {}, statusTimeoff = '' }, { call, put }) {
      let response;
      try {
        switch (typeTicket) {
          case 'compoffRequest':
            response = yield call(aprovalCompoffRequest, {
              _id,
              tenantId: getCurrentTenant(),
              company: getCurrentCompany(),
            });
            break;
          case 'leaveRequest':
            response = yield call(approveRequest, {
              _id,
              tenantId: getCurrentTenant(),
              company: getCurrentCompany(),
            });
            break;
          default:
            break;
        }
        const { statusCode, message = '' } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        yield put({
          type: 'save',
          payload: { isLoadData: true, statusApproval: statusTimeoff },
        });
      } catch (errors) {
        dialog(errors);
        return {};
      }
      return response;
    },
    *rejectRequest(
      { payload: { typeTicket = '', _id, comment } = {}, statusTimeoff = '' },
      { call, put },
    ) {
      let response;
      try {
        switch (typeTicket) {
          case 'compoffRequest':
            response = yield call(rejectCompoffRequest, {
              _id,
              comment,
              tenantId: getCurrentTenant(),
              company: getCurrentCompany(),
            });
            break;
          case 'leaveRequest':
            response = yield call(rejectRequest, {
              _id,
              comment,
              tenantId: getCurrentTenant(),
              company: getCurrentCompany(),
            });
            break;
          default:
            break;
        }
        const { statusCode, message = '' } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        yield put({
          type: 'save',
          payload: { isLoadData: true, statusApproval: statusTimeoff },
        });
      } catch (errors) {
        dialog(errors);
        return {};
      }
      return response;
    },

    *approveTimeSheetRequest({ payload = {} }, { call }) {
      let response;
      try {
        response = yield call(approveTimeSheetRequest, {
          ...payload,
          tenantId: getCurrentTenant(),
          companyId: getCurrentCompany(),
        });

        const { code } = response;
        if (code !== 200) throw response;
        notification.success({ message: 'Timesheet has been approved.' });
      } catch (errors) {
        dialog(errors);
        return {};
      }
      return response;
    },

    *rejectTimeSheetRequest({ payload = {} }, { call }) {
      let response;
      try {
        response = yield call(approveTimeSheetRequest, {
          ...payload,
          tenantId: getCurrentTenant(),
          companyId: getCurrentCompany(),
        });

        const { code } = response;
        if (code !== 200) throw response;
        notification.success({ message: 'Timesheet has been rejected' });
      } catch (errors) {
        dialog(errors);
        return {};
      }
      return response;
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
        const res = yield call(
          getMyTimesheet,
          {},
          { ...payload, company: getCurrentCompany(), tenantId: getCurrentTenant() },
        );
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
    // PROJECT MANAGEMNET
    *fetchProjectList({ payload = {}, myId = '' }, { call, put }) {
      let response = {};
      try {
        response = yield call(getProjectList, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;
        const result = data.filter((val) => val.projectManager !== null);
        const newProjectList = result.filter((val) => val.projectManager.generalInfo._id === myId);
        const projectId = [];
        for (const item of newProjectList) {
          projectId.push(item.id);
        }
        yield put({
          type: 'fetchResourceList',
          payload: {
            project: projectId,
          },
        });
        yield put({
          type: 'save',
          payload: {
            projectList: data,
          },
        });
      } catch (errors) {
        dialog(errors);
        return [];
      }
      return response;
    },
    // RESOUCRE MANAGEMENT
    *fetchResourceList({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getMyResoucreList, {
          ...payload,
          company: [getCurrentCompany()],
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: {
            resoucreList: data,
          },
        });
      } catch (errors) {
        dialog(errors);
        return [];
      }
      return response;
    },
    *fetchHolidaysByCountry({ payload = {} }, { call, put }) {
      let response = {};
      try {
        response = yield call(getHolidaysByCountry, { ...payload, tenantId: getCurrentTenant() });
        const { statusCode, data: holidaysListByCountry = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { holidaysListByCountry },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *fetchTeamLeaveRequests({ payload }, { call, put }) {
      try {
        const response = yield call(getMyTeamLeaveRequestList, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const {
          statusCode,
          data: { items: teamLeaveRequestList = [] },
          total = 0,
        } = response;
        // console.log('response', response);
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { teamLeaveRequestList },
        });
        yield put({
          type: 'savePaging',
          payload: { total },
        });
        return response;
      } catch (errors) {
        // dialog(errors);
      }
      return {};
    },
    *fetchTimeOffTypesByCountry({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getTimeOffTypeByCountry, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { timeOffTypesByCountry: data },
        });
      } catch (error) {
        dialog(error);
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
