import { dialog } from '@/utils/utils';
import {
  getCompensationList,
  getGeneralInfo,
  getGeneralInfoByUserId,
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
  getLocationsByCompany,
  updateEmployment,
  updatePrivate,
  getListRelation,
  getCountryStates,
  getRevokeHistory,
  shareDocument,
  getDependentsByEmployee,
  addDependentsOfEmployee,
  updateDependentsById,
  removeDependentsById,
  getBenefitPlans,
  addMultiBank,
  addMultiCertification,
} from '@/services/employeeProfiles';
import { notification } from 'antd';
import { getCurrentTenant } from '@/utils/authority';

// const documentCategories = [
//   { employeeGroup: 'Agreement', parentEmployeeGroup: ' Qualifications/Certification' },
//   { employeeGroup: 'Agreement', parentEmployeeGroup: 'PR Reports' },
//   { employeeGroup: 'Employee Handbook', parentEmployeeGroup: 'Handbooks & Agreements' },
//   { employeeGroup: 'Agreements', parentEmployeeGroup: 'Handbooks & Agreements' },
//   { employeeGroup: 'Identity', parentEmployeeGroup: 'Indentification Documents' },
//   { employeeGroup: 'Consent Forms', parentEmployeeGroup: 'Hiring Documents' },
//   { employeeGroup: 'Tax Documents', parentEmployeeGroup: 'Hiring Documents' },
//   { employeeGroup: 'Employment Eligibility', parentEmployeeGroup: 'Hiring Documents' },
//   { employeeGroup: 'Offer Letter', parentEmployeeGroup: 'Hiring Documents' },
// ];

