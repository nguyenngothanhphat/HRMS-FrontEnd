import getCountries, { getCurrencyList } from '@/services/api';
import { dialog } from '@/utils/utils';

export default {
  namespace: 'global',

  state: {
    collapsed: false,
    onClickMenu: false,
    currencies: {
      origin: [],
      filter: [],
    },
    countries: {
      origin: [],
      filter: [],
    },
  },

  effects: {
    *fetchCurrency({ payload: keyword }, { put, call, select }) {
      try {
        const { currencies } = yield select(st => st.global);
        let { origin } = currencies;
        if (origin.length === 0) origin = yield call(getCurrencyList);
        let filter = origin;
        if (typeof keyword === 'string') {
          if (keyword === '') filter = origin;
          else
            filter = filter
              .filter(cur => {
                let { code, name } = cur;
                const key = keyword.toLowerCase();
                code = code.toLowerCase();
                name = name.toLowerCase();
                return code.indexOf(key) > -1 || name.indexOf(key) > -1;
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
    *fetchCountries({ payload: keyword }, { put, call, select }) {
      try {
        const { countries } = yield select(st => st.global);
        let { origin } = countries;
        if (origin.length === 0) origin = yield call(getCountries);
        let filter = origin;
        if (typeof keyword === 'string') {
          if (keyword === '') filter = origin;
          else
            filter = origin
              .filter(country => {
                let { nativeName, name, alpha2Code } = country;
                const key = keyword.toLowerCase();
                nativeName = nativeName.toLowerCase();
                name = name.toLowerCase();
                alpha2Code = alpha2Code.toLowerCase();
                return (
                  nativeName.indexOf(key) > -1 ||
                  name.indexOf(key) > -1 ||
                  alpha2Code.indexOf(key) > -1
                );
              })
              .sort(item => (item.alpha2Code === keyword ? -1 : 1));
        }
        filter = filter.slice(0, 20);
        yield put({ type: 'save', payload: { countries: { origin, filter } } });
        return filter;
      } catch (errors) {
        dialog(errors);
      }
      return [];
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
  },

  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
