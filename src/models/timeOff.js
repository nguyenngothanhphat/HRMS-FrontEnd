import { notification } from 'antd';
import { getCurrentCompany, getCurrentTenant, getCurrentLocation } from '@/utils/authority';
import { dialog } from '@/utils/utils';
import {
  getHolidaysList,
  getLeaveRequestOfEmployee,
  addLeaveRequest,
  removeLeaveRequestOnDatabase,
  addCompoffRequest,
  updateCompoffRequest,
  getMyCompoffRequests,
  getCompoffRequestById,
  getTimeOffTypes,
  getEmailsListByCompany,
  getProjectsListByEmployee,
  getLeaveRequestById,
  updateLeaveRequestById,
  saveDraftLeaveRequest,
  updateDraftLeaveRequest,
  getTeamCompoffRequests,
  getTeamLeaveRequests,
  uploadFile,
  uploadBalances,
  withdrawCompoffRequest,
  approveRequest,
  rejectRequest,
  // WITHDRAW
  employeeWithdrawInProgress,
  employeeWithdrawApproved,
  // compoff approval flow
  getCompoffApprovalFlow,
  approveCompoffRequest,
  removeTimeOffType,
  rejectCompoffRequest,
  // approve, reject multiple requests
  approveMultipleRequests,
  rejectMultipleRequests,
  approveMultipleCompoffRequest,
  rejectMultipleCompoffRequest,

  // ACCOUNT SETTINGS
  getDefaultTimeoffTypesList,
  // getCountryList,
  // timeoffType
  getInitEmployeeSchedule,
  getEmployeeScheduleByLocation,
  getTimeOffTypeById,
  getTimeOffTypeByCountry,
  updateTimeOffType,
  addTimeOffType,
  // getCalendarHoliday,
  getHolidaysListByLocation,
  getHolidaysByCountry,
  deleteHoliday,
  addHoliday,
  updateEmployeeSchedule,
  getLocationByCompany,
  getLocationById,
  getAllLeaveRequests,
  upsertLeaveType,
  getTimeOffTypeByEmployee,
  getLeaveTypeByTimeOffType,
  getEmployeeTypeList,
} from '../services/timeOff';

