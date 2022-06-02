import moment from 'moment';
import { history } from 'umi';
import { notification } from 'antd';
import {
  addAttachmentService,
  addReference,
  candidateFinalOffer,
  getById,
  getCountryList,
  getDocumentByCandidate,
  getStateListByCountry,
  sendEmailByCandidateModel,
  updateByCandidate,
  upsertCandidateDocument,
  getSalaryStructureByGrade,
} from '@/services/candidatePortal';
import {
  CANDIDATE_TASK_LINK,
  CANDIDATE_TASK_STATUS,
  DOCUMENT_TYPES,
} from '@/utils/candidatePortal';
import { NEW_PROCESS_STATUS } from '@/utils/onboarding';
import { dialog } from '@/utils/utils';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';

const pendingTaskDefault = [
  {
    id: CANDIDATE_TASK_LINK.REVIEW_PROFILE,
    name: 'Review Profile',
    dueDate: '',
    link: CANDIDATE_TASK_LINK.REVIEW_PROFILE,
    status: CANDIDATE_TASK_STATUS.UPCOMING,
  },
  {
    id: CANDIDATE_TASK_LINK.UPLOAD_DOCUMENTS,
    name: 'Upload Documents',
    dueDate: '',
    link: CANDIDATE_TASK_LINK.UPLOAD_DOCUMENTS,
    status: CANDIDATE_TASK_STATUS.UPCOMING,
  },
  {
    id: CANDIDATE_TASK_LINK.REFERENCES,
    name: 'Add References',
    dueDate: '',
    link: CANDIDATE_TASK_LINK.REFERENCES,
    status: CANDIDATE_TASK_STATUS.UPCOMING,
  },
  {
    id: CANDIDATE_TASK_LINK.SALARY_NEGOTIATION,
    name: 'Salary Proposal',
    dueDate: '',
    link: CANDIDATE_TASK_LINK.SALARY_NEGOTIATION,
    status: CANDIDATE_TASK_STATUS.UPCOMING,
  },
  {
    id: CANDIDATE_TASK_LINK.ACCEPT_OFFER,
    name: 'Accept Offer',
    dueDate: '',
    link: CANDIDATE_TASK_LINK.ACCEPT_OFFER,
    status: CANDIDATE_TASK_STATUS.UPCOMING,
  },
];

const steps = [];

const events = [];

const checkDocumentStatus = (documents = []) => {
  return documents.some(
    (x) =>
      x.status === DOCUMENT_TYPES.RESUBMIT_PENDING ||
      x.status === DOCUMENT_TYPES.NOT_AVAILABLE_REJECTED,
  );
};

const checkDocumentStatusTypeE = (documents = []) => {
  return documents.some((x) => checkDocumentStatus(x.data));
};

const initialState = {
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
    currentAddress: {},
    permanentAddress: {},
    phoneNumber: '',
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
  salaryStructureSetting: {},
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
  nextSteps: steps,
  upcomingEvents: events,
};

