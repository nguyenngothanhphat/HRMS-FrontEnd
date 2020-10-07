import { dialog } from '@/utils/utils';
import {
  getListDocumentsActive,
  getListDocumentsInActive,
  getDocumentDetail,
} from '../services/documentsManagement';

const documentsManagement = {
  namespace: 'documentsManagement',
  state: {
    listDocumentsActive: [],
    listDocumentsInActive: [],
  },
  effects: {
    *fetchListDocumentsActive(_, { call, put }) {
      try {
        const response = yield call(getListDocumentsActive);
        const { statusCode, data: listDocumentsActive = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'listDocumentsActive', payload: { listDocumentsActive } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchListDocumentsInActive(_, { call, put }) {
      try {
        const response = yield call(getListDocumentsInActive);
        const { statusCode, data: listDocumentsInActive = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'listDocumentsInActive', payload: { listDocumentsInActive } });
      } catch (errors) {
        dialog(errors);
      }
    },

    *fetchDocumentDetail({ payload: documentId = '' }, { call, put }) {
      try {
        const response = yield call(getDocumentDetail, { documentId });
        const { statusCode, data: listDocumentDetail = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'listDocumentDetail', payload: { listDocumentDetail } });
      } catch (errors) {
        dialog(errors);
      }
    },
  },
  reducers: {
    listDocumentsActive(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    listDocumentsInActive(state, action) {
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
