import { history } from 'umi';
import moment from 'moment';
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
import { candidateLink, taskStatus } from '@/utils/candidatePortal';
import { PROCESS_STATUS } from '@/utils/onboarding';

const pendingTaskDefault = [
  {
    id: candidateLink.reviewProfile,
    name: 'Review Profile',
    dueDate: '-',
    link: candidateLink.reviewProfile,
    status: taskStatus.UPCOMING,
  },
  {
    id: candidateLink.uploadDocuments,
    name: 'Upload Documents',
    dueDate: '-',
    link: candidateLink.uploadDocuments,
    status: taskStatus.UPCOMING,
  },
  {
    id: candidateLink.salaryNegotiation,
    name: 'Salary Negotiation',
    dueDate: '-',
    link: candidateLink.salaryNegotiation,
    status: taskStatus.UPCOMING,
  },
  {
    id: candidateLink.acceptOffer,
    name: 'Accept Offer',
    dueDate: '-',
    link: candidateLink.acceptOffer,
    status: taskStatus.UPCOMING,
  },
];

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
    // pending tasks
    pendingTasks: [],
  },
  effects: {
    *fetchCandidateById({ payload }, { call, put }) {
      let response = {};
      const checkMandatory = {
        filledBasicInformation: true,
        filledJobDetail: true,
        filledSalaryStructure: false,
        filledDocumentVerification: true,
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
        // yield put({
        //   type: 'candidatePortal/refreshPendingTasks',
        // });
      } catch (error) {
        dialog(error);
      }
      return response;
    },

    *fetchDocumentByCandidate({ payload }, { call, put }) {
      let response = '';
      try {
        response = yield call(getDocumentByCandidate, payload);
        const { data, statusCode } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'saveOrigin',
          payload: { documentList: [...data] },
        });
        // if there are any resubmit documents, show resubmit tasks
        yield put({
          type: 'refreshPendingTasks',
        });
      } catch (error) {
        dialog(error);
      }
      return response;
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
        history.push('/candidate-portal/dashboard');
        yield null;
      } catch (error) {
        dialog(error);
      }
    },

    // pending tasks
    *refreshPendingTasks(_, { put, select }) {
      try {
        const dateFormat = 'MM.DD.YY';
        const tempPendingTasks = pendingTaskDefault;
        const {
          // candidate = '',
          // ticketId = '',
          data = {},
        } = yield select((state) => state.candidatePortal);
        const {
          currentStep,
          processStatus = '',
          expiryDate = '',
          documentList = [],
          isVerifiedJobDetail,
          isVerifiedBasicInfo,
          // isAcceptedJoiningDate,
        } = data || {};

        // if there are any resubmit documents, show resubmit tasks
        if (processStatus === PROCESS_STATUS.PENDING && documentList.length > 0) {
          const checkDocumentResubmit = documentList.some(
            (x) => x.candidateDocumentStatus === 'RE-SUBMIT',
          );
          const checkDocumentVerified = documentList.some(
            (x) =>
              (x.candidateGroup !== 'E' && x.candidateDocumentStatus === 'PENDING') ||
              (x.candidateGroup === 'E' && x.employer && x.candidateDocumentStatus === 'PENDING'),
          );

          if (checkDocumentResubmit) {
            tempPendingTasks[1].status = taskStatus.IN_PROGRESS;
            tempPendingTasks[1].name = 'Resubmit Documents';
          } else if (!checkDocumentVerified) {
            // salary structure
            tempPendingTasks[2].status = taskStatus.IN_PROGRESS;
          }
        }

        switch (processStatus) {
          case PROCESS_STATUS.SENT_PROVISIONAL_OFFERS:
            if (currentStep < 3) {
              // review profile
              tempPendingTasks[0].status = taskStatus.IN_PROGRESS;
              // uploading documents
              tempPendingTasks[1].status = taskStatus.IN_PROGRESS;
            }
            if (currentStep >= 3) {
              // salary structure
              tempPendingTasks[2].status = taskStatus.IN_PROGRESS;
            }
            if (isVerifiedJobDetail && isVerifiedBasicInfo) {
              // review profile
              tempPendingTasks[0].status = taskStatus.DONE;
            }
            break;

          case PROCESS_STATUS.ACCEPTED_PROVISIONAL_OFFERS:
            // case PROCESS_STATUS.RENEGOTIATE_PROVISIONAL_OFFERS:
            // uploading documents
            tempPendingTasks[1].status = taskStatus.DONE;
            break;

          // case PROCESS_STATUS.PENDING:
          case PROCESS_STATUS.ELIGIBLE_CANDIDATES:
          case PROCESS_STATUS.INELIGIBLE_CANDIDATES:
          case PROCESS_STATUS.RENEGOTIATE_PROVISIONAL_OFFERS:
            // salary structure
            tempPendingTasks[2].status = taskStatus.IN_PROGRESS;
            break;

          case PROCESS_STATUS.SENT_FINAL_OFFERS:
          case PROCESS_STATUS.ACCEPTED_FINAL_OFFERS:
          case PROCESS_STATUS.RENEGOTIATE_FINAL_OFFERS:
            // offer letter
            tempPendingTasks[3].status = taskStatus.IN_PROGRESS;
            tempPendingTasks[3].dueDate = expiryDate ? moment(expiryDate).format(dateFormat) : '';
            break;

          default:
            break;
        }
        yield put({
          type: 'candidatePortal/save',
          payload: {
            pendingTasks: [...tempPendingTasks],
          },
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