const candidatePortal = {
  namespace: 'candidatePortal',
  state: initialState,
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
            checkMandatory: {
              ...checkMandatory,
            },
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
          payload: {
            documentList: [...data],
          },
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

        response = yield call(updateByCandidate, {
          ...payload,
          tenantId: getCurrentTenant(),
          candidate,
        });

        const { statusCode } = response;
        if (statusCode !== 200) throw response;
      } catch (error) {
        dialog(error);
      }
      return response;
    },

    *upsertCandidateDocumentEffect({ payload }, { call, select }) {
      let response;
      try {
        const { candidate } = yield select((state) => state.candidatePortal);

        response = yield call(upsertCandidateDocument, {
          ...payload,
          tenantId: getCurrentTenant(),
          candidate,
        });

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

    *sendEmailByCandidate({ payload }, { call, select }) {
      let response = {};
      try {
        const { candidate } = yield select((state) => state.candidatePortal);
        response = yield call(sendEmailByCandidateModel, {
          ...payload,
          candidate,
        });
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
        const dateFormat = 'MM/DD/YYYY';
        const tempPendingTasks = JSON.parse(JSON.stringify(pendingTaskDefault));
        const {
          // candidate = '',
          // ticketId = '',
          data = {},
        } = yield select((state) => state.candidatePortal);
        const {
          processStatus = '',
          expiryDate = '',
          documentTypeA = [],
          documentTypeB = [],
          documentTypeC = [],
          documentTypeD = [],
          documentTypeE = [],
          isVerifiedJobDetail,
          isVerifiedBasicInfo,
          salaryStructure: { status: salaryStatus = '', settings: salarySettings } = {},
          // isAcceptedJoiningDate,
          sentDate = '',
          isFilledReferences = false,
          numReferences = null,
        } = data || {};

        const dueDate = sentDate ? moment(sentDate).add(5, 'days') : '-';

        if (
          checkDocumentStatus(documentTypeA) ||
          checkDocumentStatus(documentTypeB) ||
          checkDocumentStatus(documentTypeC) ||
          checkDocumentStatus(documentTypeD) ||
          checkDocumentStatusTypeE(documentTypeE)
        ) {
          tempPendingTasks[1].status = CANDIDATE_TASK_STATUS.IN_PROGRESS;
          tempPendingTasks[1].name = 'Resubmit Documents';
          tempPendingTasks[1].dueDate = dueDate;
        } else {
          // uploading documents
          tempPendingTasks[1].status = CANDIDATE_TASK_STATUS.DONE;
        }

        switch (processStatus) {
          case NEW_PROCESS_STATUS.PROFILE_VERIFICATION:
            // review profile
            tempPendingTasks[0].status = CANDIDATE_TASK_STATUS.IN_PROGRESS;
            tempPendingTasks[0].dueDate = dueDate;
            // uploading documents
            tempPendingTasks[1].status = CANDIDATE_TASK_STATUS.IN_PROGRESS;
            tempPendingTasks[1].dueDate = dueDate;

            if (isVerifiedJobDetail && isVerifiedBasicInfo) {
              // review profile
              tempPendingTasks[0].status = CANDIDATE_TASK_STATUS.DONE;
            }
            break;

          case NEW_PROCESS_STATUS.REFERENCE_VERIFICATION: {
            if (!isFilledReferences && numReferences) {
              tempPendingTasks[2].status = CANDIDATE_TASK_STATUS.IN_PROGRESS;
              tempPendingTasks[2].dueDate = dueDate;
            }
            break;
          }

          case NEW_PROCESS_STATUS.SALARY_NEGOTIATION:
            if (['IN-PROGRESS'].includes(salaryStatus) && salarySettings.length) {
              // salary structure
              tempPendingTasks[3].status = CANDIDATE_TASK_STATUS.IN_PROGRESS;
              tempPendingTasks[3].dueDate = dueDate;
            }
            break;

          case NEW_PROCESS_STATUS.OFFER_RELEASED:
            // case NEW_PROCESS_STATUS.OFFER_ACCEPTED:
            // case NEW_PROCESS_STATUS.OFFER_REJECTED:
            // offer letter
            tempPendingTasks[4].status = CANDIDATE_TASK_STATUS.IN_PROGRESS;
            tempPendingTasks[4].dueDate = expiryDate ? moment(expiryDate).format(dateFormat) : '';
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
    *fetchCountryList(_, { call, put }) {
      let response = {};
      try {
        response = yield call(getCountryList);
        const { data, statusCode } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: {
            countryList: data,
          },
        });
      } catch (error) {
        dialog(error);
      }
      return response;
    },
    *fetchStateByCountry({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getStateListByCountry, payload);
        const { data, statusCode } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: {
            stateList: data,
          },
        });
      } catch (error) {
        dialog(error);
      }
      return response;
    },
    *fetchSalaryStructureByGrade({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getSalaryStructureByGrade, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { data, statusCode } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: {
            salaryStructureSetting: data,
          },
        });
      } catch (error) {
        dialog(error);
      }
      return response;
    },
    *addReference({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(addReference, payload);
        const { data, statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({ message });
        yield put({
          type: 'saveOrigin',
          payload: {
            ...payload,
            data,
          },
        });
      } catch (error) {
        dialog(error);
      }
      return response;
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
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },

    clearState() {
      return initialState;
    },
  },
};
export default candidatePortal;
