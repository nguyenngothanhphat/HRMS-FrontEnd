import { notification } from 'antd';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import { dialog } from '@/utils/utils';
import {
  addTicket,
  deleteOneTicket,
  addChat,
  updateTicket,
  getTicketById,
  getListEmployee,
  getOffAllTicketList,
  getDepartmentList,
  getOffToTalList,
  getLocationList,
  uploadFile,
  getSupportTeamList,
  getListMyTeam,
  getLocationsOfCountries,
} from '../services/ticketsManagement';

const ticketManagement = {
  namespace: 'ticketManagement',
  state: {
    listOffAllTicket: [],
    currentStatus: [],
    totalStatus: [],
    totalList: [],
    totalAll: [],
    listEmployee: [],
    listDepartment: [],
    locationsList: [],
    ticketDetail: {},
    employeeRaiseList: [],
    employeeAssignedList: [],
    filter: {},
    selectedLocations: [],
    isLocationLoaded: false,
    supportTeamList: [],
    employeeFilterList: [],
    cancelRequestData: {
      [cancelRequestTypes.listOffAllTicket]: null,
    },
    locationsOfCountries: [],
  },
  effects: {
    *addTicket({ payload }, { call }) {
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
    *updateTicket({ payload }, { call, put }) {
      let response;
      try {
        response = yield call(updateTicket, {
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
      } catch (error) {
        dialog(error);
      }
      return response;
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
        const { selectedLocations } = yield select((state) => state.ticketManagement);
        let tempPayload = {
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
          ...payload,
        };
        if (selectedLocations && selectedLocations.length > 0) {
          tempPayload = {
            ...tempPayload,
            location: selectedLocations,
          };
        }
        response = yield call(getOffAllTicketList, tempPayload);
        if (response) {
          const { statusCode, data = [], total = [] } = response;
          if (statusCode !== 200) throw response;
          yield put({
            type: 'save',
            payload: { listOffAllTicket: data, currentStatus: payload.status, totalStatus: total },
          });
        }
      } catch (error) {
        dialog(error);
      }
      return response;
    },
    *fetchToTalList({ payload }, { call, put, select }) {
      try {
        const { selectedLocations } = yield select((state) => state.ticketManagement);
        let tempPayload = {
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
          ...payload,
        };
        if (selectedLocations && selectedLocations.length > 0) {
          tempPayload = {
            ...tempPayload,
            location: selectedLocations,
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
    *searchEmployee({ payload }, { call, put }) {
      try {
        const response = yield call(getListMyTeam, {
          ...payload,
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { employeeFilterList: data },
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
      try {
        const response = yield call(getListEmployee, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
          status: 'ACTIVE',
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { employeeRaiseList: data },
        });
      } catch (error) {
        dialog(error);
      }
    },
    *fetchEmployeeAssignedListEffect({ payload }, { call, put }) {
      try {
        const response = yield call(getListEmployee, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
          status: 'ACTIVE',
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { employeeAssignedList: data },
        });
      } catch (error) {
        dialog(error);
      }
    },
    *fetchSupportTeamList({ payload }, { call, put }) {
      let response;
      try {
        response = yield call(getSupportTeamList, {
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
          ...payload,
        });
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { supportTeamList: data },
        });
      } catch (error) {
        dialog(error);
      }
      return response;
    },
    *deleteTicketEffect({ payload }, { call }) {
      let response = {};
      try {
        response = yield call(deleteOneTicket, {
          ...payload,
          tenantId: getCurrentTenant(),
        });
        // eslint-disable-next-line no-shadow
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
    *getLocationsOfCountriesEffect({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getLocationsOfCountries, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;

        yield put({
          type: 'save',
          payload: { locationsOfCountries: data },
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
