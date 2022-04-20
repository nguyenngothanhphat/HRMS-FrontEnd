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
    locationsList: [],
    ticketDetail: {},
    employeeRaiseList: [],
    employeeAssigneeList: [],
    filter: {},
    selectedLocations: [],
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
          type: 'refreshListAllTicket',
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
    *refreshListAllTicket({ payload }, { call, put, select }) {
      try {
        const { departmentPayload } = yield select((state) => state.ticketManagement);

        let tempPayload = {
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
          ...payload,
        };
        if (departmentPayload && departmentPayload.length > 0) {
          tempPayload = {
            ...tempPayload,
            department: departmentPayload,
          };
        }

        const response = yield call(getOffAllTicketList, tempPayload);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        const ticketList = data.filter((val) => val.status === 'New');
        yield put({
          type: 'save',
          payload: { listOffAllTicket: ticketList },
        });
        yield put({
          type: 'fetchToTalList',
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
          type: 'refreshListAllTicket',
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
    *fetchListAllTicket({ payload }, { call, put, select }) {
      let response;
      try {
        const { departmentPayload } = yield select((state) => state.ticketManagement);
        let tempPayload = {
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
          ...payload,
        };
        if (departmentPayload && departmentPayload.length > 0) {
          tempPayload = {
            ...tempPayload,
            department: departmentPayload,
          };
        }
        response = yield call(getOffAllTicketList, tempPayload);
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
    *fetchToTalList({ payload }, { call, put, select }) {
      try {
        const { departmentPayload } = yield select((state) => state.ticketManagement);
        let tempPayload = {
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
          ...payload,
        };
        if (departmentPayload && departmentPayload.length > 0) {
          tempPayload = {
            ...tempPayload,
            department: departmentPayload,
          };
        }

        const response = yield call(getOffToTalList, tempPayload);
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
    *fetchDepartments({ payload }, { call, put }) {
      let res = {};
      try {
        res = yield call(getDepartmentList, {
          ...payload,
        });
        const { statusCode, data } = res;
        if (statusCode !== 200) throw res;
        yield put({
          type: 'save',
          payload: { listDepartment: data },
        });
      } catch (error) {
        dialog(error);
      }
      return res;
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
    *fetchLocationList({ payload = {} }, { call, put }) {
      try {
        const response = yield call(getLocationList, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data: locationsList = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { locationsList } });
        return response;
      } catch (errors) {
        dialog(errors);
        return {};
      }
    },

    *fetchEmployeeRaiseListEffect({ payload }, { call, put }) {
      let response;
      try {
        const tempPayload = {
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
          ...payload,
        };
        response = yield call(getOffAllTicketList, tempPayload);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { employeeRaiseList: data, currentStatus: payload.status },
        });
      } catch (error) {
        dialog(error);
      }
      return response;
    },
    *fetchEmployeeAssigneeListEffect({ payload }, { call, put }) {
      let response;
      try {
        const tempPayload = {
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
          ...payload,
        };
        response = yield call(getOffAllTicketList, tempPayload);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { employeeAssigneeList: data, currentStatus: payload.status },
        });
      } catch (error) {
        dialog(error);
      }
      return response;
    },
  },
  reducers: {
    clearFilter(state) {
      return {
        ...state,
        filter: {},
      };
    },
    save(state, action) {
      return {
        ...state,
        ...action.payload,
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
