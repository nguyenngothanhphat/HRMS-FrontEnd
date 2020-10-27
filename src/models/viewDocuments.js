import { dialog } from '@/utils/utils';
import { getDocumentById } from '../services/viewDocument';

const viewDocument = {
  namespace: 'viewDocument',
  state: {
    documentDetail: {},
  },
  effects: {
    *fetchViewingDocumentDetail({ payload: { id = '' } = {} }, { call, put }) {
      try {
        const response = yield call(getDocumentById, {
          id,
        });
        const { statusCode, data: documentDetail = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { documentDetail },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *removeViewingDocumentDetail(_, { put }) {
      try {
        yield put({
          type: 'save',
          payload: { documentDetail: {} },
        });
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

export default viewDocument;
