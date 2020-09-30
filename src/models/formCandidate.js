// import {
//   LocationFilter,
//   DepartmentFilter,
//   EmployeeTypeFilter,
//   getListEmployeeMyTeam,
//   getListEmployeeActive,
//   getListEmployeeInActive,
// } from '../services/employee';
import { getDocumentList } from '@/services/addNewMember';
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
      compensation: 'Salary',
      currency: 'Dollar',
      timeoff: 'can not',
    },
    eligibilityDocs: {
      email: '',
      generateLink: '',
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
      position: 1,
      classification: 1,
      department: '',
      jobTitle: '',
      jobCategory: '',
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
      file: null,
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
    originData: {
      generalData: {},
      compensationData: {},
    },
    tempData: {
      generalData: {},
      compensationData: {},
    },
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

    *fetchDocumentList(_, { call, put }) {
      try {
        const response = yield call(getDocumentList);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'saveEligibilityRequirement', payload: { testEligibility: data } });
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
