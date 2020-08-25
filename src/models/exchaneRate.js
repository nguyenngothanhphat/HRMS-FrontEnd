/* eslint-disable consistent-return */
import { log } from 'util';
import queryExchangeRate, { getSupportExchange } from '@/services/exchange';
import { dialog } from '@/utils/utils';

export default {
  namespace: 'exchangeRate',

  state: {
    rate: {},
    original: undefined,
    currency: undefined,
    reference: [],
  },

  effects: {
    *fetchRate(
      {
        payload: { original, byPass = false, date = '' },
      },
      { call, put, select }
    ) {
      const { currency } = yield select(state => state.exchangeRate);
      if (original !== currency || byPass === true) {
        let {
          rate: { code, val },
        } = yield select(state => state.exchangeRate) || {};
        try {
          const response = yield call(queryExchangeRate, { fr: original, to: currency, date }) ||
            {};
          const { statusCode } = response;
          if (statusCode !== 200) throw response;
          const {
            data: { code: newCode, val: newVal },
          } = response;
          code = newCode;
          val = newVal;
        } catch (errors) {
          dialog(errors);
        }
        yield put({
          type: 'save',
          payload: { rate: { code, val } },
        });
      } else yield put({ type: 'save', payload: { rate: { val: 1 } } });
      return yield select(state => {
        const {
          exchangeRate: {
            rate: { val },
          },
        } = state;
        return val;
      });
    },
    *fetchSupport(payload, { call, put }) {
      try {
        const response = yield call(getSupportExchange, { payload }) || {};
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: {
            ...data,
          },
        });
      } catch (errors) {
        log(errors.message);
      }
    },
    // Web App:
    *fetchRateByDate(payload, { call, put }) {
      try {
        const response = yield call(queryExchangeRate, payload.payload);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: {
            ...data,
          },
        });
        return data.val;
      } catch (errors) {
        log(errors.message);
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
