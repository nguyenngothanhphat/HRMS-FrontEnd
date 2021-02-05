import { dialog } from '@/utils/utils';
import { setHistorySearch, getHistorySearch } from '@/utils/historySearch';
import { searchAdvance, searchByCategory } from '../services/searchAdvance';

export default {
  namespace: 'searchAdvance',
  state: {
    result: {},
    resultByCategory: [],
    historySearch: getHistorySearch(),
  },
  effects: {
    *search({ payload = {} }, { call, put }) {
      try {
        const response = yield call(searchAdvance, payload);
        const { statusCode, data: result = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { result } });
        // handle history search localStorage:
        const { keySearch = '' } = payload;
        const { employees = [] } = result;
        const { key = [] } = getHistorySearch();
        const newListHistoryKeyword = [keySearch, ...key];
        const listFilterKeyword = newListHistoryKeyword
          .filter((value, index, self) => self.findIndex((s) => s === value) === index)
          .slice(0, 3);
        const history = { key: listFilterKeyword, data: employees.slice(0, 4) };
        setHistorySearch(history);
        yield put({ type: 'save', payload: { historySearch: history } });
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
