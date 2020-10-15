import { dialog } from '@/utils/utils';
import { getListDocuments, getDocumentDetail } from '../services/documentsManagement';

const documentsManagement = {
  namespace: 'documentsManagement',
  state: {
    listDocuments: [],
  },
  effects: {
    *fetchListDocuments(_, { call, put }) {
      try {
        const response = yield call(getListDocuments);
        const { statusCode, data: listDocuments = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'listDocuments', payload: { listDocuments } });
      } catch (errors) {
        dialog(errors);
      }
    },

    *fetchDocumentDetail({ payload: id = '' }, { call, put }) {
      try {
        const response = yield call(getDocumentDetail, { id });
        const { statusCode, data: listDocumentDetail = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'listDocumentDetail', payload: { listDocumentDetail } });
      } catch (errors) {
        dialog(errors);
      }
    },
  },
  reducers: {
    listDocuments(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    listDocumentDetail(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
export default documentsManagement;
