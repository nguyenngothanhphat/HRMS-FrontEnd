import { getDocumentByCandidate } from '@/services/candidate';
import { dialog } from '@/utils/utils';

const candidateProfile = {
  namespace: 'candidateProfile',
  state: {
    currentStep: 1,
    tempData: {},
    basicInformation: {
      fullName: '',
      privateEmail: '',
      experienceYear: '',
      workLocation: '',
    },
    jobDetails: {
      position: 'EMPLOYEE',
      employeeType: '5f50c2541513a742582206f9',
      department: '',
      title: '',
      workLocation: '',
      reportingManager: '',
      candidatesNoticePeriod: '',
      prefferedDateOfJoining: '',
    },
    eliDocs: [
      {
        type: 'A',
        name: 'Identity Proof',
        data: [
          { name: 'Aahar Card', value: false, isUploaded: null },
          { name: 'PAN Card', value: false, isUploaded: null },
          { name: 'Passport', value: false, isUploaded: null },
          { name: 'Driving License', value: false, isUploaded: null },
          { name: 'Voter Card', value: false, isUploaded: null },
        ],
      },
      {
        type: 'B',
        name: 'Address Proof',
        data: [
          { name: 'Rental Aggreement', value: false, isUploaded: null },
          { name: 'Electricity & Utility Bills', value: false, isUploaded: null },
          { name: 'Telephone Bills', value: false, isUploaded: null },
        ],
      },
      {
        type: 'C',
        name: 'Educational',
        data: [
          { name: 'SSLC', value: false, isUploaded: null },
          { name: 'Intermediate/Diploma', value: false, isUploaded: null },
          { name: 'Graduation', value: false, isUploaded: null },
          { name: 'Post Graduate', value: false, isUploaded: null },
          { name: 'PHP/Doctorate', value: false, isUploaded: null },
        ],
      },
      {
        type: 'D',
        name: 'Technical Certifications',
        data: [
          { name: 'Offer letter', value: false, isUploaded: null },
          { name: 'Appraisal letter', value: false, isUploaded: null },
          { name: 'Paystubs', value: false, isUploaded: null },
          { name: 'Form 16', value: false, isUploaded: null },
          { name: 'Relieving Letter', value: false, isUploaded: null },
        ],
      },
    ],
    checkCandidateMandatory: {
      filledCandidateBasicInformation: false,
      filledCandidateJobDetails: false,
      filledCandidateCustomField: false,
      salaryStatus: 2,
    },
  },
  effect: {
    *fetchDocListsByCandidate({ payload }, { call, put }) {
      try {
        const response = yield call(getDocumentByCandidate, payload);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'saveTemp', payload: data });
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
  },
};
export default candidateProfile;
