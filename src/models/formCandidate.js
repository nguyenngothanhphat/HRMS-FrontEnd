// import {
//   LocationFilter,
//   DepartmentFilter,
//   EmployeeTypeFilter,
//   getListEmployeeMyTeam,
//   getListEmployeeActive,
//   getListEmployeeInActive,
// } from '../services/employee';
import {
  getDocumentList,
  getDepartmentList,
  getTitleList,
  getLocation,
  getEmployeeTypeList,
  getManagerList,
} from '@/services/addNewMember';
import { dialog } from '@/utils/utils';

const info = {
  namespace: 'info',
  state: {
    basicInformation: {
      fullName: '',
      privateEmail: '',
      workEmail: '',
      experienceYear: '',
    },
    offerDetail: {
      includeOffer: false,
      file: 'Template.docx',
      agreement: false,
      handbook: false,
      compensation: 'salary',
      currency: 'Dollar',
      timeoff: 'can not',
    },
    eligibilityDocs: {
      email: '',
      generateLink: '',
      fullName: '',
      isSentEmail: false,
      isMarkAsDone: false,
      identityProof: {
        aadharCard: true,
        PAN: true,
        passport: false,
        drivingLicense: false,
        voterCard: false,
        listSelected: [],
        isChecked: false,
      },
      addressProof: {
        rentalAgreement: false,
        electricityBill: false,
        telephoneBill: false,
        listSelected: [],
        isChecked: false,
      },
      educational: {
        sslc: true,
        diploma: true,
        graduation: true,
        postGraduate: false,
        phd: false,
        listSelected: [],
        isChecked: false,
      },
      technicalCertification: {
        name: '',
        duration: '',
        poe: {
          offerLetter: false,
          appraisalLetter: false,
          paystubs: false,
          form16: false,
          relievingLetter: false,
          listSelected: [],
          isChecked: false,
        },
      },
    },
    jobDetail: {
      position: 'EMPLOYEE',
      employeeType: '5f50c2541513a742582206f9',
      department: '',
      title: '',
      workLocation: '',
      reportingManager: '',
      candidatesNoticePeriod: '',
      prefferedDateOfJoining: '',
    },
    salaryStructure: {
      rejectComment: '',
    },
    checkMandatory: {
      filledBasicInformation: false,
      filledJobDetail: false,
      filledCustomField: false,
      salaryStatus: 2,
    },
    previewOffer: {
      file: '',
      file2: '',
      day: '',
      month: '',
      year: '',
      place: '',
      city: '',
      day2: '',
      month2: '',
      year2: '',
      place2: '',
      city2: '',
      mail: '',
    },
    benefits: {
      medical: false,
      life: false,
      shortTerm: false,
      listSelectedMedical: [],
      listSelectedLife: [],
      listSelectedShortTerm: [],
      dental: false,
      vision: false,
      employeeProvident: false,
      paytmWallet: false,
      listSelectedEmployee: [],
    },

    customField: {
      // dental: 'tier1',
      // vision: 'tier1',
      // medical: 'tier1',
      dental: undefined,
      vision: undefined,
      medical: undefined,
      additionalInfo: '',
    },
    testEligibility: [],
    departmentList: [],
    titleList: [],
    locationList: [],
    employeeTypeList: [],
    managerList: [],
    company: {},
    department: {},
    loading: null,
    loadingA: true,
    loadingB: true,
    loadingC: true,
    loadingD: true,
    loadingE: null,
    loadingDocumentList: true,
    data: {},
  },
  effects: {
    // *fetchEmployeeType(_, { call, put }) {
    //   try {
    //     const response = yield call(EmployeeTypeFilter);
    //     const { statusCode, data: employeetype = [] } = response;
    //     if (statusCode !== 200) throw response;
    //     yield put({ type: 'saveEmployeeType', payload: { employeetype } });
    //   } catch (errors) {
    //     dialog(errors);
    //   }
    // },
    // *fetchPageData(_,{call,put}) {
    //   try {

    //   }
    // },

    *fetchDocumentList(_, { call, put }) {
      try {
        const response = yield call(getDocumentList);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'saveEligibilityRequirement',
          payload: { testEligibility: data, loadingDocumentList: false },
        });
      } catch (errors) {
        dialog(errors);
      }
    },

    *fetchDepartmentList({ payload: { company = '' } }, { call, put }) {
      try {
        const response = yield call(getDepartmentList, { company });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { departmentList: data, loadingA: false } });
      } catch (errors) {
        dialog(errors);
      }
    },

    *fetchTitleList({ payload: { company = '' } }, { call, put }) {
      try {
        const response = yield call(getTitleList, { company });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { titleList: data, loadingB: false } });
      } catch (errors) {
        dialog(errors);
      }
    },

    *fetchLocationList(_, { call, put }) {
      try {
        const response = yield call(getLocation);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { locationList: data, loadingC: false } });
      } catch (errors) {
        dialog(errors);
      }
    },

    *fetchEmployeeTypeList(_, { call, put }) {
      try {
        const response = yield call(getEmployeeTypeList);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { employeeTypeList: data, loadingD: false } });
      } catch (errors) {
        dialog(errors);
      }
    },

    *fetchManagerList({ payload: { department = '' } }, { call, put }) {
      try {
        const response = yield call(getManagerList, { department });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { managerList: data, loadingE: false } });
      } catch (errors) {
        dialog(errors);
      }
    },
  },
  reducers: {
    saveBasicInformation(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    saveJobDetail(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    saveEligibilityRequirement(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    saveBenefits(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    getDocumentList(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
export default info;
