import {
  addAttachmentService,
  candidateFinalOffer,
  getById,
  getDocumentByCandidate,
  getWorkHistory,
  sendEmailByCandidateModel,
  updateByCandidate,
} from '@/services/candidate';
import { dialog } from '@/utils/utils';
import { history } from 'umi';

const candidateProfile = {
  namespace: 'candidateProfile',
  state: {
    candidate: '',
    ticketId: '',
    // currentStep: 1,
    localStep: 1,
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
      processStatus: '',
      documentList: [],
      attachments: {},
      documentListToRender: [],
      workLocation: '',
      candidateSignature: {
        fileName: '',
        _id: '',
        url: '',
      },
      finalOfferCandidateSignature: {
        fileName: '',
        _id: '',
        url: '',
      },
    },
    tempData: {
      checkStatus: {},
      fullName: '',
      privateEmail: '',
      experienceYear: '',
      workLocation: '',
      options: 1,
      candidateSignature: {
        fileName: '',
        _id: '',
        url: '',
      },
      finalOfferCandidateSignature: {
        fileName: '',
        _id: '',
        url: '',
      },
      questionOnBoarding: [],
    },
    salaryStructure: [],
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
      filledOfferDetails: false,
      filledBenefits: false,
      filledAdditionalQuestion: false,
      salaryStatus: 2,
    },
    // questionOnBoarding: [],
  },
  effects: {
    *fetchCandidateById({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getById, payload);
        const { data, statusCode } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'saveOrigin',
          payload: {
            ...data,
            candidate: data._id,
            _id: data._id,
          },
        });
        yield put({
          type: 'saveTemp',
          payload: {
            candidateSignature: data.candidateSignature,
            questionOnBoarding: data.questionOnBoarding || [],
          },
        });
        yield put({
          type: 'save',
          payload: {
            ...data,
            candidate: data._id,
            ticketId: data.ticketID,
            salaryStructure: data.salaryStructure.settings,
          },
        });
      } catch (error) {
        dialog(error);
      }
      return response;
    },

    *fetchDocumentByCandidate({ payload }, { call, put }) {
      try {
        const response = yield call(getDocumentByCandidate, payload);
        const { data, statusCode } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'saveOrigin',
          payload: { documentList: [...data] },
        });
      } catch (error) {
        dialog(error);
      }
    },

    *updateByCandidateEffect({ payload }, { call, select }) {
      let response;
      try {
        const { candidate } = yield select((state) => state.candidateProfile);
        response = yield call(updateByCandidate, { ...payload, candidate });

        const { statusCode } = response;
        if (statusCode !== 200) throw response;
      } catch (error) {
        dialog(error);
      }
      return response;
    },

    *addAttachmentCandidate({ payload }, { call, put, select }) {
      let response = {};
      try {
        const { candidate } = yield select((state) => state.candidateProfile);

        response = yield call(addAttachmentService, { ...payload, candidate });
        const { data, statusCode } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'saveOrigin',
          payload: { attachments: data },
        });
      } catch (error) {
        dialog(error);
      }
      return response;
    },
    *fetchEmployer({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getWorkHistory, payload);
        const { data, statusCode } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'saveOrigin',
          payload: { employerId: data._id, employerName: data.employer },
        });
      } catch (error) {
        dialog(error);
      }
      return response;
    },
    *sendEmailByCandidate({ payload }, { call, select }) {
      let response = {};
      try {
        const { candidate } = yield select((state) => state.candidateProfile);
        response = yield call(sendEmailByCandidateModel, { ...payload, candidate });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
      } catch (error) {
        dialog(error);
      }
      return response;
    },

    *submitCandidateFinalOffer({ payload }, { call }) {
      let response = {};
      try {
        response = yield call(candidateFinalOffer, payload);
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
      } catch (error) {
        dialog(error);
      }
      return response;
    },

    *refreshPage() {
      try {
        history.push('/candidate');
        yield null;
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
    saveAttachments(state, action) {
      const { data } = state;
      const { attachments } = data;
      return {
        ...state,
        data: {
          ...data,
          attachments: [...attachments, action.payload],
        },
      };
    },
    saveCurrentUser(state, action) {
      return { ...state, currentUser: action.payload || {} };
    },

    clearAll() {
      // const {}
      return {
        candidate: '',
        ticketId: '',
        // currentStep: 1,
        localStep: 1,
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
          processStatus: '',
          documentList: [],
          attachments: {},
          documentListToRender: [],
          workLocation: '',
          candidateSignature: {
            fileName: '',
            _id: '',
            url: '',
          },
          finalOfferCandidateSignature: {
            fileName: '',
            _id: '',
            url: '',
          },
        },
        tempData: {
          questionOnBoarding: [],
          checkStatus: {},
          fullName: '',
          privateEmail: '',
          experienceYear: '',
          workLocation: '',
          options: 1,
          candidateSignature: {
            fileName: '',
            _id: '',
            url: '',
          },
          finalOfferCandidateSignature: {
            fileName: '',
            _id: '',
            url: '',
          },
        },
        salaryStructure: [],
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
          filledOfferDetails: false,
          filledBenefits: false,
          salaryStatus: 2,
        },
      };
    },
  },
};
export default candidateProfile;
