import { notification } from 'antd';
import { dialog } from '@/utils/utils';
import {
  getCompensationList,
  getEmployeeByUserId,
  getCompensation,
  getListSkill,
  updateGeneralInfo,
  getListTitle,
  addCertification,
  updateCertification,
  getPassPort,
  getCountryList,
  updatePassPort,
  updateVisa,
  removeVisa,
  removePassport,
  getAddPassPort,
  getVisa,
  getAddVisa,
  getEmploymentInfo,
  getLocationList,
  getEmployeeTypeList,
  getDepartmentList,
  addChangeHistory,
  getDocumentCategories,
  getDocuments,
  getPayslip,
  getChangeHistories,
  getDocumentAdd,
  getDocumentUpdate,
  getDocumentById,
  getAdhaarcardAdd,
  getAdhaarcardUpdate,
  getAdhaardCard,
  removeCertification,
  getEmailsListByCompany,
  getBank,
  getAddBank,
  updateBank,
  getTax,
  getAddTax,
  updateTax,
  updateEmployment,
  patchEmployment,
  getListRelation,
  getCountryStates,
  getRevokeHistory,
  shareDocument,
  getDependentsByEmployee,
  addDependentsOfEmployee,
  updateDependentsById,
  removeDependentsById,
  // getBenefitPlans,
  addMultiBank,
  addMultiCertification,
  getBenefitPlanList,
  getListEmployeeSingleCompany,
  getListGrade,
  addSkill,
} from '@/services/employeeProfiles';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';

