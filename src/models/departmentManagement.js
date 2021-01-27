import { dialog } from '@/utils/utils';
import {
  getListDefaultDepartment,
  getListDepartmentByCompany,
  upsertDepartment,
  removeDepartment,
} from '@/services/departmentManagement';
import { notification } from 'antd';

const departmentManagement = {
  namespace: 'departmentManagement',
  state: {
    listDefault: [],
    listByCompany: [],
  },
  effects: {
    *fetchListDefaultDepartment({ payload: { company = '' } = {} }, { call, put }) {
      try {
        const response = yield call(getListDefaultDepartment, { company });
        const { statusCode, data = [] } = response;
        const listDefault = data.map((item = {}) => item?.name) || [];
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { listDefault } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchListDepartmentByCompany({ payload: { company = '' } = {} }, { call, put }) {
      try {
        const response = yield call(getListDepartmentByCompany, { company });
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { listByCompany: data } });
      } catch (errors) {
        dialog(errors);
      }
    },

    *upsertDepartment({ payload: { listDepartment = [], company = '' } = {} }, { call, put }) {
      try {
        const response = yield call(upsertDepartment, { listDepartment });
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        yield put({ type: 'fetchListDepartmentByCompany', payload: { company } });
        yield put({
          type: 'user/fetchCurrent',
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *removeDepartment({ payload: { id = '', company = '' } = {} }, { call, put }) {
      try {
        const response = yield call(removeDepartment, { id });
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        yield put({ type: 'fetchListDepartmentByCompany', payload: { company } });
        yield put({
          type: 'user/fetchCurrent',
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
  },
};
export default departmentManagement;
