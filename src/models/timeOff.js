import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import { dialog } from '@/utils/utils';
import { notification } from 'antd';
import {
  getHolidaysList,
  getLeaveBalanceOfUser,
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
  reportingManagerApprove,
  reportingManagerReject,
  // WITHDRAW
  employeeWithdrawInProgress,
  employeeWithdrawApproved,
  managerApproveWithdrawRequest,
  managerRejectWithdrawRequest,
  // compoff approval flow
  getCompoffApprovalFlow,
  approveCompoffRequest,
  rejectCompoffRequest,
  // approve, reject multiple requests
  approveMultipleTimeoffRequest,
  rejectMultipleTimeoffRequest,
  approveMultipleCompoffRequest,
  rejectMultipleCompoffRequest,

  // ACCOUNT SETTINGS
  getDefaultTimeoffTypesList,
  getCountryList,
  // timeoffType
  getInitEmployeeSchedule,
  getEmployeeScheduleByLocation,
  getTimeOffTypeById,
  updateTimeOffType,
  addTimeOffType,
  // getCalendarHoliday,
  getHolidaysListByLocation,
  getHolidaysByCountry,
  deleteHoliday,
  addHoliday,
  updateEmployeeSchedule,
} from '../services/timeOff';

const timeOff = {
  namespace: 'timeOff',
  state: {
    currentLeaveTypeTab: '1',
    currentMineOrTeamTab: '1',
    currentFilterTab: '1',
    holidaysList: [],
    holidaysListByLocation: [],
    holidaysListByCountry: {},
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
    viewingCompoffRequest: {},
    savedDraftLR: {},
    teamCompoffRequests: {},
    teamLeaveRequests: {},
    urlExcel: undefined,
    updateSchedule: {},
    balances: {},
    allTeamLeaveRequests: {},
    allTeamCompoffRequests: {},
    compoffApprovalFlow: {},
    employeeSchedule: {},
    currentUserRole: '', // employee, manager, hr-manager
    // account settings
    defaultTimeoffTypesList: [],
    countryList: [],
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
    pageStart: true,
  },
  effects: {
    *fetchTimeOffTypes({ payload }, { call, put }) {
      try {
        const response = yield call(getTimeOffTypes, payload);
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
    *getDataTimeOffTypeById({ payload }, { call, put }) {
      try {
        const response = yield call(getTimeOffTypeById, payload);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { itemTimeOffType: data },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *updateTimeOffType({ payload }, { call, put }) {
      try {
        const response = yield call(updateTimeOffType, {
          ...payload,
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data } = response;
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
    *fetchLeaveBalanceOfUser({ payload }, { call, put }) {
      try {
        const response = yield call(getLeaveBalanceOfUser, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
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
        const tenantId = getCurrentTenant();
        if (status !== '') {
          const response = yield call(getLeaveRequestOfEmployee, { employee, status, tenantId });
          const { statusCode, data: leaveRequests = [] } = response;
          if (statusCode !== 200) throw response;

          yield put({
            type: 'save',
            payload: { leaveRequests },
          });
          return response;
        }
        if (status === '') {
          const response = yield call(getLeaveRequestOfEmployee, { employee, tenantId });
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

    *fetchLeaveHistory({ employee = '', status = '' }, { call, put }) {
      try {
        const tenantId = getCurrentTenant();
        const response = yield call(getLeaveRequestOfEmployee, { employee, status, tenantId });
        const { statusCode, data: allMyLeaveRequests = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { allMyLeaveRequests },
        });
      } catch (errors) {
        dialog(errors);
      }
    },

    *fetchLeaveRequestById({ id = '' }, { call, put }) {
      try {
        const tenantId = getCurrentTenant();
        if (id !== '') {
          const response = yield call(getLeaveRequestById, { id, tenantId });
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
    *fetchHolidaysListBylocation({ payload = {} }, { call, put }) {
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
      let response;
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
    *removeLeaveRequestOnDatabase({ id = '' }, { call, put }) {
      try {
        const response = yield call(removeLeaveRequestOnDatabase, {
          id,
          tenantId: getCurrentTenant(),
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
    *fetchMyCompoffRequests({ status = [] }, { call, put }) {
      try {
        if (status !== '') {
          const response = yield call(getMyCompoffRequests, {
            status,
            tenantId: getCurrentTenant(),
          });
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
          const response = yield call(getMyCompoffRequests, {
            status,
            tenantId: getCurrentTenant(),
          });
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

    *withdrawCompoffRequest({ id = '' }, { call, put }) {
      try {
        if (id !== '') {
          const response = yield call(withdrawCompoffRequest, { id, tenantId: getCurrentTenant() });
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
    *fetchTeamCompoffRequests({ status = [] }, { call, put }) {
      try {
        if (status !== '') {
          const response = yield call(getTeamCompoffRequests, {
            status,
            tenantId: getCurrentTenant(),
          });
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
          const response = yield call(getTeamCompoffRequests, { tenantId: getCurrentTenant() });
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
          const response = yield call(getTeamLeaveRequests, {
            status,
            tenantId: getCurrentTenant(),
          });
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
          const response = yield call(getTeamLeaveRequests, { tenantId: getCurrentTenant() });
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
    *reportingManagerApprove({ payload = {} }, { call, put }) {
      try {
        const response = yield call(reportingManagerApprove, {
          ...payload,
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data: { leaveRequest = {} } = {} } = response;
        if (statusCode !== 200) throw response;
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
    *reportingManagerReject({ payload = {} }, { call, put }) {
      try {
        const response = yield call(reportingManagerReject, {
          ...payload,
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data: { leaveRequest = {} } = {} } = response;
        if (statusCode !== 200) throw response;
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

    *approveMultipleTimeoffRequest({ payload = {} }, { call }) {
      try {
        const response = yield call(approveMultipleTimeoffRequest, {
          ...payload,
          tenantId: getCurrentTenant(),
        });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        return statusCode;
      } catch (errors) {
        dialog(errors);
        return {};
      }
    },
    *rejectMultipleTimeoffRequest({ payload = {} }, { call }) {
      try {
        const response = yield call(rejectMultipleTimeoffRequest, {
          ...payload,
          tenantId: getCurrentTenant(),
        });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
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
        });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
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
        });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        return statusCode;
      } catch (errors) {
        dialog(errors);
      }
      return 0;
    },
    *managerApproveWithdrawRequest({ payload = {} }, { call, put }) {
      try {
        const response = yield call(managerApproveWithdrawRequest, {
          ...payload,
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data: { leaveRequest = {} } = {} } = response;
        if (statusCode !== 200) throw response;
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
      }
      return 0;
    },
    *managerRejectWithdrawRequest({ payload = {} }, { call, put }) {
      try {
        const response = yield call(managerRejectWithdrawRequest, {
          ...payload,
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data: { leaveRequest = {} } = {} } = response;
        if (statusCode !== 200) throw response;
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
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
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
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
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
    *getCountryList(_, { call, put }) {
      try {
        const response = yield call(getCountryList);
        const { statusCode, data: countryList = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { countryList },
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
    *updateEmployeeSchedule({ payload = {} }, { call, put }) {
      try {
        const response = yield call(updateEmployeeSchedule, {
          ...payload,
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data: updateSchedule = {} } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message: 'Update  Successfully',
        });
        yield put({
          type: 'save',
          payload: { updateSchedule },
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
