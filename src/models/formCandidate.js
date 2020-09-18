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
      idProof: {
        aadharCard : true,
        PAN : true,
        passport: false,
        drivingLicense: false,
        voterCard: false
      },
      addProof: {
        rentalAgreement: false,
        electricityBill: false,
        telephoneBill: false
      },
      edu: {
        sslc: true,
        diploma: true,
        graduation: true,
        postGraduate: false,
        phd: false
      },
      techCerti: [{
        name: '',
        duration: '',
        poe: {
          offerLetter: false,
          appraisalLetter: false,
          paystubs: false,
          form16: false,
          relievingLetter: false
        }
      }]
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
    checkMandatory: {
      filledBasicInformation: false,
      filledJobDetail: false,
    },
    offerDetailField: {
      currency: true,
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
        ...action.payload
      }
    }
  },
};
export default info;
