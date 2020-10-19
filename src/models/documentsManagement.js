import { dialog } from '@/utils/utils';
import {
  getListDocuments,
  getDocumentDetail,
  uploadDocument,
  getEmployeeData,
  addVisa,
  addPassport,
  getCountryList,
} from '../services/documentsManagement';

const documentsManagement = {
  namespace: 'documentsManagement',
  state: {
    listDocuments: [],
    listDocumentDetail: [],
    uploadedDocument: [],
    employeeDetail: [],
    uploadedVisa: [],
    uploadedPassport: [],
    countryList: [],
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

    // upload visa, passport, document
    *fetchCountryList(_, { call, put }) {
      try {
        const response = yield call(getCountryList);
        const { statusCode, data: countryList = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { countryList },
        });
      } catch (errors) {
        dialog(errors);
      }
    },

    *addVisa({ data }, { call, put }) {
      try {
        const {
          visaNumber = '',
          visaIssuedCountry = '',
          visaIssuedOn = '',
          visaValidTill = '',
          visaType = '',
          visaEntryType = '',
          document = '',
          employee = '',
        } = data;
        const response = yield call(addVisa, {
          visaNumber,
          visaIssuedCountry,
          visaIssuedOn,
          visaValidTill,
          visaType,
          visaEntryType,
          document,
          employee,
        });
        console.log('data add visa', data);
        const { statusCode, data: uploadedVisa = [] } = response;
        console.log('added visa', response);
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { uploadedVisa } });
      } catch (errors) {
        dialog(errors);
      }
    },

    *addPassport({ data }, { call, put }) {
      try {
        const {
          passportNumber = '',
          passportIssuedCountry = '',
          passportIssuedOn = '',
          passportValidTill = '',
          employee = '',
          document = '',
        } = data;
        console.log('data add passport', data);
        const response = yield call(addPassport, {
          passportNumber,
          passportIssuedCountry,
          passportIssuedOn,
          passportValidTill,
          employee,
          document,
        });
        const { statusCode, data: uploadedPassport = [] } = response;
        console.log('added passport', response);
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { uploadedPassport } });
      } catch (errors) {
        dialog(errors);
      }
    },

    *uploadDocument({ data }, { call, put }) {
      try {
        const {
          key = '',
          employeeGroup = '',
          parentEmployeeGroup = '',
          attachment = '',
          employee = '',
        } = data;

        const response = yield call(uploadDocument, {
          key, // file name
          employeeGroup,
          parentEmployeeGroup,
          attachment,
          employee,
        });

        const { statusCode, data: uploadedDocument = [] } = response;
        console.log('upload document res', response);
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { uploadedDocument } });
        return uploadedDocument;
      } catch (errors) {
        dialog(errors);
        return 'hehe';
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
