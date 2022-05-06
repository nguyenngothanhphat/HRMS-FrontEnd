import { notification } from 'antd';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import { dialog } from '@/utils/utils';
import getCustomerInfo, {
  addDivision,
  addDocument,
  addNotes,
  filterDocument,
  filterNotes,
  getAuditTrail,
  getDivisions,
  getDivisionsId,
  getDocument,
  getDocumentType,
  getNotes,
  editCustomer,
  // project
  getProjectList,
  getTagList,
  removeDocument,
  updateContactInfo,
  updateDivision,
  uploadDocument,
} from '../services/customerProfile';
import {
  getDivisionList,
  getEmployeeList, // other
  getProjectTypeList,
  getProjectNameList,
  getProjectStatusList,
} from '../services/projectManagement';

const customerProfile = {
  namespace: 'customerProfile',
  state: {
    info: {},
    divisions: [],
    auditTrail: [],
    notes: [],
    originNotes: [],
    listTags: [],
    documents: [],
    documentType: [],
    fileURL: '',
    divisionId: '',
    temp: {
      selectedTab: '',
    },
    projectList: [],
    titleList: [],
    divisionList: [],
    employeeList: [],
    projectTypeList: [],
    projectNameList: [],
    projectStatusList: [],
  },
  effects: {
    *fetchCustomerInfo({ payload }, { call, put }) {
      try {
        const response = yield call(getCustomerInfo, {
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
          customerId: payload.id,
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { info: data } });
      } catch (error) {
        dialog(error);
      }
    },

    *generateDivisionId({ payload }, { call, put }) {
      try {
        const response = yield call(getDivisionsId, {
          tenantId: getCurrentTenant(),
          customerId: payload.id,
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { divisionId: data } });
      } catch (error) {
        dialog(error);
      }
    },

    *fetchDivision({ payload }, { call, put }) {
      try {
        const response = yield call(getDivisions, {
          tenantId: getCurrentTenant(),
          customerId: payload.id,
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { divisions: data } });
      } catch (error) {
        dialog(error);
      }
    },

    *addDivision({ payload }, { call, put }) {
      try {
        const response = yield call(addDivision, {
          tenantId: getCurrentTenant(),
          ...payload,
        });
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({ message });

        yield put({
          type: 'fetchDivision',
          payload: { tenantId: getCurrentTenant(), id: payload.customerId },
        });
      } catch (error) {
        dialog(error);
      }
    },

    *updateDivision({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(updateDivision, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({ message });

        yield put({
          type: 'fetchDivision',
          payload: { tenantId: getCurrentTenant(), id: payload.customerId },
        });
      } catch (error) {
        dialog(error);
      }
      return response;
    },

    *fetchAuditTrail({ payload }, { call, put }) {
      try {
        const response = yield call(getAuditTrail, {
          tenantId: getCurrentTenant(),
          customerId: payload.id,
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { auditTrail: data } });
      } catch (error) {
        dialog(error);
      }
    },

    *fetchNotes({ payload }, { call, put }) {
      try {
        const response = yield call(getNotes, {
          tenantId: getCurrentTenant(),
          customerId: payload.id,
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { notes: data, originNotes: data } });
      } catch (error) {
        dialog(error);
      }
    },

    *filterNotes({ payload }, { call, put }) {
      try {
        const response = yield call(filterNotes, {
          tenantId: getCurrentTenant(),
          ...payload,
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: {
            notes: data,
            originNotes: data,
          },
        });
      } catch (error) {
        dialog(error);
      }
    },

    *searchNotes({ payload }, { put, select }) {
      try {
        if (payload.searchKey) {
          const { originNotes = [] } = yield select((state) => state.customerProfile);
          const tempNotes = originNotes.filter((note) =>
            JSON.stringify(note).toLowerCase().includes(payload.searchKey),
          );
          yield put({ type: 'save', payload: { notes: tempNotes } });
        } else {
          yield put({
            type: 'fetchNotes',
            payload: {
              id: payload.reId,
            },
          });
        }
      } catch (error) {
        dialog(error);
      }
    },

    *addNote({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(addNotes, {
          tenantId: getCurrentTenant(),
          ...payload,
        });
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({ message });

        yield put({
          type: 'fetchNotes',
          payload: {
            id: payload.customerId,
          },
        });
      } catch (error) {
        dialog(error);
      }
      return response;
    },

    *fetchDocumentsTypes(_, { call, put }) {
      try {
        const response = yield call(getDocumentType);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { documentType: data } });
      } catch (error) {
        dialog(error);
      }
    },

    *fetchDocuments({ payload }, { call, put }) {
      let response = [];
      try {
        response = yield call(getDocument, {
          tenantId: getCurrentTenant(),
          customerId: payload.id,
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { documents: data } });
      } catch (error) {
        dialog(error);
      }
      return response;
    },

    *searchDocuments({ payload }, { put, select }) {
      try {
        if (payload.searchKey) {
          const { documents = [] } = yield select((state) => state.customerProfile);
          const tempDocuments = documents.filter((doc) =>
            doc.documentTypeName.toLowerCase().includes(payload.searchKey),
          );
          yield put({ type: 'save', payload: { documents: tempDocuments } });
        } else {
          yield put({
            type: 'fetchDocuments',
            payload: {
              id: payload.reId,
            },
          });
        }
      } catch (error) {
        dialog(error);
      }
    },

    *removeDoc({ payload }, { call }) {
      try {
        const response = yield call(removeDocument, {
          tenantId: getCurrentTenant(),
          ...payload,
        });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        notification.success({ message: 'Remove successfully' });
      } catch (error) {
        dialog(error);
      }
    },

    *uploadDoc({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(uploadDocument, payload);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message: 'Upload Successfully',
        });
        yield put({
          type: 'save',
          payload: { fileURL: data[0].url },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },

    *addDoc({ payload }, { call }) {
      try {
        const response = yield call(addDocument, {
          tenantId: getCurrentTenant(),
          ...payload,
        });
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({ message });
      } catch (error) {
        dialog(error);
      }
    },

    *filterDoc({ payload }, { call, put }) {
      try {
        const response = yield call(filterDocument, {
          tenantId: getCurrentTenant(),
          ...payload,
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: {
            documents: data,
          },
        });
      } catch (error) {
        dialog(error);
      }
    },

    *fetchTagList({ payload }, { call, put }) {
      try {
        const response = yield call(getTagList, {
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
          ...payload,
        });
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;
        if (data.length > 0) {
          yield put({ type: 'save', payload: { listTags: data[0]?.tagDivision } });
        }
      } catch (error) {
        dialog(error);
      }
    },

    *updateContactInfo({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(updateContactInfo, {
          ...payload,
          tenantId: getCurrentTenant(),
        });
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({ message });

        yield put({
          type: 'saveInfo',
          payload,
        });
      } catch (error) {
        dialog(error);
      }
      return response;
    },
    *fetchProjectListEffect({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getProjectList, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;

        yield put({
          type: 'save',
          payload: {
            projectList: data,
          },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },

    // OTHERS
    *fetchProjectTypeListEffect({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getProjectTypeList, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;

        yield put({
          type: 'save',
          payload: {
            projectTypeList: data,
          },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *fetchDivisionListEffect({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getDivisionList, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;
        if (data.length > 0) {
          yield put({
            type: 'save',
            payload: {
              divisionList: data[0].tagDivision,
            },
          });
        }
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },

    *fetchEmployeeListEffect({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getEmployeeList, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;

        yield put({
          type: 'save',
          payload: {
            employeeList: data,
          },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *fetchProjectNameListEffect({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getProjectNameList, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;

        yield put({
          type: 'save',
          payload: {
            projectNameList: data,
          },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *fetchProjectStatusListEffect({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getProjectStatusList, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;

        yield put({
          type: 'save',
          payload: {
            projectStatusList: data,
          },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *updateCustomerEffect({ payload }, { call }) {
      let response = {};
      try {
        response = yield call(editCustomer, {
          ...payload,
        });
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    saveInfo(state, action) {
      const { info } = state;
      return {
        ...state,
        info: { ...info, ...action.payload },
      };
    },
    saveTemp(state, action) {
      const { temp } = state;
      return {
        ...state,
        temp: {
          ...temp,
          ...action.payload,
        },
      };
    },
  },
};

export default customerProfile;
