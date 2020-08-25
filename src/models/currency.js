import { notification } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import memoizeOne from 'memoize-one';
import { getList, getCurrency, queryCurrency, getSupportCurrencies } from '@/services/currency';
import { dialog } from '@/utils/utils';

const fetchCurrencyById = memoizeOne(getCurrency);

export default {
  namespace: 'currency',
  state: {
    list: [],
    item: null,
    currencies: {
      origin: [],
      filter: [],
    },
  },
  effects: {
    *fetch(_, { call, put }) {
      try {
        const response = yield call(getList);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { list: data } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *getSupportCurrencies({ payload: keyword }, { select, call, put }) {
      try {
        const { currencies } = yield select(st => st.currency);
        let { origin } = currencies;
        if (origin.length === 0) {
          const response = yield call(getSupportCurrencies);
          const { statusCode, data } = response;
          if (statusCode !== 200) throw origin;
          origin = data;
        }
        let filter = origin;
        if (Array.isArray(filter) && filter.length > 0 && typeof keyword === 'string') {
          if (keyword === '') filter = origin;
          else
            filter = filter
              .filter(cur => {
                let { _id, name } = cur;
                const key = keyword.toLowerCase();
                _id = _id.toLowerCase();
                name = name.toLowerCase();
                return _id.indexOf(key) > -1 || name.indexOf(key) > -1;
              })
              .sort(item => (item.code === keyword ? -1 : 1));
        }
        filter = filter.slice(0, 20);
        yield put({ type: 'save', payload: { currencies: { origin, filter } } });
        return filter;
      } catch (errors) {
        dialog(errors);
      }
      return [];
    },
    *fetchItem({ payload: id }, { call, put }) {
      let item;
      try {
        if (typeof id === 'string') {
          const response = yield call(fetchCurrencyById, id);
          const { statusCode, data } = response;
          if (statusCode !== 200) throw response;
          item = data;
        }
        yield put({ type: 'save', payload: { item } });
      } catch (errors) {
        dialog(errors);
      }
      return item;
    },
    *saveItem(
      {
        payload: { item, method },
      },
      { call }
    ) {
      try {
        const { _id: id, ...rest } = item;
        const response = yield call(queryCurrency, {
          id,
          method,
          ...rest,
        });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message: formatMessage({ id: 'currency.submit.success' }),
        });
        return true;
      } catch (errors) {
        dialog(errors);
      }
      return false;
    },
    *remove({ payload: id }, { call, put }) {
      try {
        const response = yield call(queryCurrency, {
          id,
          method: 'remove',
        });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        notification.success({ message: formatMessage({ id: 'currency.remove.success' }) });
        yield put({ type: 'fetch' });
      } catch (errors) {
        dialog(errors);
      }
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
