import { dialog } from '@/utils/utils';
import {
  getGeneralInfo,
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
  getAddPassPort,
  getVisa,
  getAddVisa,
  getEmploymentInfo,
  getLocationList,
  getEmployeeTypeList,
  getDepartmentList,
  getEmployeeList,
  addChangeHistory,
  getPRReport,
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
  getTitleByDepartment,
  getLocationsByCompany,
  updateEmployment,
  updatePrivate,
  getListRelation,
  getCountryStates,
} from '@/services/employeeProfiles';
import { notification } from 'antd';

const documentCategories = [
  { employeeGroup: 'Agreement', parentEmployeeGroup: ' Qualifications/Certification' },
  { employeeGroup: 'Agreement', parentEmployeeGroup: 'PR Reports' },
  { employeeGroup: 'Employee Handbook', parentEmployeeGroup: 'Handbooks & Agreements' },
  { employeeGroup: 'Agreements', parentEmployeeGroup: 'Handbooks & Agreements' },
  { employeeGroup: 'Identity', parentEmployeeGroup: 'Indentification Documents' },
  { employeeGroup: 'Consent Forms', parentEmployeeGroup: 'Hiring Documents' },
  { employeeGroup: 'Tax Documents', parentEmployeeGroup: 'Hiring Documents' },
  { employeeGroup: 'Employment Eligibility', parentEmployeeGroup: 'Hiring Documents' },
  { employeeGroup: 'Offer Letter', parentEmployeeGroup: 'Hiring Documents' },
];

