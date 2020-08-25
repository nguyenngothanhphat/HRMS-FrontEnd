import { notification } from 'antd';
import router from 'umi/router';
import { formatMessage } from 'umi-plugin-react/locale';
import {
  queryCustomer,
  submitCustomer,
  deleteCustomer,
  getCustomerById,
} from '@/services/customer';
import { dialog } from '@/utils/utils';

export default {
  namespace: 'customer',

  state: {
    listCustomer: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      try {
        const response = yield call(queryCustomer, payload);
        const { statusCode, data: listCustomer } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { listCustomer } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchByAssign(_, { call, put }) {
      try {
        const response = yield call(queryCustomer, { method: 'list-assign' });
        const { statusCode, data: listCustomer } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { listCustomer } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchItem({ payload }, { call, put }) {
      let item = {};
      try {
        if (payload) {
          const response = yield call(getCustomerById, { id: payload });
          const { statusCode, data } = response;
          if (statusCode !== 200) throw response;
          item = data;
        }
      } catch (errors) {
        dialog(errors);
      } finally {
        yield put({
          type: 'save',
          payload: { item },
        });
      }
    },
    *saveCustomer({ payload }, { put, call }) {
      try {
        const response = yield call(submitCustomer, payload);
        const { data: customer = {}, statusCode } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message: formatMessage({ id: 'customer.submit.success' }),
        });
        yield put({
          type: 'save',
          payload: {
            customer,
          },
        });
        yield call(router.push, '/customer');
        yield put({ type: 'fetch' });
      } catch (errors) {
        dialog(errors);
      }
    },
    *deleteCustomer(
      {
        payload: { id },
      },
      { put, call }
    ) {
      try {
        const response = yield call(deleteCustomer, { id });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message: formatMessage({ id: 'customer.remove.success' }),
        });
        yield call(router.push, '/customer');
        yield put({ type: 'fetch' });
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
