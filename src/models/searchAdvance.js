import { dialog } from '@/utils/utils';
import {
  searchAdvance,
  searchByCategory,
  getHistorySearch,
  updateSearchHistory,
} from '../services/searchAdvance';

export default {
  namespace: 'searchAdvance',
  state: {
    result: {},
    resultByCategory: [],
    historySearch: {},
  },
  effects: {
    *search({ payload = {} }, { call, put, select }) {
      const { historySearch = {} } = yield select((state) => state.searchAdvance);
      const { currentUser: { employee: { _id } = {} } = {} } = yield select((state) => state.user);
      try {
        const response = yield call(searchAdvance, payload);
        const { statusCode, data: result = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { result } });
        // handle history search:
        const { keySearch = '' } = payload;
        const { employees = [] } = result;
        const { key = [] } = historySearch;
        const newListHistoryKeyword = [keySearch, ...key];
        const listFilterKeyword = newListHistoryKeyword
          .filter((value, index, self) => self.findIndex((s) => s === value) === index)
          .slice(0, 3);
        const history = {
          employee: _id,
          key: listFilterKeyword,
          dataSearch: { employee: employees.slice(0, 4), employeeDoc: [] },
        };
        yield put({ type: 'updateSearchHistory', payload: history });
      } catch (errors) {
        dialog(errors);
      }
    },
    *searchByCategory(_, { call, put }) {
      try {
        const response = yield call(searchByCategory);
        const { statusCode, data: resultByCategory = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { resultByCategory } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *getHistorySearch(_, { call, put, select }) {
      const { currentUser: { employee: { _id } = {} } = {} } = yield select((state) => state.user);
      try {
        const response = yield call(getHistorySearch, { employee: _id });
        const { statusCode, data: historySearch = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { historySearch } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *updateSearchHistory({ payload }, { call, put }) {
      try {
        const response = yield call(updateSearchHistory, payload);
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'getHistorySearch' });
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