const timeOff = {
  namespace: 'timeOff',
  state: {
    currentLeaveTypeTab: '1',
    currentScopeTab: '1',
    currentFilterTab: '1',
    holidaysList: [],
    holidaysListByLocation: [],
    holidaysListByCountry: [],
    leaveHistory: [],
    leavingList: [],
    leaveRequests: [],
    compoffRequests: [],
    timeOffTypes: [],
    yourTimeOffTypes: [],
    timeOffTypesByCountry: [],
    employeeInfo: {},
    emailsList: [],
    projectsList: [],
    viewingLeaveRequest: {},
    viewingCompoffRequest: {},
    savedDraftLR: {},
    teamCompoffRequests: [],
    teamLeaveRequests: [],
    allLeaveRequests: [],
    urlExcel: undefined,
    updateSchedule: {},
    balances: {},
    filter: {
      type: [],
      search: '',
      fromDate: '',
      toDate: '',
      isSearch: false,
    },
    compoffApprovalFlow: {},
    employeeSchedule: {},
    currentUserRole: '', // employee, manager, hr-manager
    // account settings
    defaultTimeoffTypesList: [],
    selectedConfigCountry: null,
    setupPack: [
      // {
      //   shortType: 'CL',
      //   totalPerYear: 12,
      //   whenToAdd: 'month',
      // },
      // {
      //   shortType: 'SL',
      //   totalPerYear: 7,
      //   whenToAdd: 'year',
      // },
    ],
    itemTimeOffType: {},
    viewingLeaveType: {},
    employeeTypeList: [],
    pageStart: true,
    locationByCompany: [],
    tempData: {
      type: {},
      selectedCountry: '',
      countryHoliday: '',
    },
    paging: {
      page: 1,
      limit: 10,
      total: 0,
    },
  },
  effects: {
    *getTimeOffTypeByLocation(_, { call }) {
      try {
        const response = yield call(getLocationById, {
          tenantId: getCurrentTenant(),
          id: getCurrentLocation(),
        });
        return response;
      } catch (error) {
        dialog(error);
        return error;
      }
    },

    *addTimeOffType({ payload }, { call, put }) {
      try {
        const response = yield call(addTimeOffType, payload);
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        // yield put
        notification.success({
          message: 'Add new type successfully',
        });
        yield put({
          type: 'fetchTimeOffTypesByCountry',
          payload: {
            country: payload.country,
            company: getCurrentCompany(),
            tenantId: getCurrentTenant(),
          },
        });
      } catch (error) {
        dialog(error);
      }
    },
    *removeTimeOffType({ payload }, { call, put }) {
      try {
        const response = yield call(removeTimeOffType, {
          _id: payload._id,
          tenantId: payload.tenantId,
        });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message: 'Remove successfully',
        });
        yield put({
          type: 'fetchTimeOffTypesByCompany',
          payload: {
            country: payload.country,
            company: getCurrentCompany(),
            tenantId: getCurrentTenant(),
          },
        });
      } catch (error) {
        dialog(error);
        notification.error(error);
      }
    },
    *fetchTimeOffTypesByCountry({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getTimeOffTypeByCountry, payload);
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
    *fetchTimeOffTypes({ payload }, { call, put }) {
      try {
        const response = yield call(getTimeOffTypes, payload);
        const { statusCode, data: timeOffTypes = [] } = response;
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
    *fetchTimeOffTypeById({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getTimeOffTypeById, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { itemTimeOffType: data },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *updateTimeOffType({ payload }, { call, put }) {
      try {
        const response = yield call(updateTimeOffType, {
          ...payload,
          tenantId: getCurrentTenant(),
        });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: {
            itemTimeOffType: {},
          },
        });
        notification.success({
          message: 'Update successfully',
        });
      } catch (error) {
        dialog(error);
      }
    },

    // LEAVE TYPE CONFIGS
    *fetchLeaveTypeByIDEffect({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getLeaveTypeByTimeOffType, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { viewingLeaveType: data },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchTimeOffTypeByEmployeeEffect({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getTimeOffTypeByEmployee, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { yourTimeOffTypes: data },
        });
      } catch (errors) {
        dialog(errors);
      }
    },

    *upsertLeaveTypeEffect({ payload }, { call }) {
      let response = {};
      try {
        response = yield call(upsertLeaveType, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message: 'Update successfully',
        });
      } catch (error) {
        dialog(error);
      }
      return response;
    },
    *fetchEmployeeTypeListEffect(_, { call, put }) {
      let response = {};
      try {
        response = yield call(getEmployeeTypeList);
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;
        // to make the full time first
        const employeeTypeList = data.reverse();
        yield put({
          type: 'save',
          payload: { employeeTypeList },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *fetchLeaveRequestOfEmployee({ payload }, { call, put }) {
      let response = {};
      try {
        const tenantId = getCurrentTenant();
        response = yield call(getLeaveRequestOfEmployee, {
          ...payload,
          tenantId,
          company: getCurrentCompany(),
        });
        const { statusCode, data: { items: leaveRequests = [] } = {}, total = 0 } = response;
        if (statusCode !== 200) throw response;

        yield put({
          type: 'save',
          payload: { leaveRequests },
        });
        if (!payload.isCountTotal) {
          yield put({
            type: 'savePaging',
            payload: { total },
          });
        }
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },

    *fetchLeaveHistory({ employee = '', status = '' }, { call, put }) {
      try {
        const tenantId = getCurrentTenant();
        const response = yield call(getLeaveRequestOfEmployee, {
          employee,
          status,
          tenantId,
          company: getCurrentCompany(),
        });
        const { statusCode, data: { items: leaveHistory = [] } = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { leaveHistory },
        });
      } catch (errors) {
        dialog(errors);
      }
    },

    *fetchLeaveRequestById({ id = '' }, { call, put }) {
      try {
        const tenantId = getCurrentTenant();
        if (id !== '') {
          const response = yield call(getLeaveRequestById, {
            id,
            tenantId,
            company: getCurrentCompany(),
          });
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
        const response = yield call(updateLeaveRequestById, {
          ...payload,
          company: getCurrentCompany(),
        });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        return statusCode;
      } catch (errors) {
        dialog(errors);
      }
      return 0;
    },
    // Holiday list
    *fetchHolidaysList(_, { call, put }) {
      let response;
      try {
        response = yield call(getHolidaysList, { tenantId: getCurrentTenant() });
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
    *fetchHolidaysListByLocation({ payload = {} }, { call, put }) {
      let response;
      try {
        response = yield call(getHolidaysListByLocation, {
          ...payload,
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data: holidaysListByLocation = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { holidaysListByLocation },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *fetchHolidaysByCountry({ payload = {} }, { call, put }) {
      let response = {};
      try {
        response = yield call(getHolidaysByCountry, { ...payload, tenantId: getCurrentTenant() });
        const { statusCode, data: holidaysListByCountry = [] } = response;
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
    *addLeaveRequest({ payload = {} }, { call, put }) {
      try {
        const response = yield call(addLeaveRequest, { ...payload, company: getCurrentCompany() });
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
    *removeLeaveRequestOnDatabase({ id = '' }, { call, put }) {
      try {
        const response = yield call(removeLeaveRequestOnDatabase, {
          id,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data: withdrawnLeaveRequest = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { withdrawnLeaveRequest },
        });
        return statusCode;
      } catch (errors) {
        dialog(errors);
      }
      return 0;
    },
    *saveDraftLeaveRequest({ payload = {} }, { call, put }) {
      try {
        const response = yield call(saveDraftLeaveRequest, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
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
        const response = yield call(updateDraftLeaveRequest, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
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
        const response = yield call(addCompoffRequest, {
          ...payload,
          tenantId: getCurrentTenant(),
        });
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
        const response = yield call(updateCompoffRequest, {
          ...payload,
          tenantId: getCurrentTenant(),
        });
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
    *fetchMyCompoffRequests({ payload }, { call, put }) {
      try {
        const response = yield call(getMyCompoffRequests, {
          ...payload,
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data: { result: compoffRequests = [] } = {}, total = 0 } = response;
        // console.log('response', response);
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { compoffRequests },
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
    *fetchCompoffRequestById({ id = '' }, { call, put }) {
      try {
        if (id !== '') {
          const response = yield call(getCompoffRequestById, { id, tenantId: getCurrentTenant() });
          const { statusCode, data: viewingCompoffRequest = {} } = response;
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

    *withdrawCompoffRequest({ payload }, { call, put }) {
      try {
        const response = yield call(withdrawCompoffRequest, {
          ...payload,
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data: withdrawnCompoffRequest = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { withdrawnCompoffRequest },
        });
        return statusCode;
      } catch (errors) {
        dialog(errors);
      }
      return 0;
    },

    *fetchEmailsListByCompany({ payload: { company = [] } = {} }, { call, put }) {
      try {
        const response = yield call(getEmailsListByCompany, {
          company,
          tenantId: getCurrentTenant(),
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
    *fetchProjectsListByEmployee({ payload = {} }, { call, put }) {
      try {
        const response = yield call(getProjectsListByEmployee, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
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
    *fetchTeamCompoffRequests({ payload }, { call, put }) {
      try {
        const response = yield call(getTeamCompoffRequests, {
          ...payload,
          tenantId: getCurrentTenant(),
        });
        const {
          statusCode,
          data: { items: teamCompoffRequests = [] },
          total = 0,
        } = response;
        // console.log('response', response);
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { teamCompoffRequests },
        });
        yield put({
          type: 'savePaging',
          payload: { total },
        });
        return response;
      } catch (errors) {
        dialog(errors);
      }
      return {};
    },

    *fetchTeamLeaveRequests({ payload }, { call, put }) {
      try {
        const response = yield call(getTeamLeaveRequests, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const {
          statusCode,
          data: { items: teamLeaveRequests = [] },
          total = 0,
        } = response;
        // console.log('response', response);
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { teamLeaveRequests },
        });
        if (!payload.isCountTotal) {
          yield put({
            type: 'savePaging',
            payload: { total },
          });
        }
        return response;
      } catch (errors) {
        // dialog(errors);
      }
      return {};
    },

    *fetchAllLeaveRequests({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getAllLeaveRequests, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const {
          statusCode,
          data: { items: allLeaveRequests = [] },
          total = 0,
        } = response;

        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { allLeaveRequests },
        });
        if (!payload.isCountTotal) {
          yield put({
            type: 'savePaging',
            payload: { total },
          });
        }
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },

    *clearViewingLeaveRequest(_, { put }) {
      try {
        yield put({
          type: 'save',
          payload: { viewingLeaveRequest: {} },
        });
      } catch (errors) {
        dialog(errors);
      }
    },

    *clearViewingCompoffRequest(_, { put }) {
      try {
        yield put({
          type: 'save',
          payload: { viewingCompoffRequest: {} },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *uploadFileExcel({ payload = {} }, { call, put }) {
      try {
        const response = yield call(uploadFile, { ...payload, tenantId: getCurrentTenant() });
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
        const response = yield call(uploadBalances, { ...payload, tenantId: getCurrentTenant() });
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

    // REPORTING MANAGER
    *approveRequest({ payload = {} }, { call, put }) {
      try {
        const response = yield call(approveRequest, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, message = '', data: { leaveRequest = {} } = {} } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        yield put({
          type: 'saveViewingLeaveRequest',
          payload: {
            status: leaveRequest.status,
            comment: leaveRequest.comment,
          },
        });
        return response;
      } catch (errors) {
        dialog(errors);
        return {};
      }
    },
    *rejectRequest({ payload = {} }, { call, put }) {
      try {
        const response = yield call(rejectRequest, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, message = '', data: { leaveRequest = {} } = {} } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        yield put({
          type: 'saveViewingLeaveRequest',
          payload: {
            status: leaveRequest.status,
            comment: leaveRequest.comment,
          },
        });
        return response;
      } catch (errors) {
        dialog(errors);
        return {};
      }
    },

    *approveMultipleRequests({ payload = {} }, { call }) {
      try {
        const response = yield call(approveMultipleRequests, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, message = '' } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        return statusCode;
      } catch (errors) {
        dialog(errors);
        return {};
      }
    },
    *rejectMultipleRequests({ payload = {} }, { call }) {
      try {
        const response = yield call(rejectMultipleRequests, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, message = '' } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        return statusCode;
      } catch (errors) {
        dialog(errors);
        return {};
      }
    },

    // WITHDRAW (INCLUDING SEND EMAILs)
    *employeeWithdrawInProgress({ payload = {} }, { call }) {
      try {
        const response = yield call(employeeWithdrawInProgress, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, message = '' } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        return statusCode;
      } catch (errors) {
        dialog(errors);
      }
      return 0;
    },
    *employeeWithdrawApproved({ payload = {} }, { call }) {
      try {
        const response = yield call(employeeWithdrawApproved, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        return statusCode;
      } catch (errors) {
        dialog(errors);
      }
      return 0;
    },
    *getCompoffApprovalFlow({ payload = {} }, { call, put }) {
      try {
        const response = yield call(getCompoffApprovalFlow, {
          ...payload,
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data: compoffApprovalFlow = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: {
            compoffApprovalFlow,
          },
        });
        return response;
      } catch (errors) {
        dialog(errors);
      }
      return 0;
    },
    *approveCompoffRequest({ payload = {} }, { call, put }) {
      try {
        const response = yield call(approveCompoffRequest, {
          ...payload,
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data: compoffRequest = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'saveViewingCompoffRequest',
          payload: {
            status: compoffRequest.status,
            commentCLA: compoffRequest.commentCLA,
            commentPM: compoffRequest.commentPM,
            currentStep: compoffRequest.currentStep,
          },
        });
        return response;
      } catch (errors) {
        dialog(errors);
      }
      return 0;
    },
    *rejectCompoffRequest({ payload = {} }, { call, put }) {
      try {
        const response = yield call(rejectCompoffRequest, {
          ...payload,
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data: compoffRequest = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'saveViewingCompoffRequest',
          payload: {
            status: compoffRequest.status,
            commentCLA: compoffRequest.commentCLA,
            commentPM: compoffRequest.commentPM,
            currentStep: compoffRequest.currentStep,
          },
        });
        return response;
      } catch (errors) {
        dialog(errors);
      }
      return 0;
    },

    // multiple compoff request
    *approveMultipleCompoffRequest({ payload = {} }, { call }) {
      try {
        const response = yield call(approveMultipleCompoffRequest, {
          ...payload,
          tenantId: getCurrentTenant(),
        });
        const { statusCode, message = '' } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        return statusCode;
      } catch (errors) {
        dialog(errors);
        return {};
      }
    },
    *rejectMultipleCompoffRequest({ payload = {} }, { call }) {
      try {
        const response = yield call(rejectMultipleCompoffRequest, {
          ...payload,
          tenantId: getCurrentTenant(),
        });

        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        return statusCode;
      } catch (errors) {
        dialog(errors);
        return {};
      }
    },

    // ACCOUNT SETTING
    *getDefaultTimeoffTypesList(_, { call, put }) {
      try {
        // const tenantId = getCurrentTenant();
        const response = yield call(getDefaultTimeoffTypesList);
        const { statusCode, data: defaultTimeoffTypesList = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { defaultTimeoffTypesList },
        });
      } catch (errors) {
        dialog(errors);
      }
    },

    // timeoff type
    *getInitEmployeeSchedule({ payload = {} }, { call, put }) {
      let response;
      try {
        response = yield call(getInitEmployeeSchedule, {
          ...payload,
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: {
            employeeSchedule: data,
          },
        });
      } catch (errors) {
        // dialog(errors);
      }
      return response;
    },
    *getEmployeeScheduleByLocation({ payload = {} }, { call, put }) {
      let response;
      try {
        response = yield call(getEmployeeScheduleByLocation, {
          ...payload,
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data: employeeSchedule = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { employeeSchedule },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *deleteHoliday({ payload = {} }, { call, put }) {
      let response;
      try {
        response = yield call(deleteHoliday, { ...payload, tenantId: getCurrentTenant() });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message: 'Delete Holiday Successfully',
        });
        yield put({
          type: 'save',
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *addHoliday({ payload = {} }, { call, put }) {
      let response;
      try {
        response = yield call(addHoliday, { ...payload, tenantId: getCurrentTenant() });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message: 'Add Holiday Successfully',
        });
        yield put({
          type: 'save',
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *updateEmployeeSchedule({ payload = {} }, { call }) {
      let response = {};
      try {
        response = yield call(updateEmployeeSchedule, {
          ...payload,
          tenantId: getCurrentTenant(),
        });
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
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
    saveTemp(state, action) {
      const { tempData } = state;
      return {
        ...state,
        tempData: {
          ...tempData,
          ...action.payload,
        },
      };
    },
    saveFilter(state, action) {
      const { filter } = state;
      return {
        ...state,
        filter: {
          ...filter,
          ...action.payload,
        },
      };
    },
    clearFilter(state) {
      const { filter } = state;
      return {
        ...state,
        filter: {
          ...filter,
          search: '',
          fromDate: '',
          toDate: '',
          isSearch: false,
        },
      };
    },
    savePaging(state, action) {
      const { paging } = state;
      return {
        ...state,
        paging: {
          ...paging,
          ...action.payload,
        },
      };
    },
    saveViewingLeaveRequest(state, action) {
      const { viewingLeaveRequest } = state;
      return {
        ...state,
        viewingLeaveRequest: {
          ...viewingLeaveRequest,
          ...action.payload,
        },
      };
    },
    saveViewingCompoffRequest(state, action) {
      const { viewingCompoffRequest } = state;
      return {
        ...state,
        viewingCompoffRequest: {
          ...viewingCompoffRequest,
          ...action.payload,
        },
      };
    },
  },
};

export default timeOff;
