import { getById, getDocumentByCandidate } from '@/services/candidate';
import { dialog } from '@/utils/utils';

import { getRookieInfo } from '@/services/formCandidate';

const candidateProfile = {
  namespace: 'candidateProfile',
  state: {
    currentStep: 1,
    rookieId: '',
    data: {
      _id: '',
      candidate: '',
    },
    tempData: {
      checkStatus: {},
      fullName: '',
      privateEmail: '',
      experienceYear: '',
      workLocation: '',
    },
    checkMandatory: {
      filledBasicInformation: false,
      filledJobDetail: false,
      filledCustomField: false,
      filledOfferDetail: false,
      salaryStatus: 2,
    },
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
      console.log('payload model', payload);
      try {
        const response = yield call(getById, payload);
        const { data, statusCode } = response;
        const dataObj = data.find((x) => x);
        console.log('data123', data);
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
      console.log('payload model2', payload);
      try {
        const response = yield call(getDocumentByCandidate, payload);
        const { data, statusCode } = response;
        console.log('data2', response);
        if (statusCode !== 200) throw response;
        yield put({
          type: 'saveOrigin',
          payload: { data },
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
  },
};
export default candidateProfile;
