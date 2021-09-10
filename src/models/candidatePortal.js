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
import { CANDIDATE_TASK_LINK, CANDIDATE_TASK_STATUS } from '@/utils/candidatePortal';
import { NEW_PROCESS_STATUS } from '@/utils/onboarding';

const pendingTaskDefault = [
  {
    id: CANDIDATE_TASK_LINK.REVIEW_PROFILE,
    name: 'Review Profile',
    dueDate: '-',
    link: CANDIDATE_TASK_LINK.REVIEW_PROFILE,
    status: CANDIDATE_TASK_STATUS.UPCOMING,
  },
  {
    id: CANDIDATE_TASK_LINK.UPLOAD_DOCUMENTS,
    name: 'Upload Documents',
    dueDate: '-',
    link: CANDIDATE_TASK_LINK.UPLOAD_DOCUMENTS,
    status: CANDIDATE_TASK_STATUS.UPCOMING,
  },
  {
    id: CANDIDATE_TASK_LINK.SALARY_NEGOTIATION,
    name: 'Salary Negotiation',
    dueDate: '-',
    link: CANDIDATE_TASK_LINK.SALARY_NEGOTIATION,
    status: CANDIDATE_TASK_STATUS.UPCOMING,
  },
  {
    id: CANDIDATE_TASK_LINK.ACCEPT_OFFER,
    name: 'Accept Offer',
    dueDate: '-',
    link: CANDIDATE_TASK_LINK.ACCEPT_OFFER,
    status: CANDIDATE_TASK_STATUS.UPCOMING,
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
      salaryStructure: {
        status: '',
        settings: [],
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
            salaryStructure: data.salaryStructure,
          },
        });
        yield put({
          type: 'refreshPendingTasks',
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
        const tempPendingTasks = JSON.parse(JSON.stringify(pendingTaskDefault));
        const {
          // candidate = '',
          // ticketId = '',
          data = {},
        } = yield select((state) => state.candidatePortal);
        const {
          processStatus = '',
          expiryDate = '',
          documentList = [],
          isVerifiedJobDetail,
          isVerifiedBasicInfo,
          salaryStructure: { status: salaryStatus = '' } = {},
          // isAcceptedJoiningDate,
        } = data || {};

        switch (processStatus) {
          case NEW_PROCESS_STATUS.PROFILE_VERIFICATION:
            // review profile
            tempPendingTasks[0].status = CANDIDATE_TASK_STATUS.IN_PROGRESS;
            // uploading documents
            tempPendingTasks[1].status = CANDIDATE_TASK_STATUS.IN_PROGRESS;

            if (isVerifiedJobDetail && isVerifiedBasicInfo) {
              // review profile
              tempPendingTasks[0].status = CANDIDATE_TASK_STATUS.DONE;
            }
            break;

          case NEW_PROCESS_STATUS.DOCUMENT_VERIFICATION:
            // if there are any resubmit documents, show resubmit tasks
            if (documentList.length > 0) {
              const checkDocumentResubmit = documentList.some(
                (x) => x.candidateDocumentStatus === 'RE-SUBMIT',
              );
              if (checkDocumentResubmit) {
                tempPendingTasks[1].status = CANDIDATE_TASK_STATUS.IN_PROGRESS;
                tempPendingTasks[1].name = 'Resubmit Documents';
              }
            } else {
              // uploading documents
              tempPendingTasks[1].status = CANDIDATE_TASK_STATUS.DONE;
            }
            break;

          case NEW_PROCESS_STATUS.SALARY_NEGOTIATION:
            if (['IN-PROGRESS'].includes(salaryStatus)) {
              // salary structure
              tempPendingTasks[2].status = CANDIDATE_TASK_STATUS.IN_PROGRESS;
            }
            break;

          case NEW_PROCESS_STATUS.OFFER_RELEASED:
          case NEW_PROCESS_STATUS.OFFER_ACCEPTED:
          case NEW_PROCESS_STATUS.OFFER_REJECTED:
            // offer letter
            tempPendingTasks[3].status = CANDIDATE_TASK_STATUS.IN_PROGRESS;
            tempPendingTasks[3].dueDate = expiryDate ? moment(expiryDate).format(dateFormat) : '';
            break;

          default:
            break;
        }
        yield put({
          type: 'save',
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
