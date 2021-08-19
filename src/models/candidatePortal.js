import {
  addAttachmentService,
  candidateFinalOffer,
  getById,
  getDocumentByCandidate,
  getWorkHistory,
  updateWorkHistory,
  sendEmailByCandidateModel,
  updateByCandidate,
} from '@/services/candidatePortal';
import { dialog } from '@/utils/utils';
import { history } from 'umi';

const candidatePortal = {
  namespace: 'candidatePortal',
  state: {
    candidate: '',
    ticketId: '',
    // currentStep: 1,
    localStep: 1,
    rookieId: '',
    checkMandatory: {
      filledBasicInformation: true,
      filledJobDetail: false,
      filledSalaryStructure: false,
      filledDocumentVerification: false,
      isCandidateAcceptDOJ: true,
    },
    data: {
      _id: '',
      candidate: '',
      firstName: '',
      middleName: '',
      lastName: '',
      privateEmail: '',
      workEmail: '',
      previousExperience: '',
      noticePeriod: '',
      dateOfJoining: '',
      processStatus: '',
      documentList: [],
      attachments: {},
      documentListToRender: [],
      workLocation: {},
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
      workHistory: [],
    },
    tempData: {
      checkStatus: {},
      firstName: '',
      middleName: '',
      lastName: '',
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
    eligibilityDocs: [],
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
    isCandidateAcceptDOJ: true,
  },
  effects: {
    *fetchCandidateById({ payload }, { call, put }) {
      let response = {};
      const checkMandatory = {
        filledBasicInformation: true,
        filledJobDetail: false,
        filledSalaryStructure: false,
        filledDocumentVerification: false,
        isCandidateAcceptDOJ: true,
      };
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
            // ...data,
            candidate: data._id,
            ticketId: data.ticketID,
            salaryStructure: data.salaryStructure.settings,
            checkMandatory: { ...checkMandatory },
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
        const { candidate } = yield select((state) => state.candidatePortal);
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
        const { candidate } = yield select((state) => state.candidatePortal);

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
    *fetchWorkHistory({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getWorkHistory, payload);
        const { data, statusCode } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'saveOrigin',
          payload: {
            workHistory: data,
          },
        });
      } catch (error) {
        dialog(error);
      }
      return response;
    },
    *updateWorkHistory({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(updateWorkHistory, payload);
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'fetchWorkHistory',
          payload: {
            candidate: payload.candidate,
            tenantId: payload.tenantId,
          },
        });
      } catch (error) {
        dialog(error);
      }
      return response;
    },
    *sendEmailByCandidate({ payload }, { call, select }) {
      let response = {};
      try {
        const { candidate } = yield select((state) => state.candidatePortal);
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
          firstName: '',
          middleName: '',
          lastName: '',
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
          firstName: '',
          middleName: '',
          lastName: '',
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
        eligibilityDocs: [],
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
export default candidatePortal;
