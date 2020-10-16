import { dialog } from '@/utils/utils';
import {
  getListDocuments,
  getDocumentDetail,
  uploadDocument,
  getEmployeeData,
} from '../services/documentsManagement';

const documentsManagement = {
  namespace: 'documentsManagement',
  state: {
    listDocuments: [],
    listDocumentDetail: [],
    uploadedDocument: [],
    employeeDetail: [],
  },
  effects: {
    *fetchListDocuments(_, { call, put }) {
      try {
        const response = yield call(getListDocuments);
        const { statusCode, data: listDocuments = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { listDocuments } });
      } catch (errors) {
        dialog(errors);
      }
    },

    *fetchDocumentDetail({ payload: id = '' }, { call, put }) {
      try {
        const response = yield call(getDocumentDetail, { id });
        const { statusCode, data: listDocumentDetail = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { listDocumentDetail } });
      } catch (errors) {
        dialog(errors);
      }
    },

    *fetchEmployeeDetail({ payload: id = '' }, { call, put }) {
      try {
        const response = yield call(getEmployeeData, { id });
        const { statusCode, data: employeeDetail = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { employeeDetail } });
      } catch (errors) {
        // dialog(errors);
      }
    },

    *clearEmployeeDetail(_, { put }) {
      try {
        yield put({ type: 'save', payload: { employeeDetail: [] } });
      } catch (errors) {
        // dialog(errors);
      }
    },

    *uploadDocument(
      { key = '', attachment = '', employeeGroup = '', parentEmployeeGroup = '', employee = '' },
      { call, put },
    ) {
      try {
        const response = yield call(uploadDocument, {
          key,
          attachment,
          employeeGroup,
          parentEmployeeGroup,
          employee,
        });
        const { statusCode, data: uploadedDocument = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { uploadedDocument } });
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
export default documentsManagement;
