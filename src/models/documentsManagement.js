import { dialog } from '@/utils/utils';
import { notification } from 'antd';
import {
  getListDocuments,
  getDocumentDetail,
  uploadDocument,
  addVisa,
  addPassport,
  getCountryList,
  getEmployeeByShortId,
  deleteDocument,
  getGeneralInfo,
  updateGeneralInfo,
  getAdhaarCard,
  addAdhaarCard,
  updateAdhaarCard,
} from '../services/documentsManagement';

const documentsManagement = {
  namespace: 'documentsManagement',
  state: {
    listDocuments: [],
    listDocumentDetail: [],
    uploadedDocument: [],
    employeeDetail: {},
    uploadedVisa: [],
    uploadedPassport: [],
    countryList: [],
    adhaarCardDetail: {},
    generalInfoId: '',
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

    // *fetchEmployeeDetail({ payload: id = '' }, { call, put }) {
    //   try {
    //     const response = yield call(getEmployeeData, { id });
    //     const { statusCode, data: employeeDetail = [] } = response;
    //     if (statusCode !== 200) throw response;
    //     yield put({ type: 'save', payload: { employeeDetail } });
    //   } catch (errors) {
    //     // dialog(errors);
    //   }
    // },

    *clearDocumentDetail(_, { put }) {
      try {
        yield put({ type: 'save', payload: { listDocumentDetail: [] } });
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
    *fetchEmployeeDetailByShortId({ employeeId = {} }, { call, put }) {
      try {
        const response = yield call(getEmployeeByShortId, { employeeId });
        const { statusCode, data: employeeDetail = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { employeeDetail },
        });
        return response;
      } catch (errors) {
        // dialog(errors);
        return '';
      }
    },

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
        // console.log('data add visa', data);
        const { statusCode = '', data: uploadedVisa = [] } = response;
        // console.log('added visa', response);
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { uploadedVisa } });
        notification.success({ message: 'Add Visa document successfully! Refreshing page...' });
        return statusCode;
      } catch (errors) {
        dialog(errors);
        return '';
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
        // console.log('data add passport', data);
        const response = yield call(addPassport, {
          passportNumber,
          passportIssuedCountry,
          passportIssuedOn,
          passportValidTill,
          employee,
          document,
        });
        const { statusCode = '', data: uploadedPassport = [] } = response;
        // console.log('added passport', response);
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { uploadedPassport } });
        notification.success({ message: 'Add Passport document successfully! Refreshing page...' });
        return statusCode;
      } catch (errors) {
        dialog(errors);
        return '';
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
        // console.log('upload document res', response);
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { uploadedDocument } });
        return uploadedDocument;
      } catch (errors) {
        dialog(errors);
        return '';
      }
    },
    *deleteDocument({ id }, { call }) {
      try {
        const response = yield call(deleteDocument, {
          id,
        });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
      } catch (errors) {
        dialog(errors);
      }
    },

    // ADHAAR CARD
    *fetchGeneralInfo({ employee = '' }, { call, put }) {
      try {
        const response = yield call(getGeneralInfo, { employee });
        const { statusCode, data: generalInfo = {} } = response;
        if (statusCode !== 200) throw response;
        // eslint-disable-next-line no-console
        console.log('fetch general info success', response);
        const { _id } = generalInfo;
        yield put({ type: 'save', payload: { generalInfoId: _id } });
      } catch (errors) {
        dialog(errors);
      }
    },

    *updateGeneralInfo(
      { payload: { id = '', document = '', adhaarCardNumber = '' } },
      { call, put },
    ) {
      try {
        const response = yield call(updateGeneralInfo, { id, document, adhaarCardNumber });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        // eslint-disable-next-line no-console
        console.log('update General Info success');
        return statusCode;
      } catch (errors) {
        dialog(errors);
        return '';
      }
    },

    *fetchAdhaarCard({ employee = '' }, { call, put }) {
      try {
        const response = yield call(getAdhaarCard, { employee });
        const { statusCode, data: adhaarCardDetail = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { adhaarCardDetail } });
        // eslint-disable-next-line no-console
        console.log('get employee success', response);
      } catch (errors) {
        dialog(errors);
      }
    },

    *updateAdhaarCard({ payload = {} }, { call }) {
      try {
        const { id = '', document = '', adhaarNumber = '' } = payload;
        const response = yield call(updateAdhaarCard, { id, document, adhaarNumber });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        // eslint-disable-next-line no-console
        console.log('update adhaar card success');
        return statusCode;
      } catch (errors) {
        dialog(errors);
        return '';
      }
    },

    *addAdhaarCard({ payload = {} }, { call }) {
      try {
        const { employee = '', document = '', adhaarNumber = '' } = payload;
        const response = yield call(addAdhaarCard, { employee, document, adhaarNumber });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        // eslint-disable-next-line no-console
        console.log('add adhaar card success');
        return statusCode;
      } catch (errors) {
        dialog(errors);
        return '';
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
