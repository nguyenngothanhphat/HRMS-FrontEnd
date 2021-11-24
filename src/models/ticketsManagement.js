import { notification } from 'antd';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import { dialog } from '@/utils/utils';
import {
  addTicket,
  deleteTicketAll,
  addChat,
  updateTicket,
  getTicketById,
  getListEmployee,
  getOffAllTicketList,
  getDepartmentList,
  getOffToTalList,
  getLocationList,
  uploadFile,
} from '../services/ticketsManagement';

const ticketManagement = {
  namespace: 'ticketManagement',
  state: {
    listOffAllTicket: [],
    currentStatus: [],
    totalList: [],
    totalAll: [],
    listEmployee: [],
    listDepartment: [],
    searchTicket: {
      listOffAllTicketSearch: [],
      locationList: [],
      isFilter: false,
    },
    ticketDetail: {},
  },
  effects: {
    *addTicket({ payload }, { call, put }) {
      let response;
      try {
        response = yield call(addTicket, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        notification.success({ message: 'Raise Ticket Successfully' });
        yield put({
          type: 'refeshfetchListAllTicket',
          payload: {
            status: ['New'],
            tenantId: getCurrentTenant(),
            company: getCurrentCompany(),
          },
        });
      } catch (error) {
        dialog(error);
      }
      return response;
    },
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

    // Delete Ticket
    *deleteAll({ payload }, { call }) {
      try {
        const response = yield call(deleteTicketAll, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        notification.success({ message: 'Delete successfully' });
      } catch (error) {
        dialog(error);
      }
    },
    *refeshfetchListAllTicket({ payload }, { call, put }) {
      try {
        const response = yield call(getOffAllTicketList, payload);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        const ticketList = data.filter((val) => val.status === 'New');
        yield put({
          type: 'save',
          payload: { listOffAllTicket: ticketList },
        });
        yield put({
          type: 'fetchToTalList',
          payload: {
            payload: {},
            tenantId: getCurrentTenant(),
            company: getCurrentCompany(),
          },
        });
      } catch (error) {
        dialog(error);
      }
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
          payload: { ticketDetail: data.length > 0 ? data[0] : [] },
        });
        yield put({
          type: 'refeshfetchListAllTicket',
          payload: {
            status: ['New'],
            tenantId: getCurrentTenant(),
            company: getCurrentCompany(),
          },
        });
        yield put({
          type: 'fetchTicketByID',
          payload: {
            id: payload.id,
            tenantId: getCurrentTenant(),
            company: getCurrentCompany(),
          },
        });
      } catch (error) {
        dialog(error);
      }
    },
    *addChat({ payload }, { call, put }) {
      let response;
      try {
        response = yield call(addChat, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { ticketDetail: data.length > 0 ? data[0] : [] },
        });
        yield put({
          type: 'fetchTicketByID',
          payload: {
            id: payload.id,
            tenantId: getCurrentTenant(),
            company: getCurrentCompany(),
          },
        });
      } catch (error) {
        dialog(error);
      }
      return response;
    },
    *fetchListAllTicket({ payload }, { call, put }) {
      let response;
      try {
        response = yield call(getOffAllTicketList, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { listOffAllTicket: data, currentStatus: payload.status },
        });
      } catch (error) {
        dialog(error);
      }
      return response;
    },
    *fetchToTalList({ payload }, { call, put }) {
      try {
        const response = yield call(getOffToTalList, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { totalList: data },
        });
      } catch (error) {
        dialog(error);
      }
    },
    *fetchListEmployee({ payload }, { call, put }) {
      try {
        const response = yield call(getListEmployee, {
          ...payload,
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
    *fetchDepartments({ payload }, { call, put }) {
      try {
        const response = yield call(getDepartmentList, {
          ...payload,
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { listDepartment: data },
        });
      } catch (error) {
        dialog(error);
      }
    },

    *fetchTicketByID({ payload }, { call, put }) {
      let response;
      try {
        response = yield call(getTicketById, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        if (data) {
          yield put({
            type: 'save',
            payload: { ticketDetail: data },
          });
        }
      } catch (error) {
        dialog(error);
      }
      return response;
    },
    *fetchListAllTicketID({ payload }, { put }) {
      yield put({
        type: 'saveTicket',
        payload: { ticketDetail: payload },
      });
    },
    *fetchLocationList({ payload = {} }, { call, put }) {
      try {
        const newPayload = {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        };
        const response = yield call(getLocationList, newPayload);
        const { statusCode, data: locationList = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'saveSearch',
          payload: { locationList },
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
    saveSearch(state, action) {
      return {
        ...state,
        searchTicket: {
          ...state.searchTicket,
          ...action.payload,
        },
      };
    },
    saveTicket(state, action) {
      return {
        ...state,
        ticketDetail: {
          ...state.ticketDetail,
          ...action.payload,
        },
      };
    },
  },
};
export default ticketManagement;
