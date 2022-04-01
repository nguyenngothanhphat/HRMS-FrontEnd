import { notification } from 'antd';
import { getCurrentCompany, getCurrentLocation, getCurrentTenant } from '@/utils/authority';
import { dialog } from '@/utils/utils';
import {
  getOffboardingList,
  sendRequest,
  getList1On1,
  getapprovalflowList,
  getRequestById,
  getMeetingTime,
  getTemplateById,
  addCustomTemplate,
  getListRelieving,
  searchListRelieving,
  create1On1,
  teamRequestList,
  getListProjectByEmployee,
  complete1On1,
  reviewRequest,
  // sendMailExitPackage,
  getOffBoardingPackages,
  getListAssigned,
  getListAssignee,
  requestChangeLWD,
  handleRequestChangeLWD,
  handleWithdraw,
  handleWithdrawApproval,
  handleRelievingTemplateDraft,
  updateRelieving,
  sendOffBoardingPackage,
  removeOffBoardingPackage,
  terminateReason,
  sendClosePackage,
  closeEmplRecord,
  submitToHr,
  getListAssigneeHr,
  assignToHr,
  sendRequestUpdate,
} from '../services/offboarding';

const offboarding = {
  namespace: 'offboarding',
  state: {
    acceptedRequest: [],
    listOffboarding: [],
    listTeamRequest: [],
    request: [],
    sendrequest: false,
    listMyRequest: [],
    list1On1: [],
    approvalflow: [],
    listMeetingTime: [],
    listProjectByEmployee: [],
    itemNewCreate1On1: {},
    totalAll: [],
    totalList: [],
    totalListTeamRequest: [],
    showModalSuccessfully: false,
    relievingDetails: {},
    defaultExitPackage: [],
    defaultClosingPackage: [],
    customExitPackage: [],
    customClosingPackage: [],
    currentTemplate: {},
    listRelievingFormalities: [],
    inQueuesList: [],
    closeRecordsList: [],
    itemCreateScheduleInterview: {},
    listAssigned: [],
    listAssignee: [],
    hrManager: {},
    terminateData: {},
    listAssigneeHr: [],
  },
  effects: {
    // my request
    *fetchList({ payload }, { call, put }) {
      let response;
      try {
        response = yield call(getOffboardingList, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const {
          statusCode,
          data: { items: listOffboarding = [], total: totalList = [], hrManager = {} } = {},
          total: totalAll = 0,
        } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { listOffboarding, totalList, hrManager, totalAll },
        });
        return listOffboarding;
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    // team request
    *fetchListTeamRequest({ payload }, { call, put }) {
      try {
        const response = yield call(teamRequestList, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const {
          statusCode,
          data: {
            items: listTeamRequest = [],
            total: totalListTeamRequest = [],
            hrManager = {},
          } = {},
          total: totalAll = [],
        } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { listTeamRequest, totalListTeamRequest, hrManager, totalAll },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchAcceptedRequest({ payload }, { call, put }) {
      try {
        const response = yield call(getOffboardingList, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data: { items: acceptedRequest = [] } = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { acceptedRequest, totalAcceptedList: response.total },
        });
        return acceptedRequest;
      } catch (errors) {
        dialog(errors);
        return null;
      }
    },
    *sendRequest({ payload }, { call, put }) {
      let response;
      try {
        response = yield call(sendRequest, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data: request = [] } = response;

        if (statusCode !== 200) throw response;

        yield put({ type: 'save', payload: { request, sendrequest: true } });
        notification.success({ message: `Submit Request successfully!` });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },

    *sendRequestUpdate({ payload }, { call, put }) {
      let response;
      try {
        response = yield call(sendRequestUpdate, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data: request = [] } = response;

        if (statusCode !== 200) throw response;

        yield put({ type: 'save', payload: { request, sendrequest: true } });
        notification.success({ message: `Submit Request successfully!` });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *fetchRequestById({ payload }, { call, put }) {
      try {
        const response = yield call(getRequestById, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data = {} } = response;
        if (statusCode !== 200) throw response;
        const {
          item: { employee: { _id: employee } = {} } = {},
          item: myRequest = {},
          hrManager = {},
        } = data;
        yield put({ type: 'save', payload: { myRequest, hrManager: hrManager || {} } });
        yield put({
          type: 'getListProjectByEmployee',
          payload: { employee, company: getCurrentCompany(), tenantId: getCurrentTenant() },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *getList1On1({ payload }, { call, put }) {
      try {
        const response = yield call(getList1On1, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data: list1On1 = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { list1On1 } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchApprovalFlowList({ payload }, { call, put }) {
      try {
        const response = yield call(getapprovalflowList, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data: approvalflow = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { approvalflow } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *getMeetingTime(_, { call, put }) {
      try {
        const response = yield call(getMeetingTime);
        const { statusCode, data: listMeetingTime = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { listMeetingTime } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *create1On1({ payload, isEmployee = false }, { call, put }) {
      let response = {};
      try {
        response = yield call(create1On1, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data: itemNewCreate1On1 = {} } = response;
        if (statusCode !== 200) throw response;
        if (isEmployee) {
          notification.success({ message: `Create 1 on 1 successfully!` });
        }
        yield put({ type: 'save', payload: { itemNewCreate1On1 } });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *getListProjectByEmployee({ payload }, { call, put }) {
      try {
        const response = yield call(getListProjectByEmployee, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data: listProjectByEmployee = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { listProjectByEmployee } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *complete1On1({ payload }, { call }) {
      let response = {};
      try {
        response = yield call(complete1On1, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *reviewRequest({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(reviewRequest, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        const { id } = payload;
        yield put({
          type: 'fetchRequestById',
          payload: { id, company: getCurrentCompany(), tenantId: getCurrentTenant() },
        });
        yield put({ type: 'save', payload: { showModalSuccessfully: true } });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    // Relieving Formalities
    *fetchRelievingDetailsById({ payload }, { call, put }) {
      let response = {};
      const commonPayload = {
        company: getCurrentCompany(),
        tenantId: getCurrentTenant(),
      };
      try {
        if (!payload.packageType || payload.packageType === '') {
          yield call(getOffBoardingPackages, {
            ...commonPayload,
            offBoardingId: payload.id,
            templateType: 'DEFAULT',
            packageType: 'EXIT-PACKAGE',
          });
          yield call(getOffBoardingPackages, {
            offBoardingId: payload.id,
            ...commonPayload,
            templateType: 'DEFAULT',
            packageType: 'CLOSING-PACKAGE',
          });
          yield call(getOffBoardingPackages, {
            offBoardingId: payload.id,
            ...commonPayload,
            templateType: 'DEFAULT',
            packageType: 'EXIT-INTERVIEW-FEEDBACKS',
          });
        } else {
          const templateRes = yield call(getOffBoardingPackages, {
            offBoardingId: payload.id,
            ...commonPayload,
            templateType: 'DEFAULT',
            packageType: payload.packageType,
          });
          const { statusCode: templateStat } = templateRes;
          if (templateStat !== 200) throw templateRes;
          return templateRes;
        }

        response = yield call(getRequestById, { ...payload, ...commonPayload });
        const { statusCode, data = {} } = response;
        if (statusCode !== 200) throw response;
        const { item: relievingDetails = {} } = data;
        yield put({ type: 'save', payload: { relievingDetails } });
        return response;
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *getOffBoardingPackages({ payload }, { call, put }) {
      try {
        const response = yield call(getOffBoardingPackages, {
          ...payload,
          // company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        switch (payload.packageType) {
          case 'EXIT-PACKAGE':
            if (payload.templateType === 'DEFAULT') {
              yield put({ type: 'save', payload: { defaultExitPackage: data } });
            } else {
              yield put({ type: 'save', payload: { customExitPackage: data } });
            }
            break;
          case 'CLOSING-PACKAGE':
            if (payload.templateType === 'DEFAULT') {
              yield put({ type: 'save', payload: { defaultClosingPackage: data } });
            } else {
              yield put({ type: 'save', payload: { customClosingPackage: data } });
            }
            break;
          // case 'EXIT-INTERVIEW-FEEDBACKS':
          //   if (payload.templateType === 'DEFAULT') {
          //     yield put({ type: 'save', payload: { defaultClosingPackage: data } });
          //   } else {
          //     yield put({ type: 'save', payload: { customClosingPackage: data } });
          //   }
          //   break;
          default:
            break;
        }
      } catch (error) {
        dialog(error);
      }
    },
    *fetchTemplateById({ payload = {} }, { call, put }) {
      try {
        const response = yield call(getTemplateById, {
          ...payload,
          // company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { currentTemplate: data } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *addCustomTemplate({ payload = {} }, { call, put }) {
      let response = {};
      try {
        response = yield call(addCustomTemplate, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { newTemplate: data } });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *searchListRelieving({ payload = {} }, { call, put }) {
      let response = {};
      try {
        response = yield call(searchListRelieving, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
          location: [getCurrentLocation()],
        });
        const { relievingStatus } = payload;
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        switch (relievingStatus) {
          case 'CLOSE-RECORDS':
            yield put({ type: 'save', payload: { closeRecordsList: data.items } });
            break;
          case 'IN-QUEUES':
            yield put({ type: 'save', payload: { inQueuesList: data.items } });
            break;
          default:
            yield put({ type: 'save', payload: { listRelievingFormalities: data.items } });
            break;
        }
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *getListRelieving({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getListRelieving, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { relievingStatus } = payload;
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;
        switch (relievingStatus) {
          case 'CLOSE-RECORDS':
            yield put({ type: 'save', payload: { closeRecordsList: data.items } });
            break;
          case 'IN-QUEUES':
            yield put({ type: 'save', payload: { inQueuesList: data.items } });
            break;
          default:
            return null;
        }
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *getListAssigned(_, { call, put }) {
      try {
        const response = yield call(getListAssigned, {
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data: { items: listAssigned = [] } = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { listAssigned } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *getListAssignee({ payload = {} }, { call, put }) {
      try {
        const response = yield call(getListAssignee, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data = [] } = response;
        const listAssignee = data.map((item = {}) => {
          const { _id = '', generalInfo: { firstName = '', workEmail = '' } = {} } = item;
          return {
            _id,
            name: firstName,
            email: workEmail,
          };
        });
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { listAssignee } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *requestChangeLWD({ payload = {}, isUpdate = false }, { call, put }) {
      const { id = '' } = payload;
      let response = {};
      const message = !isUpdate ? 'Request Change LWD Successfully' : 'Edit Comment Successfully';
      try {
        response = yield call(requestChangeLWD, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        notification.success({ message });
        yield put({
          type: 'fetchRequestById',
          payload: { id, company: getCurrentCompany(), tenantId: getCurrentTenant() },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *handleRequestChangeLWD({ payload = {} }, { call }) {
      let response = {};
      try {
        response = yield call(handleRequestChangeLWD, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *handleWithdraw({ payload, isNotStatusAccepted = false }, { call, put }) {
      const newPayload = {
        ...payload,
        company: getCurrentCompany(),
        tenantId: getCurrentTenant(),
      };
      try {
        const response = yield call(handleWithdraw, newPayload);
        const { statusCode, message = '' } = response;
        if (statusCode !== 200) throw response;
        notification.success({ message });
        if (isNotStatusAccepted) {
          yield put({ type: 'fetchRequestById', payload: newPayload });
        }
      } catch (errors) {
        dialog(errors);
      }
    },
    *handleWithdrawApproval({ payload, isNotStatusAccepted = false }, { call, put }) {
      const newPayload = {
        ...payload,
        company: getCurrentCompany(),
        tenantId: getCurrentTenant(),
      };
      try {
        const response = yield call(handleWithdrawApproval, newPayload);
        const { statusCode, message = '' } = response;
        if (statusCode !== 200) throw response;
        notification.success({ message });
        if (isNotStatusAccepted) {
          yield put({ type: 'fetchRequestById', payload: newPayload });
        }
      } catch (errors) {
        dialog(errors);
      }
    },
    *saveOffBoardingPackage({ payload }, { call, put }) {
      try {
        const response = yield call(handleRelievingTemplateDraft, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { relievingDetails: data } });
        return statusCode;
      } catch (error) {
        dialog(error);
        return 0;
      }
    },
    *updateRelieving({ payload }, { call, put }) {
      try {
        const response = yield call(updateRelieving, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        notification.success({ message: `Move to relieving formalities successfully!` });
        yield put({ type: 'fetchListTeamRequest', payload: { status: 'ACCEPTED' } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *sendOffBoardingPackage({ payload }, { call, put }) {
      try {
        const response = yield call(sendOffBoardingPackage, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message: 'Exit interview package has been sent.',
        });
        const newRequest = yield call(getRequestById, {
          id: payload.ticketId,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode: newRequestStat, data = {} } = newRequest;
        if (newRequestStat !== 200) throw newRequest;
        const {
          item: relievingDetails = {},
          item: { exitPackage: { isSent: isSentEmailPackage = '' } } = {},
        } = data;
        yield put({ type: 'save', payload: { relievingDetails } });
        return isSentEmailPackage;
      } catch (error) {
        dialog(error);
      }

      return 0;
    },
    *sendClosePackage({ payload }, { call, put }) {
      try {
        const response = yield call(sendClosePackage, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        const newRequest = yield call(getRequestById, {
          id: payload.ticketId,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode: newRequestStat, data = {} } = newRequest;
        if (newRequestStat !== 200) throw newRequest;
        const { item: relievingDetails = {} } = data;
        yield put({ type: 'save', payload: { relievingDetails } });
      } catch (error) {
        dialog(error);
      }
    },
    *removeOffBoardingPackage({ payload }, { call, put }) {
      try {
        const response = yield call(removeOffBoardingPackage, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        const newRequest = yield call(getRequestById, {
          id: payload.offboardRequest,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode: newRequestStat, data = {} } = newRequest;
        if (newRequestStat !== 200) throw newRequest;
        const { item: relievingDetails = {} } = data;
        yield put({ type: 'save', payload: { relievingDetails } });
      } catch (error) {
        dialog(error);
      }
    },
    *terminateReason({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(terminateReason, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, message, data } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });

        yield put({ type: 'save', payload: { terminateData: data } });
      } catch (error) {
        dialog(error);
      }
      return response;
    },
    *closeEmployeeRecord({ payload }, { call }) {
      try {
        const response = yield call(closeEmplRecord, {
          ...payload,
          tenantId: getCurrentTenant(),
        });
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
      } catch (error) {
        dialog(error);
      }
    },
    *submitToHr(_, { call }) {
      try {
        const response = yield call(submitToHr, {
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
      } catch (error) {
        dialog(error);
      }
    },
    *getListAssigneeHr(_, { put, call }) {
      try {
        const response = yield call(getListAssigneeHr, {
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
          location: getCurrentLocation(),
        });
        const { statusCode, data: listAssigneeHr = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { listAssigneeHr },
        });
      } catch (error) {
        dialog(error);
      }
    },
    *assignToHr({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(assignToHr, {
          tenantId: getCurrentTenant(),
          ...payload,
        });
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        yield put({
          type: 'fetchListTeamRequest',
          payload: {
            location: [getCurrentLocation()],
          },
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
    saveCurrentTemplateSetting(state, action) {
      const { currentTemplate } = state;
      return {
        ...state,
        currentTemplate: {
          ...currentTemplate,
          ...action.payload,
        },
      };
    },
  },
};
export default offboarding;
