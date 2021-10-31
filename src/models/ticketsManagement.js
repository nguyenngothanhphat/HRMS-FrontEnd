import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import { dialog } from '@/utils/utils';
import {
  addTicket,
  getListEmployee,
  getOffAllTicketList,
  getDepartmentList,
  getOffToTalList,
  getLocationList,
} from '../services/ticketsManagement';

const ticketManagement = {
  namespace: 'ticketManagement',
  state: {
    listOffAllTicket: [],
    totalList: [],
    totalAll: [],
    listEmployee: [],
    listDepartment: [],
    searchTicket: {
      listOffAllTicketSearch: [],
      locationList: [],
      isFilter: false,
    },
  },
  effects: {
    *addTicket({ payload }, { call, put }) {
      try {
        const response = yield call(addTicket, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const {
          statusCode,
          data: {},
        } = response;
      } catch (error) {
        dialog(error);
      }
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
          payload: { listOffAllTicket: data },
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
    *fetchListAllTicketSearch({ payload }, { call, put }) {
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
          type: 'saveSearch',
          payload: { listOffAllTicketSearch: data },
        });
      } catch (error) {
        dialog(error);
      }
      return response;
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
  },
};
export default ticketManagement;