const employeeProfile = {
  namespace: 'employeeProfile',
  state: {
    isModified: false,
    editGeneral: {
      openContactDetails: false,
      openEmployeeInfor: false,
      openPassport: false,
      openVisa: false,
      openPersonnalInfor: false,
      openAcademic: false,
      openTax: false,
      openBank: false,
    },
    paySlip: [],
    countryList: [],
    idCurrentEmployee: '',
    tenantCurrentEmployee: '',
    companyCurrentEmployee: '',
    listSkill: [],
    listTitle: [],
    listTitleByDepartment: [],
    listLocationsByCompany: [],
    locations: [],
    employeeTypes: [],
    departments: [],
    compensationTypes: [],
    employee: '',
    employees: [],
    jobTitleList: [],
    originData: {
      generalData: {},
      compensationData: {},
      passportData: [{}],
      visaData: [],
      employmentData: {},
      changeHistories: [],
      bankData: {},
      taxData: {},
      dependentDetails: [],
      benefitPlans: [],
    },
    tempData: {
      generalData: {},
      compensationData: {},
      passportData: [{}],
      visaData: [],
      document: {},
      bankData: {},
      taxData: {},
    },
    listPRReport: [],
    documentCategories: [],
    listDocuments: [],
    newDocument: {},
    documentDetail: {},
    groupViewingDocuments: [],
    AdhaarCard: {},
    emailsList: [],
    isUpdateEmployment: false,
    listRelation: [],
    listStates: [],
    revoke: [],
  },
  effects: {
    *fetchEmployeeIdByUserId({ payload }, { call, put }) {
      try {
        const response = yield call(getGeneralInfoByUserId, payload);
        const { statusCode, data } = response;
        // console.log(response);
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
    },

    *fetchGeneralInfo(
      { payload: { employee = '', tenantId = '' }, dataTempKept = {} },
      { call, put },
    ) {
      try {
        const response = yield call(getGeneralInfo, { employee, tenantId });
        const { statusCode, data: generalData = {} } = response;
        if (statusCode !== 200) throw response;
        const checkDataTempKept = JSON.stringify(dataTempKept) === JSON.stringify({});
        let generalDataTemp = {
          ...generalData,
        };
        if (!checkDataTempKept) {
          generalDataTemp = {
            ...generalDataTemp,
            ...dataTempKept,
          };
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
          if (
            // payload.takeEffect === 'UPDATED' &&
            statusCode === 200
          ) {
            const updates = yield call(getChangeHistories, {
              employee: payload.employee,
              tenantId: payload.tenantId,
            });
            // if (updates.statusCode !== 200) throw updates;
            yield put({ type: 'saveOrigin', payload: { changeHistories: updates.data } });
            const employment = yield call(getEmploymentInfo, {
              id: payload.employee,
              tenantId: payload.tenantId,
            });

            yield put({ type: 'saveOrigin', payload: { employmentData: employment.data } });
            if (employment.statusCode !== 200) throw response;
            const compensation = yield call(getCompensation, {
              employee: payload.employee,
              tenantId: payload?.tenantId,
            });
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
    *fetchCompensation({ payload: { employee = '', tenantId = '' } }, { call, put }) {
      try {
        const response = yield call(getCompensation, { employee, tenantId });
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
    *fetchPayslips(
      { payload: { employee = '', employeeGroup = '', tenantId = '' } },
      { call, put },
    ) {
      try {
        const response = yield call(getPayslip, { employee, employeeGroup, tenantId });
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
    *fetchPassPort(
      { payload: { employee = '', tenantId = '' }, dataTempKept = {} },
      { call, put },
    ) {
      try {
        const response = yield call(getPassPort, { employee, tenantId });
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
    *fetchVisa({ payload: { employee = '', tenantId = '' } }, { call, put }) {
      try {
        const response = yield call(getVisa, { employee, tenantId });
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
    *fetchEmployeeTypes({ payload: { tenantId = '' } }, { call, put }) {
      try {
        const response = yield call(getEmployeeTypeList, { tenantId });
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
    *fetchEmployees({ payload = {} }, { call, put }) {
      try {
        const response = yield call(getEmployeeList, payload);
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
          payload: { employee: idCurrentEmployee, tenantId: payload?.tenantId },
          dataTempKept,
        });
        if (key === 'openPassport') {
          yield put({
            type: 'saveOpenEdit',
            payload: { openPassport: false },
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
          payload: { employee: idCurrentEmployee, tenantId: payload?.tenantId },
          dataTempKept,
        });
        if (key === 'openVisa') {
          yield put({
            type: 'saveOpenEdit',
            payload: { openVisa: false },
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
          payload: { employee: idCurrentEmployee, tenantId: payload?.tenantId },
          dataTempKept,
        });
        if (key === 'openPassport') {
          yield put({
            type: 'saveOpenEdit',
            payload: { openPassport: false },
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
          payload: { employee: idCurrentEmployee, tenantId: payload?.tenantId },
          dataTempKept,
        });
        if (key === 'openVisa') {
          yield put({
            type: 'saveOpenEdit',
            payload: { openVisa: false },
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
        const { tenantCurrentEmployee } = yield select((state) => state.employeeProfile);
        yield put({
          type: 'fetchGeneralInfo',
          payload: { employee: idCurrentEmployee, tenantId: tenantCurrentEmployee },
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
          case 'openPassport':
            yield put({
              type: 'saveOpenEdit',
              payload: { openPassport: false },
            });
            break;
          case 'openVisa':
            yield put({
              type: 'saveOpenEdit',
              payload: { openVisa: false },
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
        return response;
      } catch (errors) {
        dialog(errors);
        return {};
      }
    },
    *updateFirstGeneralInfo(
      { payload = {}, dataTempKept = {}, key = '', isUpdateMyAvt = false },
      { put, call, select },
    ) {
      try {
        const { bankDetails = [], certifications = [], taxDetails = {} } = payload;
        if (bankDetails.length !== 0) {
          const res = yield call(addMultiBank, {
            listBank: bankDetails,
            tenantId: getCurrentTenant(),
          });
          const { statusCode } = res;
          if (statusCode !== 200) throw res;
        }
        if (taxDetails) {
          const res = yield call(getAddTax, { ...taxDetails, tenantId: getCurrentTenant() });
          const { statusCode } = res;
          if (statusCode !== 200) throw res;
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
        const { idCurrentEmployee } = yield select((state) => state.employeeProfile);
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        const { tenantCurrentEmployee } = yield select((state) => state.employeeProfile);
        yield put({
          type: 'fetchGeneralInfo',
          payload: { employee: idCurrentEmployee, tenantId: tenantCurrentEmployee },
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
          case 'openPassport':
            yield put({
              type: 'saveOpenEdit',
              payload: { openPassport: false },
            });
            break;
          case 'openVisa':
            yield put({
              type: 'saveOpenEdit',
              payload: { openVisa: false },
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
        return response;
      } catch (errors) {
        dialog(errors);
        return {};
      }
    },
    *fetchListTitle({ payload = {} }, { call, put }) {
      try {
        const response = yield call(getListTitle, payload);
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
    *fetchEmploymentInfo({ payload: { tenantId = '', id = '' } }, { call, put }) {
      let response = '';
      try {
        response = yield call(getEmploymentInfo, { tenantId, id });
        const { data, statusCode } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'saveOrigin', payload: { employmentData: data } });
        const { location = {}, department = {} } = data;

        const tenantCurrentEmployee = data.tenant;
        const companyCurrentEmployee = data.company?._id;
        const idCurrentEmployee = data._id;

        localStorage.setItem('tenantCurrentEmployee', tenantCurrentEmployee);
        localStorage.setItem('companyCurrentEmployee', companyCurrentEmployee);
        localStorage.setItem('idCurrentEmployee', idCurrentEmployee);

        yield put({
          type: 'save',
          payload: {
            tenantCurrentEmployee,
            companyCurrentEmployee,
            idCurrentEmployee,
          },
        });

        // fetch employees to show in "select manager" of employee
        yield put({
          type: 'fetchEmployees',
          payload: {
            company: [{ _id: companyCurrentEmployee, tenant: tenantCurrentEmployee }],
            location: [
              {
                state: [location?.headQuarterAddress?.state],
                country: location?.headQuarterAddress?.country,
              },
            ],
            status: ['ACTIVE'],
            department: [department?.name],
          },
        });
      } catch (error) {
        dialog(error.message);
      }
      return response;
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
    *fetchDocumentCategories({ payload = {} }, { call, put }) {
      try {
        const response = yield call(getDocumentCategories, payload);
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
        const response = yield call(getDocuments, payload);
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
        const response = yield call(getDocumentById, payload);
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
        const response = yield call(getDocumentUpdate, payload);
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
        const response = yield call(getEmailsListByCompany, payload);
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
    *fetchChangeHistories({ payload: { employee = '', tenantId = '' } = {} }, { call, put }) {
      try {
        const response = yield call(getChangeHistories, { employee, tenantId });
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
    *fetchAdhaardCard({ payload: { employee = '', tenantId = '' } }, { call, put }) {
      try {
        const response = yield call(getAdhaardCard, { employee, tenantId });
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
        const { tenantCurrentEmployee } = yield select((state) => state.employeeProfile);

        const {
          statusCode,
          data: { _id: id },
        } = response;
        if (statusCode !== 200) throw response;
        idAdhaarcard = id;
        yield put({
          type: 'fetchAdhaardCard',
          payload: { employee: idCurrentEmployee, tenantId: tenantCurrentEmployee },
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
        const { tenantCurrentEmployee } = yield select((state) => state.employeeProfile);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'saveTemp', payload: { document: data } });
        doc = data;
        yield put({
          type: 'fetchAdhaardCard',
          payload: { employee: idCurrentEmployee, tenantId: tenantCurrentEmployee },
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
    *fetchBank({ payload: { employee = '', tenantId = '' } }, { call, put }) {
      try {
        const response = yield call(getBank, { employee, tenantId });
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
        const { tenantCurrentEmployee } = yield select((state) => state.employeeProfile);
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        yield put({
          type: 'fetchBank',
          payload: { employee: idCurrentEmployee, tenantId: tenantCurrentEmployee },
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
    *addMultiBank({ payload = {} }, { call }) {
      try {
        const response = yield call(addMultiBank, payload);
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
      } catch (errors) {
        dialog(errors);
      }
    },
    *addNewTax({ payload = {} }, { call }) {
      try {
        const response = yield call(getAddTax, payload);
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
      } catch (errors) {
        dialog(errors);
      }
    },
    *updateBank({ payload = {}, dataTempKept = {}, key = '' }, { put, call, select }) {
      try {
        const response = yield call(updateBank, payload);
        const { idCurrentEmployee } = yield select((state) => state.employeeProfile);
        const { tenantCurrentEmployee } = yield select((state) => state.employeeProfile);
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        yield put({
          type: 'fetchBank',
          payload: { employee: idCurrentEmployee, tenantId: tenantCurrentEmployee },
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
    *fetchTax({ payload: { employee = '', tenantId = '' } }, { call, put }) {
      try {
        const response = yield call(getTax, { employee, tenantId });
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
        const { tenantCurrentEmployee } = yield select((state) => state.employeeProfile);

        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        yield put({
          type: 'fetchTax',
          payload: { employee: idCurrentEmployee, tenantId: tenantCurrentEmployee },
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
        const { tenantCurrentEmployee } = yield select((state) => state.employeeProfile);

        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        yield put({
          type: 'fetchTax',
          payload: { employee: idCurrentEmployee, tenantId: tenantCurrentEmployee },
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
        const res = yield call(getListTitle, payload);
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
      let isUpdateEmployment = false;
      try {
        const response = yield call(updateEmployment, payload);
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        const employment = yield call(getEmploymentInfo, {
          id: payload.id,
          tenantId: payload.tenantId,
        });
        yield put({ type: 'saveOrigin', payload: { employmentData: employment.data } });
        isUpdateEmployment = true;
      } catch (errors) {
        dialog(errors);
      }
      yield put({ type: 'save', payload: { isUpdateEmployment } });
    },
    *uploadDocument({ data = {} }, { call, put }) {
      try {
        const response = yield call(getDocumentAdd, data);

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
        const { tenantCurrentEmployee } = yield select((state) => state.employeeProfile);
        yield put({
          type: 'fetchGeneralInfo',
          payload: { employee: idCurrentEmployee, tenantId: tenantCurrentEmployee },
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
      let response;
      try {
        response = yield call(getCountryStates, payload);
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
        const response = yield call(getRevokeHistory, payload);
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
            tenantId: payload.tenantId,
          });
          yield put({
            type: 'saveOrigin',
            payload: { employmentData: employment.data },
          });
          if (employment.statusCode !== 200) throw response;
          const compensation = yield call(getCompensation, {
            employee: payload.employee,
            tenantId: payload.tenantId,
          });
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
      } catch (errors) {
        dialog(errors);
      }
    },

    *shareDocumentEffect({ payload = {} }, { call }) {
      let response;
      try {
        response = yield call(shareDocument, payload);
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *fetchEmployeeDependentDetails({ payload = {} }, { call, put }) {
      try {
        const response = yield call(getDependentsByEmployee, payload);
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
        const response = yield call(addDependentsOfEmployee, payload);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'saveOrigin', payload: { dependentDetails: data } });
        return response;
      } catch (error) {
        dialog(error);
        return {};
      }
    },
    *updateEmployeeDependentDetails({ payload = {} }, { call, put }) {
      try {
        const response = yield call(updateDependentsById, payload);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'saveOrigin', payload: { dependentDetails: data } });
        return response;
      } catch (error) {
        dialog(error);
        return {};
      }
    },
    *removeEmployeeDependentDetails({ payload = {} }, { call, put }) {
      try {
        const response = yield call(removeDependentsById, payload);
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'saveOrigin', payload: { dependentDetails: {} } });
        return response;
      } catch (error) {
        dialog(error);
        return {};
      }
    },
    *getBenefitPlans({ payload }, { call, put }) {
      try {
        const response = yield call(getBenefitPlans, payload);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'saveOrigin', payload: { benefitPlans: data } });
      } catch (error) {
        dialog(error);
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
    closeModeEdit(state) {
      return {
        ...state,
        editGeneral: {
          openContactDetails: false,
          openEmployeeInfor: false,
          openPassport: false,
          openVisa: false,
          openPersonnalInfor: false,
          openAcademic: false,
          openTax: false,
          openBank: false,
        },
      };
    },
    clearState(state) {
      return {
        ...state,
        paySlip: [],
        countryList: [],
        idCurrentEmployee: '',
        tenantCurrentEmployee: '',
        companyCurrentEmployee: '',
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
        originData: {},
        tempData: {},
        listPRReport: [],
        AdhaarCard: {},
        isUpdateEmployment: false,
        listRelation: [],
        listStates: [],
        revoke: [],
      };
    },
  },
};
export default employeeProfile;