const employeeProfile = {
  namespace: 'employeeProfile',
  state: {
    isModified: false,
    editGeneral: {
      openContactDetails: false,
      openEmployeeInfor: false,
      openPassportandVisa: false,
      openPersonnalInfor: false,
      openAcademic: false,
      openTax: false,
      openBank: false,
    },
    paySlip: [],
    countryList: [],
    idCurrentEmployee: '',
    listSkill: [],
    listTitle: [],
    listTitleByDepartment: [],
    listLocationsByCompany: [],
    locations: [],
    employeeTypes: [],
    departments: [],
    compensationTypes: [],
    employees: [],
    jobTitleList: [],
    originData: {
      generalData: {},
      compensationData: {},
      passportData: [],
      visaData: [],
      employmentData: {},
      changeHistories: [],
      bankData: {},
      taxData: {},
    },
    tempData: {
      generalData: {},
      compensationData: {},
      passportData: [],
      visaData: [],
      document: {},
      bankData: {},
      taxData: {},
    },
    listPRReport: [],
    saveDocuments: documentCategories,
    newDocument: {},
    documentDetail: {},
    groupViewingDocuments: [],
    AdhaarCard: {},
    emailsList: [],
    isUpdateEmployment: false,
    listRelation: [],
    listStates: [],
  },
  effects: {
    *fetchGeneralInfo({ payload: { employee = '' }, dataTempKept = {} }, { call, put }) {
      try {
        const response = yield call(getGeneralInfo, { employee });
        const { statusCode, data: generalData = {} } = response;
        if (statusCode !== 200) throw response;
        const checkDataTempKept = JSON.stringify(dataTempKept) === JSON.stringify({});
        let generalDataTemp = { ...generalData };
        if (!checkDataTempKept) {
          generalDataTemp = { ...generalDataTemp, ...dataTempKept };
          delete generalDataTemp.updatedAt;
          delete generalData.updatedAt;
          const isModified = JSON.stringify(generalDataTemp) !== JSON.stringify(generalData);
          yield put({
            type: 'save',
            payload: { isModified },
          });
        }
        yield put({
          type: 'save',
          payload: { idCurrentEmployee: employee },
        });
        yield put({
          type: 'saveOrigin',
          payload: { generalData },
        });
        yield put({
          type: 'saveTemp',
          payload: { generalData: generalDataTemp },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *addNewChangeHistory({ payload }, { call, put }) {
      try {
        if (payload.employee && payload.changedBy) {
          const response = yield call(addChangeHistory, payload);
          const { statusCode } = response;
          if (statusCode !== 200) throw response;
          if (payload.takeEffect === 'UPDATED' && statusCode === 200) {
            const updates = yield call(getChangeHistories, { employee: payload.employee });
            if (updates.statusCode !== 200) throw updates;
            yield put({ type: 'saveOrigin', payload: { changeHistories: updates.data } });
            const employment = yield call(getEmploymentInfo, { id: payload.employee });
            yield put({ type: 'saveOrigin', payload: { employmentData: employment.data } });
            if (employment.statusCode !== 200) throw response;
            const compensation = yield call(getCompensation, { employee: payload.employee });
            if (compensation.statusCode !== 200) throw response;
            yield put({
              type: 'saveOrigin',
              payload: { compensationData: compensation.data },
            });
            yield put({
              type: 'saveTemp',
              payload: { compensationData: compensation.data },
            });
          }
        }
      } catch (error) {
        dialog(error);
      }
    },
    *fetchCompensation({ payload: { employee = '' } }, { call, put }) {
      try {
        const response = yield call(getCompensation, { employee });
        const { statusCode, data: compensationData = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'saveOrigin',
          payload: { compensationData },
        });
        yield put({
          type: 'saveTemp',
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
    *fetchPayslips({ payload: { employee = '', employeeGroup = '' } }, { call, put }) {
      try {
        const response = yield call(getPayslip, { employee, employeeGroup });
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
    *fetchPassPort({ payload: { employee = '' }, dataTempKept = {} }, { call, put }) {
      try {
        const response = yield call(getPassPort, { employee });
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
          type: 'save',
          payload: { idCurrentEmployee: employee },
        });
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
    *fetchVisa({ payload: { employee = '' } }, { call, put }) {
      try {
        const response = yield call(getVisa, { employee });
        const { statusCode, data: visaData = [] } = response;
        if (statusCode !== 200) throw response;
        const visaDataTemp = [...visaData];
        yield put({
          type: 'save',
          payload: { idCurrentEmployee: employee },
        });
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
    *fetchEmployeeTypes(_, { call, put }) {
      try {
        const response = yield call(getEmployeeTypeList);
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
        const response = yield call(getDepartmentList, payload);
        const { statusCode, data } = response;
        const temp = data.map((item) => item);
        const departments = temp.filter((item, index) => temp.indexOf(item) === index);
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { departments } });
      } catch (error) {
        dialog(error);
      }
    },
    *fetchEmployees(_, { call, put }) {
      try {
        const response = yield call(getEmployeeList);
        const { statusCode, data } = response;
        const employees = data.filter((item) => item.generalInfo);
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { employees } });
      } catch (error) {
        dialog(error);
      }
    },
    *addPassPort({ payload = {}, dataTempKept = {}, key = '' }, { put, call, select }) {
      try {
        const response = yield call(getAddPassPort, payload);
        const { idCurrentEmployee } = yield select((state) => state.employeeProfile);
        const { statusCode, message } = response;

        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        yield put({
          type: 'fetchPassPort',
          payload: { employee: idCurrentEmployee },
          dataTempKept,
        });
        if (key === 'openPassportandVisa') {
          yield put({
            type: 'saveOpenEdit',
            payload: { openPassportandVisa: false },
          });
        }
      } catch (errors) {
        dialog(errors);
      }
    },
    *addVisa({ payload = {}, dataTempKept = {}, key = '' }, { put, call, select }) {
      try {
        const response = yield call(getAddVisa, payload);
        const { idCurrentEmployee } = yield select((state) => state.employeeProfile);
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        yield put({
          type: 'fetchVisa',
          payload: { employee: idCurrentEmployee },
          dataTempKept,
        });
        if (key === 'openPassportandVisa') {
          yield put({
            type: 'saveOpenEdit',
            payload: { openPassportandVisa: false },
          });
        }
      } catch (errors) {
        dialog(errors);
      }
    },
    *updatePassPort({ payload = {}, dataTempKept = {}, key = '' }, { put, call, select }) {
      try {
        const response = yield call(updatePassPort, payload);
        const { idCurrentEmployee } = yield select((state) => state.employeeProfile);
        const { statusCode, message } = response;

        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        yield put({
          type: 'fetchPassPort',
          payload: { employee: idCurrentEmployee },
          dataTempKept,
        });
        if (key === 'openPassportandVisa') {
          yield put({
            type: 'saveOpenEdit',
            payload: { openPassportandVisa: false },
          });
        }
      } catch (errors) {
        dialog(errors);
      }
    },
    *updateVisa({ payload = {}, dataTempKept = {}, key = '' }, { put, call, select }) {
      try {
        const response = yield call(updateVisa, payload);
        const { idCurrentEmployee } = yield select((state) => state.employeeProfile);
        const { statusCode, message } = response;

        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        yield put({
          type: 'fetchVisa',
          payload: { employee: idCurrentEmployee },
          dataTempKept,
        });
        if (key === 'openPassportandVisa') {
          yield put({
            type: 'saveOpenEdit',
            payload: { openPassportandVisa: false },
          });
        }
      } catch (errors) {
        dialog(errors);
      }
    },

    *updateGeneralInfo(
      { payload = {}, dataTempKept = {}, key = '', isUpdateMyAvt = false },
      { put, call, select },
    ) {
      try {
        const response = yield call(updateGeneralInfo, payload);
        const { idCurrentEmployee } = yield select((state) => state.employeeProfile);
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        yield put({
          type: 'fetchGeneralInfo',
          payload: { employee: idCurrentEmployee },
          dataTempKept,
        });
        switch (key) {
          case 'openContactDetails':
            yield put({
              type: 'saveOpenEdit',
              payload: { openContactDetails: false },
            });
            break;
          case 'openEmployeeInfor':
            yield put({
              type: 'saveOpenEdit',
              payload: { openEmployeeInfor: false },
            });
            break;
          case 'openPassportandVisa':
            yield put({
              type: 'saveOpenEdit',
              payload: { openPassportandVisa: false },
            });
            break;
          case 'openPersonnalInfor':
            yield put({
              type: 'saveOpenEdit',
              payload: { openPersonnalInfor: false },
            });
            break;
          case 'openAcademic':
            yield put({
              type: 'saveOpenEdit',
              payload: { openAcademic: false },
            });
            break;
          default:
            yield put({
              type: 'saveOpenEdit',
              payload: { openContactDetails: false },
            });
        }
        if (isUpdateMyAvt) {
          yield put({
            type: 'user/fetchCurrent',
          });
        }
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchListTitle(_, { call, put }) {
      try {
        const response = yield call(getListTitle);
        const { statusCode, data: listTitle = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { listTitle } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *addCertification({ payload }, { call }) {
      try {
        const response = yield call(addCertification, payload);
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
      } catch (errors) {
        dialog(errors);
      }
    },
    *updateCertification({ payload }, { call }) {
      try {
        const response = yield call(updateCertification, payload);
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchEmploymentInfo({ payload: id = '' }, { call, put }) {
      try {
        const response = yield call(getEmploymentInfo, { id });
        const { data, statusCode } = response;
        yield put({ type: 'saveOrigin', payload: { employmentData: data } });
        if (statusCode !== 200) throw response;
      } catch (error) {
        dialog(error.message);
      }
    },
    *fetchPRReport(
      { payload: { employee = '', parentEmployeeGroup = 'PR Reports' } = {} },
      { call, put },
    ) {
      try {
        const response = yield call(getPRReport, {
          employee,
          parentEmployeeGroup,
        });
        const { statusCode, data: listPRReport = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { listPRReport } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchDocuments({ payload: { employee = '' } = {} }, { call, put }) {
      try {
        const response = yield call(getDocuments, {
          employee,
        });
        const { statusCode, data: saveDocuments = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'saveDocuments',
          payload: { saveDocuments },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *clearSaveDocuments(_, { put }) {
      try {
        const saveDocuments = documentCategories;
        yield put({
          type: 'save',
          payload: { saveDocuments },
        });
      } catch (errors) {
        dialog(errors);
      }
    },

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
    *updateDocument({ payload: { id = '', attachment = '' } = {} }, { call, put }) {
      try {
        const response = yield call(getDocumentUpdate, {
          id,
          attachment,
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
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchEmailsListByCompany({ payload: { company = [] } = {} }, { call, put }) {
      try {
        const response = yield call(getEmailsListByCompany, {
          company,
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
    *fetchChangeHistories({ payload: employee = '' }, { call, put }) {
      try {
        const response = yield call(getChangeHistories, { employee });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'saveOrigin', payload: { changeHistories: data } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchDocumentAdd({ payload = {} }, { call }) {
      let idDocument = '';
      try {
        const response = yield call(getDocumentAdd, payload);
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
        const response = yield call(getDocumentUpdate, payload);
        const { statusCode, data } = response;

        if (statusCode !== 200) throw response;
        yield put({ type: 'saveTemp', payload: { document: data } });
        doc = data;
      } catch (errors) {
        dialog(errors);
      }
      return doc;
    },
    *fetchAdhaardCard({ payload: { employee = '' } }, { call, put }) {
      try {
        const response = yield call(getAdhaardCard, { employee });
        const { statusCode, data: AdhaarCard = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { idCurrentEmployee: employee, AdhaarCard },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchAdhaarcardAdd({ payload = {} }, { call, select, put }) {
      let idAdhaarcard = '';
      try {
        const response = yield call(getAdhaarcardAdd, payload);
        const { idCurrentEmployee } = yield select((state) => state.employeeProfile);
        const {
          statusCode,
          data: { _id: id },
        } = response;
        if (statusCode !== 200) throw response;
        idAdhaarcard = id;
        yield put({
          type: 'fetchAdhaardCard',
          payload: { employee: idCurrentEmployee },
        });
      } catch (errors) {
        dialog(errors);
      }
      return idAdhaarcard;
    },
    *fetchAdhaarcardUpdate({ payload }, { call, put, select }) {
      let doc = {};
      try {
        const response = yield call(getAdhaarcardUpdate, payload);
        const { idCurrentEmployee } = yield select((state) => state.employeeProfile);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'saveTemp', payload: { document: data } });
        doc = data;
        yield put({
          type: 'fetchAdhaardCard',
          payload: { employee: idCurrentEmployee },
        });
      } catch (errors) {
        dialog(errors);
      }
      return doc;
    },
    *removeCertification({ payload }, { call }) {
      try {
        const response = yield call(removeCertification, payload);
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchBank({ payload: { employee = '' } }, { call, put }) {
      try {
        const response = yield call(getBank, { employee });
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
    *addBank({ payload = {}, dataTempKept = {}, key = '' }, { put, call, select }) {
      try {
        const response = yield call(getAddBank, payload);
        const { idCurrentEmployee } = yield select((state) => state.employeeProfile);
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        yield put({
          type: 'fetchBank',
          payload: { employee: idCurrentEmployee },
          dataTempKept,
        });
        if (key === 'openBank') {
          yield put({
            type: 'saveOpenEdit',
            payload: { openBank: false },
          });
        }
      } catch (errors) {
        dialog(errors);
      }
    },
    *updateBank({ payload = {}, dataTempKept = {}, key = '' }, { put, call, select }) {
      try {
        const response = yield call(updateBank, payload);
        const { idCurrentEmployee } = yield select((state) => state.employeeProfile);
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        yield put({
          type: 'fetchBank',
          payload: { employee: idCurrentEmployee },
          dataTempKept,
        });
        if (key === 'openBank') {
          yield put({
            type: 'saveOpenEdit',
            payload: { openBank: false },
          });
        }
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchTax({ payload: { employee = '' } }, { call, put }) {
      try {
        const response = yield call(getTax, { employee });
        const { statusCode, data: taxData = {} } = response;
        if (statusCode !== 200) throw response;
        // const checkDataTempKept = JSON.stringify(dataTempKept) === JSON.stringify({});
        // let taxDataTemp = { ...taxData[0] };
        // if (!checkDataTempKept) {
        //   taxDataTemp = { ...taxDataTemp, ...dataTempKept };
        //   delete taxDataTemp.updatedAt;
        //   delete taxDataTemp.updatedAt;
        //   const isModified = JSON.stringify(taxDataTemp) !== JSON.stringify(taxData[0]);
        //   yield put({
        //     type: 'save',
        //     payload: { isModified },
        //   });
        // }
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
    *addTax({ payload = {}, dataTempKept = {}, key = '' }, { put, call, select }) {
      try {
        const response = yield call(getAddTax, payload);
        const { idCurrentEmployee } = yield select((state) => state.employeeProfile);
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        yield put({
          type: 'fetchTax',
          payload: { employee: idCurrentEmployee },
          dataTempKept,
        });
        if (key === 'openTax') {
          yield put({
            type: 'saveOpenEdit',
            payload: { openTax: false },
          });
        }
      } catch (errors) {
        dialog(errors);
      }
    },
    *updateTax({ payload = {}, dataTempKept = {}, key = '' }, { put, call, select }) {
      try {
        const response = yield call(updateTax, payload);
        const { idCurrentEmployee } = yield select((state) => state.employeeProfile);
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        yield put({
          type: 'fetchTax',
          payload: { employee: idCurrentEmployee },
          dataTempKept,
        });
        if (key === 'openTax') {
          yield put({
            type: 'saveOpenEdit',
            payload: { openTax: false },
          });
        }
      } catch (errors) {
        dialog(errors);
      }
    },

    *fetchTitleByDepartment({ payload }, { call, put }) {
      try {
        const res = yield call(getTitleByDepartment, payload);
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
    *fetchLocationsByCompany({ payload }, { call, put }) {
      try {
        const res = yield call(getLocationsByCompany, payload);
        const { statusCode, data } = res;
        if (statusCode !== 200) throw res;
        yield put({
          type: 'save',
          payload: { listLocationsByCompany: data },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *updateEmployment({ payload = {} }, { call, put }) {
      let isUpdateEmployment = false;
      try {
        const response = yield call(updateEmployment, payload);
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        const employment = yield call(getEmploymentInfo, { id: payload.id });
        yield put({ type: 'saveOrigin', payload: { employmentData: employment.data } });
        isUpdateEmployment = true;
      } catch (errors) {
        dialog(errors);
      }
      yield put({ type: 'save', payload: { isUpdateEmployment } });
    },
    *uploadDocument({ data }, { call, put }) {
      try {
        const {
          key = '',
          employeeGroup = '',
          parentEmployeeGroup = '',
          attachment = '',
          employee = '',
          company = '',
        } = data;

        const response = yield call(getDocumentAdd, {
          key, // file name
          employeeGroup,
          parentEmployeeGroup,
          attachment,
          employee,
          company,
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
    *setPrivate({ payload = {} }, { call, put, select }) {
      try {
        // console.log(payload);
        const response = yield call(updatePrivate, payload);
        const { idCurrentEmployee } = yield select((state) => state.employeeProfile);
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        yield put({
          type: 'fetchGeneralInfo',
          payload: { employee: idCurrentEmployee },
        });
      } catch (errors) {
        dialog(errors);
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
      try {
        const response = yield call(getCountryStates, payload);
        const { statusCode, data: listStates = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { listStates } });
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
      const { saveDocuments } = state;
      const { saveDocuments: saveFetchDocs = {} } = action.payload;
      const result = saveDocuments.concat(saveFetchDocs).flat();
      return {
        ...state,
        saveDocuments: result,
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
    closeModeEdit(state) {
      return {
        ...state,
        editGeneral: {
          openContactDetails: false,
          openEmployeeInfor: false,
          openPassportandVisa: false,
          openPersonnalInfor: false,
          openAcademic: false,
          openTax: false,
          openBank: false,
        },
      };
    },
  },
};
export default employeeProfile;
