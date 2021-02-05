import { dialog } from '@/utils/utils';
import { searchAdvance, searchByCategory } from '../services/searchAdvance';

export default {
  namespace: 'searchAdvance',
  state: {
    result: {},
    resultByCategory: [],
    historyKeyword: [],
    historyEmployees: [],
  },
  effects: {
    *search({ payload = {} }, { call, put, select }) {
      try {
        const response = yield call(searchAdvance, payload);
        const { statusCode, data: result = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { result } });
        // handle history search:
        const { historyKeyword = [] } = yield select((state) => state.searchAdvance);
        const { keySearch = '' } = payload;
        const { employees = [] } = result;
        const historyEmployees = employees.slice(0, 4);
        const newListHistoryKeyword = [keySearch, ...historyKeyword];
        const listFilterKeyword = newListHistoryKeyword
          .filter((value, index, self) => self.findIndex((s) => s === value) === index)
          .slice(0, 3);
        yield put({
          type: 'save',
          payload: { historyKeyword: listFilterKeyword, historyEmployees },
        });
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
