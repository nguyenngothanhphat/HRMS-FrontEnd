// import {
//   LocationFilter,
//   DepartmentFilter,
//   EmployeeTypeFilter,
//   getListEmployeeMyTeam,
//   getListEmployeeActive,
//   getListEmployeeInActive,
// } from '../services/employee';

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
      idProof: [],
      addProof: [],
      edu: [],
      techCerti: [
        {
          name: '',
          duration: '',
          poe: [],
        },
      ],
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
    },

    //   medicalCheckbox: {
    //     isChecked: false,
    //     choicePlan: false,
    //     basePlan: false,
    //     checkedList: [],
    //   },
    //   lifeCheckbox: {
    //     isChecked: false,
    //     basicLife: false,
    //     volLife: false,
    //     checkedList: [],
    //   },
    //   shortTermCheckbox: {
    //     isChecked: false,
    //     basicLife: false,
    //     volLife: false,
    //     checkedList: [],
    //   },
    //   visionCheckbox: false,
    //   dentalCheckbox: false,
    // },

    customField: {
      // dental: 'tier1',
      // vision: 'tier1',
      // medical: 'tier1',
      dental: undefined,
      vision: undefined,
      medical: undefined,
      additionalInfo: '',
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
  },
};
export default info;