const employeeProfile = {
  namespace: 'employeeProfile',
  state: {
    // success modal
    successModalVisible: false,

    // all information
    employmentData: {},
    compensationData: {},

    // others
    paySlip: [],
    countryList: [],
    listSkill: [],
    listTitle: [],
    listTitleByDepartment: [],
    companyLocationList: [],
    locations: [],
    employeeTypes: [],
    departments: [],
    compensationTypes: [],
    employee: '',
    employees: [],
    jobTitleList: [],
    originData: {
      passportData: [{}],
      visaData: [],
      changeHistories: [],
      bankData: {},
      taxData: {},
      dependentDetails: [],
      benefitPlans: [],
    },
    tempData: {
      passportData: [{}],
      visaData: [],
      document: {},
      // bankData: {},
      // taxData: {},
    },
    listPRReport: [],
    documentCategories: [],
    listDocuments: [],
    newDocument: {},
    documentDetail: {},
    groupViewingDocuments: [],
    AdhaarCard: {},
    emailsList: [],
    listRelation: [],
    listStates: [],
    revoke: [],
    employeeList: [], // single company
    listGrades: [],
  },
  effects: {
    *fetchEmployeeIdByUserId({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getEmployeeByUserId, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: {
            employee: data,
          },
        });
      } catch (error) {
        dialog(error);
      }
      return response;
    },
    *addNewChangeHistory({ payload }, { call, put }) {
      let response = {};
      try {
        if (payload.employee && payload.changedBy) {
          response = yield call(addChangeHistory, {
            tenantId: getCurrentTenant(),
            company: getCurrentCompany(),
            ...payload,
          });
          const { statusCode, message } = response;
          if (statusCode !== 200) throw response;
          notification.success({ message });
          if (statusCode === 200) {
            const compensation = yield call(getCompensation, {
              employee: payload.employee,
            });
            if (compensation.statusCode !== 200) throw response;
            yield put({
              type: 'save',
              payload: { compensationData: compensation.data },
            });
          }
        }
      } catch (error) {
        dialog(error);
      }
      return response;
    },
    *fetchCompensation({ payload }, { call, put }) {
      try {
        const response = yield call(getCompensation, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data: compensationData = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { compensationData },
        });
      } catch (errors) {
        dialog(errors);
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
    *fetchPayslips({ payload }, { call, put }) {
      try {
        const response = yield call(getPayslip, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data: paySlip = [] } = response;
        if (statusCode !== 200) throw response;
        const reversePayslip = paySlip.reverse();
        yield put({
          type: 'save',
          payload: { paySlip: reversePayslip },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchPassPort({ payload, dataTempKept = {} }, { call, put }) {
      try {
        const response = yield call(getPassPort, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data: passportData = [] } = response;
        if (statusCode !== 200) throw response;
        const checkDataTempKept = JSON.stringify(dataTempKept) === JSON.stringify({});
        // let passportDataTemp = { ...passportData };
        let passportDataTemp = [...passportData];

        if (!checkDataTempKept) {
          passportDataTemp = { ...passportDataTemp, ...dataTempKept };

          delete passportDataTemp.updatedAt;
          delete passportData.updatedAt;
          const isModified = JSON.stringify(passportDataTemp) !== JSON.stringify(passportData);
          yield put({
            type: 'save',
            payload: { isModified },
          });
        }
        yield put({
          type: 'saveOrigin',
          payload: { passportData },
        });
        yield put({
          type: 'saveTemp',
          payload: { passportData: passportDataTemp },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchVisa({ payload }, { call, put }) {
      try {
        const response = yield call(getVisa, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data: visaData = [] } = response;
        if (statusCode !== 200) throw response;
        const visaDataTemp = [...visaData];
        yield put({
          type: 'saveOrigin',
          payload: { visaData },
        });
        yield put({
          type: 'saveTemp',
          payload: { visaData: visaDataTemp },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchListSkill(_, { call, put }) {
      try {
        const response = yield call(getListSkill);
        const { statusCode, data: listSkill = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { listSkill } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchLocations(_, { call, put }) {
      try {
        const response = yield call(getLocationList);
        const { statusCode, data } = response;
        const temp = data.map((item) => item);
        const locations = temp.filter((item, index) => temp.indexOf(item) === index);
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { locations } });
      } catch (error) {
        dialog(error);
      }
    },
    *fetchEmployeeTypes({ payload }, { call, put }) {
      try {
        const response = yield call(getEmployeeTypeList, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data } = response;
        const temp = data.map((item) => item);
        const employeeTypes = temp.filter((item, index) => temp.indexOf(item) === index);
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { employeeTypes } });
      } catch (error) {
        dialog(error);
      }
    },
    *fetchDepartments({ payload }, { call, put }) {
      try {
        const response = yield call(getDepartmentList, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data } = response;
        const temp = data.map((item) => item);
        const departments = temp.filter((item, index) => temp.indexOf(item) === index);
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { departments } });
      } catch (error) {
        dialog(error);
      }
    },
    *addPassPort({ payload = {}, dataTempKept = {} }, { put, call, select }) {
      try {
        const response = yield call(getAddPassPort, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { employee } = yield select((state) => state.employeeProfile);
        const { statusCode, message } = response;

        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        yield put({
          type: 'fetchPassPort',
          payload: { employee },
          dataTempKept,
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *addVisa({ payload = {}, dataTempKept = {} }, { put, call, select }) {
      try {
        const response = yield call(getAddVisa, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { employee } = yield select((state) => state.employeeProfile);
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        yield put({
          type: 'fetchVisa',
          payload: { employee },
          dataTempKept,
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *updatePassPort({ payload = {}, dataTempKept = {} }, { put, call, select }) {
      try {
        const response = yield call(updatePassPort, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { employee } = yield select((state) => state.employeeProfile);
        const { statusCode, message } = response;

        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        yield put({
          type: 'fetchPassPort',
          payload: { employee },
          dataTempKept,
        });
      } catch (errors) {
        dialog(errors);
      }
    },

    *updateVisa({ payload = {}, dataTempKept = {} }, { put, call, select }) {
      try {
        const response = yield call(updateVisa, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { employee } = yield select((state) => state.employeeProfile);
        const { statusCode, message } = response;

        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        yield put({
          type: 'fetchVisa',
          payload: { employee },
          dataTempKept,
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *removeVisa({ payload = {}, dataTempKept = {} }, { put, call, select }) {
      try {
        const response = yield call(removeVisa, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { employee } = yield select((state) => state.employeeProfile);
        const { statusCode, message } = response;

        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        yield put({
          type: 'fetchVisa',
          payload: { employee },
          dataTempKept,
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *removePassPort({ payload = {}, dataTempKept = {} }, { put, call, select }) {
      try {
        const response = yield call(removePassport, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { employee } = yield select((state) => state.employeeProfile);
        const { statusCode } = response;

        if (statusCode !== 200) throw response;
        notification.success({
          message: 'Remove item successfully',
        });
        yield put({
          type: 'fetchPassPort',
          payload: { employee },
          dataTempKept,
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *updateGeneralInfo({ payload = {}, isUpdateMyAvt = false, isLinkedIn = false }, { put, call }) {
      let response = {};
      try {
        response = yield call(updateGeneralInfo, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { successModalVisible: true },
        });
        yield put({
          type: 'save',
          payload: { employmentData: data },
        });
        if (isUpdateMyAvt || isLinkedIn) {
          yield put({
            type: 'user/fetchCurrent',
          });
        }
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *updateFirstComer({ payload = {}, dataTempKept = {} }, { put, call, select }) {
      try {
        const { bankDetails = [], certifications = [], taxDetails = {} } = payload;
        if (bankDetails.length !== 0) {
          const res = yield call(addMultiBank, {
            listBank: bankDetails,
            tenantId: getCurrentTenant(),
          });
          const { statusCode } = res;
          if (statusCode !== 200) throw res;
          const { employee } = yield select((state) => state.employeeProfile);

          yield put({
            type: 'fetchBank',
            payload: { employee },
            dataTempKept,
          });
        }
        if (taxDetails) {
          const res = yield call(getAddTax, { ...taxDetails });
          const { statusCode } = res;
          if (statusCode !== 200) throw res;
          const { employee } = yield select((state) => state.employeeProfile);

          yield put({
            type: 'fetchTax',
            payload: { employee },
            dataTempKept,
          });
        }
        let arrCertification = [];
        if (certifications.length !== 0) {
          const res = yield call(addMultiCertification, {
            certifications,
            tenantId: getCurrentTenant(),
          });
          const { statusCode, data } = res;
          if (statusCode !== 200) throw res;
          arrCertification = data;
        }
        const response = yield call(updateGeneralInfo, {
          ...payload,
          certification: arrCertification,
        });
        const { statusCode, message, data } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        yield put({
          type: 'save',
          payload: { employmentData: data },
          dataTempKept,
        });
        return response;
      } catch (errors) {
        dialog(errors);
        return {};
      }
    },
    *fetchListTitle({ payload = {} }, { call, put }) {
      try {
        const response = yield call(getListTitle, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data: listTitle = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { listTitle } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *addCertification({ payload }, { call }) {
      try {
        const response = yield call(addCertification, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
      } catch (errors) {
        dialog(errors);
      }
    },
    *updateCertification({ payload }, { call }) {
      try {
        const response = yield call(updateCertification, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchEmploymentInfo({ payload, params }, { call, put }) {
      let response = {};
      try {
        response = yield call(getEmploymentInfo, payload, {
          ...params,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { data, statusCode } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { employmentData: data } });
      } catch (error) {
        dialog(error.message);
      }
      return response;
    },
    *fetchDocumentCategories({ payload = {} }, { call, put }) {
      try {
        const response = yield call(getDocumentCategories, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { documentCategories: data },
        });
        return response;
      } catch (errors) {
        dialog(errors);
        return {};
      }
    },
    *fetchDocuments({ payload = {} }, { call, put }) {
      try {
        const response = yield call(getDocuments, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data: listDocuments = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { listDocuments },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *clearListDocuments(_, { put }) {
      try {
        yield put({
          type: 'save',
          payload: { listDocuments: [] },
        });
      } catch (errors) {
        dialog(errors);
      }
    },

    *fetchViewingDocumentDetail({ payload = {} }, { call, put }) {
      try {
        const response = yield call(getDocumentById, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
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
    *saveGroupViewingDocuments({ payload: { files = [] } = {} }, { put }) {
      try {
        yield put({
          type: 'save',
          payload: { groupViewingDocuments: files },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *updateDocument({ payload }, { call, put }) {
      try {
        const response = yield call(getDocumentUpdate, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, message, data: newDocument = {} } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        yield put({
          type: 'save',
          payload: { newDocument },
        });
        return response;
      } catch (errors) {
        dialog(errors);
        return {};
      }
    },
    *fetchEmailsListByCompany({ payload = {} }, { call, put }) {
      try {
        const response = yield call(getEmailsListByCompany, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data: emailsList = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { emailsList },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchChangeHistories({ payload }, { call, put }) {
      try {
        const response = yield call(getChangeHistories, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data: { data = [], total = 0 } = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'saveOrigin',
          payload: { changeHistories: data, changeHistoriesTotal: total },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchDocumentAdd({ payload = {} }, { call }) {
      let idDocument = '';
      try {
        const response = yield call(getDocumentAdd, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const {
          statusCode,
          data: { _id: id },
        } = response;

        if (statusCode !== 200) throw response;
        idDocument = id;
      } catch (errors) {
        dialog(errors);
      }
      return idDocument;
    },
    *fetchDocumentUpdate({ payload }, { call, put }) {
      let doc = {};
      try {
        const response = yield call(getDocumentUpdate, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data } = response;

        if (statusCode !== 200) throw response;
        yield put({ type: 'saveTemp', payload: { document: data } });
        doc = data;
      } catch (errors) {
        dialog(errors);
      }
      return doc;
    },
    *fetchAdhaarCard({ payload }, { call, put }) {
      try {
        const response = yield call(getAdhaardCard, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data: AdhaarCard = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { AdhaarCard },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchAdhaarcardAdd({ payload = {} }, { call, select, put }) {
      let idAdhaarcard = '';
      try {
        const response = yield call(getAdhaarcardAdd, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { employee } = yield select((state) => state.employeeProfile);

        const {
          statusCode,
          data: { _id: id },
        } = response;
        if (statusCode !== 200) throw response;
        idAdhaarcard = id;
        yield put({
          type: 'fetchAdhaarCard',
          payload: { employee },
        });
      } catch (errors) {
        dialog(errors);
      }
      return idAdhaarcard;
    },
    *fetchAdhaarcardUpdate({ payload }, { call, put, select }) {
      let doc = {};
      try {
        const response = yield call(getAdhaarcardUpdate, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { employee } = yield select((state) => state.employeeProfile);

        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'saveTemp', payload: { document: data } });
        doc = data;
        yield put({
          type: 'fetchAdhaarCard',
          payload: { employee },
        });
      } catch (errors) {
        dialog(errors);
      }
      return doc;
    },
    *removeCertification({ payload }, { call }) {
      try {
        const response = yield call(removeCertification, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchBank({ payload }, { call, put }) {
      try {
        const response = yield call(getBank, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data: bankData = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'saveOrigin',
          payload: { bankData },
        });
        yield put({
          type: 'saveTemp',
          payload: { bankData },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *addBank({ payload = {}, dataTempKept = {} }, { put, call, select }) {
      try {
        const response = yield call(getAddBank, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { employee } = yield select((state) => state.employeeProfile);

        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        yield put({
          type: 'fetchBank',
          payload: { employee },
          dataTempKept,
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *addMultiBank({ payload = {} }, { call }) {
      try {
        const response = yield call(addMultiBank, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
      } catch (errors) {
        dialog(errors);
      }
    },
    *addNewTax({ payload = {} }, { call }) {
      try {
        const response = yield call(getAddTax, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
      } catch (errors) {
        dialog(errors);
      }
    },
    *updateBank({ payload = {}, dataTempKept = {} }, { put, call, select }) {
      try {
        const response = yield call(updateBank, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { employee } = yield select((state) => state.employeeProfile);

        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'fetchBank',
          payload: { employee },
          dataTempKept,
        });
        yield put({
          type: 'save',
          payload: { successModalVisible: true },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchTax({ payload }, { call, put }) {
      try {
        const response = yield call(getTax, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data: taxData = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'saveOrigin',
          payload: { taxData },
        });
        yield put({
          type: 'saveTemp',
          payload: { taxData },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *addTax({ payload = {}, dataTempKept = {} }, { put, call, select }) {
      try {
        const response = yield call(getAddTax, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { employee } = yield select((state) => state.employeeProfile);

        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        yield put({
          type: 'fetchTax',
          payload: { employee },
          dataTempKept,
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *updateTax({ payload = {}, dataTempKept = {} }, { put, call, select }) {
      try {
        const response = yield call(updateTax, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { employee } = yield select((state) => state.employeeProfile);

        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'fetchTax',
          payload: { employee },
          dataTempKept,
        });
        yield put({
          type: 'save',
          payload: { successModalVisible: true },
        });
      } catch (errors) {
        dialog(errors);
      }
    },

    *fetchTitleByDepartment({ payload }, { call, put }) {
      try {
        const res = yield call(getListTitle, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data } = res;
        if (statusCode !== 200) throw res;
        yield put({
          type: 'save',
          payload: { listTitleByDepartment: data },
        });
      } catch (errors) {
        dialog(errors);
      }
    },

    *fetchCompensationList(_, { call, put }) {
      try {
        const res = yield call(getCompensationList, { tenantId: getCurrentTenant() });
        const { statusCode, data } = res;
        if (statusCode !== 200) throw res;
        yield put({
          type: 'save',
          payload: { compensationTypes: data },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *updateEmployment({ payload = {} }, { call, put }) {
      try {
        const response = yield call(updateEmployment, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;

        yield put({
          type: 'fetchEmploymentInfo',
          payload: { id: payload.id },
        });
        yield put({
          type: 'save',
          payload: { successModalVisible: true },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *patchEmployment({ payload = {} }, { call, put }) {
      let response = {};
      try {
        response = yield call(patchEmployment, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { employmentData: data } });
        yield put({
          type: 'save',
          payload: { successModalVisible: true },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *uploadDocument({ data = {} }, { call, put }) {
      try {
        const response = yield call(getDocumentAdd, {
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
          ...data,
        });

        const { statusCode, data: uploadedDocument = [] } = response;
        // console.log('upload document res', response);
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { uploadedDocument } });
        return response;
      } catch (errors) {
        dialog(errors);
        return '';
      }
    },

    *fetchListRelation(_, { call, put }) {
      try {
        const response = yield call(getListRelation);
        const { statusCode, data: listRelation = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { listRelation } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchCountryStates({ payload = {} }, { call, put }) {
      let response;
      try {
        response = yield call(getCountryStates, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data: listStates = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { listStates } });
        return listStates;
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *revokeHistory({ payload = {} }, { call, put }) {
      try {
        const response = yield call(getRevokeHistory, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data: revoke = [], message } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { revoke } });
        notification.success({
          message,
        });

        const { newChangeList = [] } = revoke;
        yield put({
          type: 'saveOrigin',
          payload: { changeHistories: newChangeList },
        });

        /// /////////////////////
        if (statusCode === 200) {
          const employment = yield call(getEmploymentInfo, {
            id: payload.employee,
          });
          yield put({
            type: 'save',
            payload: { employmentData: employment.data },
          });
          if (employment.statusCode !== 200) throw response;
          const compensation = yield call(getCompensation, {
            employee: payload.employee,
          });
          if (compensation.statusCode !== 200) throw response;
          yield put({
            type: 'save',
            payload: { compensationData: compensation.data },
          });
        }
      } catch (errors) {
        dialog(errors);
      }
    },

    *shareDocumentEffect({ payload = {} }, { call }) {
      let response;
      try {
        response = yield call(shareDocument, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *fetchEmployeeDependentDetails({ payload = {} }, { call, put }) {
      try {
        const response = yield call(getDependentsByEmployee, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'saveOrigin', payload: { dependentDetails: data } });
        return response;
      } catch (error) {
        // dialog(error);
        return {};
      }
    },
    *addDependentsOfEmployee({ payload = {} }, { call, put }) {
      try {
        const response = yield call(addDependentsOfEmployee, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message: 'Add dependent successfully',
        });
        yield put({ type: 'saveOrigin', payload: { dependentDetails: data } });
        return response;
      } catch (error) {
        dialog(error);
        return {};
      }
    },
    *updateEmployeeDependentDetails({ payload = {} }, { call, put }) {
      try {
        const response = yield call(updateDependentsById, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message: 'Update dependent successfully',
        });
        yield put({ type: 'saveOrigin', payload: { dependentDetails: data } });
        return response;
      } catch (error) {
        dialog(error);
        return {};
      }
    },
    *removeEmployeeDependentDetails({ payload = {} }, { call, put }) {
      try {
        const response = yield call(removeDependentsById, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message: 'Remove dependent successfully',
        });
        yield put({ type: 'saveOrigin', payload: { dependentDetails: data } });
        return response;
      } catch (error) {
        dialog(error);
        return {};
      }
    },
    *getBenefitPlans({ payload }, { call, put }) {
      try {
        const response = yield call(getBenefitPlanList, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'saveOrigin', payload: { benefitPlans: data } });
      } catch (error) {
        dialog(error);
      }
    },
    // for filter pane
    *fetchEmployeeListSingleCompanyEffect({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getListEmployeeSingleCompany, {
          status: ['ACTIVE'],
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
          ...payload,
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
    *fetchGradeList({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getListGrade, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { listGrades: data } });
        yield put({ type: 'saveTemp', payload: { listGrades: data } });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *addNewSkill({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(addSkill, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'employeeProfile/fetchListSkill',
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
    saveOrigin(state, action) {
      const { originData } = state;
      return {
        ...state,
        originData: {
          ...originData,
          ...action.payload,
        },
      };
    },
    saveDocuments(state, action) {
      const { listDocuments } = state;
      const { listDocuments: saveFetchDocs = {} } = action.payload;
      const result = listDocuments.concat(saveFetchDocs).flat();
      return {
        ...state,
        listDocuments: result,
      };
    },

    saveTemp(state, action) {
      const { tempData } = state;
      return {
        ...state,
        tempData: {
          ...tempData,
          ...action.payload,
        },
      };
    },
    saveOpenEdit(state, action) {
      const { editGeneral } = state;
      return {
        ...state,
        editGeneral: {
          ...editGeneral,
          ...action.payload,
        },
      };
    },
    clearState(state) {
      return {
        ...state,
        successModalVisible: false,
        paySlip: [],
        countryList: [],
        listSkill: [],
        listTitle: [],
        listTitleByDepartment: [],
        companyLocationList: [],
        locations: [],
        employeeTypes: [],
        departments: [],
        compensationTypes: [],
        employees: [],
        jobTitleList: [],
        originData: {},
        tempData: {},
        listPRReport: [],
        AdhaarCard: {},
        listRelation: [],
        listStates: [],
        revoke: [],
        employee: '',
      };
    },
  },
};
export default employeeProfile;
