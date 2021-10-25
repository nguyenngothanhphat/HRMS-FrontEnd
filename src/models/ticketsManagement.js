import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import { dialog } from '@/utils/utils';
import {
  addTicket,
  getListEmployee,
  getOffAllTicketList,
  getDepartmentList,
} from '../services/ticketsManagement';

const ticketManagement = {
  namespace: 'ticketManagement',
  state: {
    listOffAllTicket: [],
    totalList: [],
    totalAll: [],
    listEmployee: [],
    listDepartment: [],
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
      try {
        const response = yield call(getOffAllTicketList, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { listOffAllTicket, totalList, totalAll },
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
export default ticketManagement;
