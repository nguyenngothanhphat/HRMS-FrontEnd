import { notification } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import {
  queryCard,
  submitCard,
  deleteCard,
  getCardById,
  getCardByUser,
  getCardForEmployee,
  fetchByAssignForEmployee,
} from '@/services/creditCard';
import { dialog } from '@/utils/utils';

export default {
  namespace: 'creditCard',

  state: {
    listCard: [],
    listUserCard: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      try {
        const response = yield call(queryCard, payload);
        const { statusCode, data: listCard } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { listCard } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchByAssign(_, { call, put }) {
      try {
        const response = yield call(queryCard, { method: 'list-assign' });
        const { statusCode, data: listCard } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { listCard } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchItem({ payload }, { call, put }) {
      let item = {};
      try {
        if (payload) {
          const response = yield call(getCardById, { id: payload });
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
    *fetchListByUser({ payload }, { call, put }) {
      try {
        const response = yield call(getCardByUser, payload);
        const { statusCode, data: listUserCard } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { listUserCard } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *saveCard({ payload }, { put, call }) {
      try {
        const response = yield call(submitCard, payload);
        const { data: card = {}, statusCode } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message: formatMessage({ id: 'creditCard.submit.success' }),
        });
        yield put({
          type: 'save',
          payload: {
            card,
          },
        });
        return true;
      } catch (errors) {
        dialog(errors);
        return false;
      }
    },
    *deleteCard(
      {
        payload: { id },
      },
      { call }
    ) {
      try {
        const response = yield call(deleteCard, { id });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message: formatMessage({ id: 'creditCard.remove.success' }),
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchForEmployee({ payload }, { call, put }) {
      try {
        const response = yield call(getCardForEmployee, payload);
        const { statusCode, data: listCard } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { listCard } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchByAssignForEmployee({ payload }, { call, put }) {
      try {
        const response = yield call(fetchByAssignForEmployee, payload);
        const { statusCode, data: listCard } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { listCard } });
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
