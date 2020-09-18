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
      salaryStatus: 1,
    },
    offerDetailField: {
      currency: true,
    },
    benefits: {
      globalEmployee: [
        {
          medical: {
            accessPlus: false,
            basePlan: false,
            isChecked: false,
            checkedList: [],
          },
          dental: {
            isChecked: false,
            checkedList: [],
          },
          vision: {
            isChecked: false,
            checkedList: [],
          },
          life: {
            basicLife: false,
            volLife: false,
            isChecked: false,
            checkedList: [],
          },
          shortTerm: {
            basicLife: false,
            volLife: false,
            isChecked: false,
            checkedList: [],
          },
        },
      ],
    },
    customField: {
      dental: 'tier1',
      vision: 'tier1',
      medical: 'tier1',
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
