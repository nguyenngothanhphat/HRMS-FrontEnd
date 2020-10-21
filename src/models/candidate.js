import { getById, getDocumentByCandidate, updateByCandidate } from '@/services/candidate';
import { dialog } from '@/utils/utils';

const candidateProfile = {
  namespace: 'candidateProfile',
  state: {
    currentStep: 1,
    rookieId: '',
    checkMandatory: {
      filledBasicInformation: true,
      filledJobDetail: false,
    },
    data: {
      _id: '',
      candidate: '',
      fullName: '',
      privateEmail: '',
      workEmail: '',
      previousExperience: '',
      noticePeriod: '',
      dateOfJoining: '',
      documentList: [],
    },
    tempData: {
      checkStatus: {},
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
    eligibilityDocs: [
      {
        type: 'A',
        name: 'Identity Proof',
        data: [
          { name: 'Aahar Card', value: false },
          { name: 'PAN Card', value: false },
          { name: 'Passport', value: false },
          { name: 'Driving License', value: false },
          { name: 'Voter Card', value: false },
        ],
      },
      {
        type: 'B',
        name: 'Address Proof',
        data: [
          { name: 'Rental Aggreement', value: false },
          { name: 'Electricity & Utility Bills', value: false },
          { name: 'Telephone Bills', value: false },
        ],
      },
      {
        type: 'C',
        name: 'Educational',
        data: [
          { name: 'SSLC', value: false },
          { name: 'Intermediate/Diploma', value: false },
          { name: 'Graduation', value: false },
          { name: 'Post Graduate', value: false },
          { name: 'PHP/Doctorate', value: false },
        ],
      },
      {
        type: 'D',
        name: 'Technical Certifications',
        data: [
          { name: 'Offer letter', value: false },
          { name: 'Appraisal letter', value: false },
          { name: 'Paystubs', value: false },
          { name: 'Form 16', value: false },
          { name: 'Relieving Letter', value: false },
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
  effects: {
    *fetchCandidateById({ payload }, { call, put }) {
      try {
        const response = yield call(getById, payload);
        const { data, statusCode } = response;
        const dataObj = data.find((x) => x);
        if (statusCode !== 200) throw response;
        yield put({
          type: 'saveOrigin',
          payload: { ...dataObj, candidate: dataObj._id, _id: dataObj._id },
        });
      } catch (error) {
        dialog(error);
      }
    },

    *fetchDocumentByCandidate({ payload }, { call, put }) {
      try {
        const response = yield call(getDocumentByCandidate, payload);
        const { data, statusCode } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'saveOrigin',
          payload: { documentList: { ...data } },
        });
      } catch (error) {
        dialog(error);
      }
    },

    *updateByCandidateModel({ payload }, { call, put }) {
      console.log('payload3', payload);
      try {
        const response = yield call(updateByCandidate, payload);
        const { data, statusCode } = response;
        console.log('data2', data);
        if (statusCode !== 200) throw response;
        yield put({
          type: 'saveOrigin',
          payload: { ...data },
        });
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
    saveOrigin(state, action) {
      const { data } = state;
      return {
        ...state,
        data: {
          ...data,
          ...action.payload,
        },
      };
    },
    saveCurrentUser(state, action) {
      return { ...state, currentUser: action.payload || {} };
    },
  },
};
export default candidateProfile;
