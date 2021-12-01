import { notification } from 'antd';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import { dialog } from '@/utils/utils';
import {
  addCategory,
  updateCategory,
  deleteCategory,
  addPolicy,
  updatePolicy,
  deletePolicy,
} from '../services/policiesRegulations';

const policiesRegulations = {
  namespace: 'policiesRegulations',
  state: {
    listCategory: [],
    listPolicy: [],
  },
  effect: {
    *addCategory({ payload }, { call, put }) {
      let response;
      try {
        response = yield call(addCategory, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        notification.success({ message: 'Add Category Successfully' });
        yield put({
          type: 'save',
          payload: {
            listCategory: data,
          },
        });
      } catch (error) {
        dialog(error);
      }
      return response;
    },
    *updateCategory({ payload }, { call, put }) {
      let response;
      try {
        response = yield call(updateCategory, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        notification.success({ message: 'Update Category Successfully' });
        yield put({
          type: 'save',
          payload: {
            listCategory: data,
          },
        });
      } catch (error) {
        dialog(error);
      }
      return response;
    },
    *deleteCategory({ payload }, { call, put }) {
      let response;
      try {
        response = yield call(deleteCategory, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        notification.success({ message: 'Delete Category Successfully' });
        yield put({
          type: 'save',
          payload: {
            listCategory: data,
          },
        });
      } catch (error) {
        dialog(error);
      }
      return response;
    },
    *addPolicy({ payload }, { call, put }) {
      let response;
      try {
        response = yield call(addPolicy, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        notification.success({ message: 'Add Policy Successfully' });
        yield put({
          type: 'save',
          payload: {
            listPolicy: data,
          },
        });
      } catch (error) {
        dialog(error);
      }
      return response;
    },
    *updatePolicy({ payload }, { call, put }) {
      let response;
      try {
        response = yield call(updatePolicy, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        notification.success({ message: 'Update Policy Successfully' });
        yield put({
          type: 'save',
          payload: {
            listPolicy: data,
          },
        });
      } catch (error) {
        dialog(error);
      }
      return response;
    },
    *deletePolicy({ payload }, { call, put }) {
      let response;
      try {
        response = yield call(deletePolicy, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        notification.success({ message: 'Delete Policy Successfully' });
        yield put({
          type: 'save',
          payload: {
            listPolicy: data,
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
  },
};
export default policiesRegulations;
