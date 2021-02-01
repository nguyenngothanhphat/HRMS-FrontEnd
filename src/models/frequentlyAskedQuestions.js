import {
  listFAQ,
  defaultList,
  addListFAQ,
  getbyCompany,
} from '@/services/frequentlyAskedQuestions';

import { dialog } from '@/utils/utils';

export default {
  namespace: 'frequentlyAskedQuestions',

  state: {
    list: [],
    listDefault: {},
    listQuestion: [],
    getListByCompany: {},
  },

  effects: {
    *getListFAQ({ payload }, { call, put }) {
      try {
        const response = yield call(listFAQ, payload);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { list: data } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *getListInit(_, { call, put }) {
      try {
        const response = yield call(defaultList);
        const { statusCode, data } = response;
        if (statusCode === 200) throw response;
        yield put({ type: 'save', payload: { listDefault: data } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *addListFAQ({ payload }, { call, put }) {
      try {
        const response = yield call(addListFAQ, payload);
        const { statusCode, data } = response;
        if (statusCode === 200) throw response;
        yield put({ type: 'save', payload: { listQuestion: data } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *getListByCompany({ payload }, { call, put }) {
      try {
        const response = yield call(getbyCompany, payload);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { getListByCompany: data } });
      } catch (errors) {
        // dialog(errors);
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
