import { notification } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { history } from 'umi';
import {
  addJoiningFormalities,
  checkExistingUserName,
  createEmployee,
  createProfile,
  createUserName,
  deleteDraft,
  getCandidateById,
  getDomain,
  getFilterList,
  getEmployeeIdFormatByLocation,
  getListEmployee,
  getListJoiningFormalities,
  getListNewComer,
  getOnboardingList,
  getPosition,
  getSettingEmployeeId,
  getTotalNumberOnboardingList,
  handleExpiryTicket,
  initiateBackgroundCheck,
  reassignTicket,
  removeJoiningFormalities,
  updateEmployeeFormatByLocation,
  updateJoiningFormalities,
  updateSettingEmployeeId,
  updateEmployeeFormatByGlobal,
} from '@/services/onboard';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import { PROCESS_STATUS, PROCESS_STATUS_TABLE_NAME } from '@/constants/onboarding';
import { dialog } from '@/utils/utils';

// const employeeList = rookieList.filter(
//   (rookie) => rookie.isNew === undefined || rookie.isNew === null,
// );

// Mock data for table
const sentEligibilityFormsData = []; // Pending Eligibility Checks
const receivedSubmittedDocumentsData = []; // Pending Eligibility Checks
const eligibleCandidatesData = [];
const ineligibleCandidatesData = [];
const sentProvisionalOffersData = []; // Provisional Offers
const acceptedProvisionalOffersData = []; // Provisional Offers
const renegotiateProvisionalOffersData = []; // Provisional Offers
// const receivedProvisionalOffersData = []; // Provisional Offers (delete)
const discardedProvisionalOffersData = [];
const sentForApprovalsData = []; // Awaiting Approvals
const approvedOffersData = []; // Awaiting Approvals
const approvedFinalOffersData = []; // Awaiting Approvals
const pendingApprovalsData = []; // Awaiting Approvals  del
const rejectFinalOfferData = []; // Awaiting Approvals  del
const acceptedFinalOffersData = []; // Final Offers
const sentFinalOffersData = []; // Final Offers
const renegotiateFinalOffersData = []; // Final Offers
const provisionalOfferDraftsData = []; // All Drafts
const finalOfferDraftsData = []; // All Drafts
const discardedFinalOffersData = [];
const provisionalOffersData = []; // Discarded Offers
const finalOffersData = []; // Discarded Offers

const pendingData = []; // Background Checks
const profileVerificationData = []; // Provisional Offers

const MENU_DATA = [
  {
    id: 1,
    name: 'All',
    key: 'all',
    component: 'All',
    // quantity: finalOfferDraftsData.length,
    quantity: provisionalOfferDraftsData.length,
    link: 'all',
  },
  {
    id: 2,
    name: 'Drafts',
    key: 'drafts',
    component: 'Drafts',
    // quantity: finalOfferDraftsData.length,
    quantity: provisionalOfferDraftsData.length,
    link: 'drafts',
  },
  {
    id: 3,
    name: 'Profile Verification',
    key: 'profileVerification',
    component: 'ProfileVerification',
    // quantity: sentProvisionalOffersData.length,
    quantity: profileVerificationData.length,
    link: 'profile-verification',
  },
  {
    id: 4,
    name: 'Provisional offers',
    key: 'provisionalOffers',
    component: 'ProvisionalOffers',
    // quantity: sentProvisionalOffersData.length,
    quantity: acceptedProvisionalOffersData.length,
    link: 'provisional-offers',
  },
  {
    id: 5,
    name: 'Document Verification',
    key: 'backgroundChecks',
    component: 'DocumentVerification',
    // quantity: sentProvisionalOffersData.length,
    quantity: pendingData.length,
    link: 'document-verification',
  },
  {
    id: 6,
    name: 'Awaiting approvals',
    key: 'awaitingApprovals',
    component: 'AwaitingApprovals',
    quantity: sentForApprovalsData.length,
    link: 'awaiting-approvals',
  },
  {
    id: 7,
    name: 'Final offers',
    key: 'finalOffers',
    component: 'FinalOffers',
    quantity: sentFinalOffersData.length,
    link: 'final-offers',
  },
  {
    id: 8,
    name: 'Discarded offers',
    key: 'discardedOffers',
    component: 'DiscardedOffers',
    quantity: provisionalOffersData.length,
    link: 'discarded-offers',
  },
];

const formatDate = (date) => {
  return date ? moment(date).locale('en').format('MM.DD.YY') : '';
};

const dateDiffInDays = (a, b) => {
  if (!a || !b) {
    return 10;
  }
  // a and b are javascript Date objects
  const SECOND_IN_DAY = 1000 * 60 * 60 * 24;
  const firstDate = new Date(a);
  const secondDate = new Date(b);

  const diff = parseFloat((firstDate.getDate() - secondDate.getDate()) / SECOND_IN_DAY);
  return diff;
};

const formatData = (list = []) => {
  const formatList = [];
  _.map(list, (item) => {
    const {
      _id,
      ticketID,
      firstName = '',
      middleName = '',
      lastName = '',
      // position,
      title = '',
      workLocation = '',
      dateOfJoining = '',
      // requestDate = '',
      receiveDate = '',
      sentDate = '',
      updatedAt = '',
      createdAt = '',
      comments = '',
      assignTo = {},
      assigneeManager = {},
      processStatus = '',
      verifiedDocument = 0,
      expiryDate = '',
    } = item;
    const dateSent = formatDate(sentDate) || '';
    const dateReceived = formatDate(receiveDate) || '';
    const dateJoin = formatDate(dateOfJoining) || '';
    const dateRequest = formatDate(createdAt) || '';
    const offerExpiryDate = formatDate(expiryDate) || '';

    let isNew = false;
    const fullName = `${firstName ? `${firstName} ` : ''}${middleName ? `${middleName} ` : ''}${
      lastName ? `${lastName} ` : ''
    }`;

    if (fullName) {
      isNew = dateDiffInDays(Date.now(), updatedAt) < 3;
    }

    const rookie = {
      candidate: _id || '',
      rookieId: `#${ticketID}`,
      isNew,
      rookieName: fullName,
      position: title.name,
      location: workLocation.name || '',
      comments: comments || '',
      dateSent: dateSent || '',
      dateReceived: dateReceived || '',
      dateJoin: dateJoin || '',
      dateRequest: dateRequest || '',
      offerExpiryDate: offerExpiryDate || '',
      documentVerified: verifiedDocument,
      resubmit: 0,
      changeRequest: '-',
      assignTo,
      assigneeManager,
      processStatus: PROCESS_STATUS_TABLE_NAME[processStatus],
      processStatusId: processStatus,
    };
    formatList.push(rookie);
  });

  return formatList;
};

const onboard = {
  namespace: 'onboard',

  state: {
    mainTabActiveKey: '1',
    onboardingOverview: {
      total: '',
      currentStatusAll: [],
      pendingEligibilityChecks: {
        sentEligibilityForms: sentEligibilityFormsData,
        receivedSubmittedDocuments: receivedSubmittedDocumentsData,
      },
      eligibleCandidates: eligibleCandidatesData,
      ineligibleCandidates: ineligibleCandidatesData,
      profileVerification: {
        profileVerificationTotal: profileVerificationData,
      },
      provisionalOffers: {
        sentProvisionalOffers: sentProvisionalOffersData,
        acceptedProvisionalOffers: acceptedProvisionalOffersData,
        renegotiateProvisionalOffers: renegotiateProvisionalOffersData,
        // receivedProvisionalOffers: receivedProvisionalOffersData,
      },
      backgroundCheck: {
        pending: pendingData,
        eligibleCandidates: eligibleCandidatesData,
        ineligibleCandidates: ineligibleCandidatesData,
      },
      discardedProvisionalOffers: discardedProvisionalOffersData,
      awaitingApprovals: {
        approvedFinalOffers: approvedFinalOffersData, // del
        pendingApprovals: pendingApprovalsData, // del
        rejectFinalOffer: rejectFinalOfferData, // del
        sentForApprovals: sentForApprovalsData,
        approvedOffers: approvedOffersData,
      },
      finalOffers: {
        acceptedFinalOffers: acceptedFinalOffersData,
        sentFinalOffers: sentFinalOffersData,
        renegotiateFinalOffers: renegotiateFinalOffersData,
      },
      finalOfferDrafts: finalOfferDraftsData,
      drafts: {
        provisionalOfferDrafts: provisionalOfferDraftsData,
        finalOfferDrafts: finalOfferDraftsData,
      },
      discardedFinalOffers: discardedFinalOffersData,
      discardedOffers: {
        provisionalOffers: provisionalOffersData,
        finalOffers: finalOffersData,
      },
      dataAll: [],
    },
    settings: {
      backgroundChecks: {
        typeOfBackgroundCheck: '',
        checksPerform: '',
        resultViewer: '',
        vehicleReportsRequested: '',
        vehicleNotObtained: '',
      },
      optionalOnboardQuestions: {
        nameList: [
          { id: '0', name: 'Is this a person special part-time (SPT)' },
          { id: '1', name: 'Alternative address' },
          { id: '2', name: 'Alternative address' },
        ],
      },
    },
    customFields: {},
    menu: {
      onboardingOverviewTab: {
        listMenu: MENU_DATA,
        totalNumber: [],
      },
    },
    hrList: [],
    hrManagerList: [],
    jobTitleList: [],
    filterList: {},
    joiningFormalities: {
      listJoiningFormalities: [],
      listNewComer: [],
      itemNewComer: {},
      totalComer: 0,
      userName: '',
      domain: '',
      messageErr: '',
      employeeData: {},
      generatedId: '',
      prefix: '',
      idItem: '',
      employeeIdList: [],
      settingId: '',
    },
    reloadTableData: false,
  },

  effects: {
    *fetchOnboardListAll({ payload }, { call, put }) {
      try {
        const { processStatus = '', page, limit, name } = payload;
        const tenantId = getCurrentTenant();
        const req = {
          processStatus,
          page,
          tenantId,
          limit,
          name,
        };
        const response = yield call(getOnboardingList, req);
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        // const returnedData = formatData(response.data[0].paginatedResults);
        const returnedData = formatData(response.data);
        yield put({
          type: 'fetchTotalNumberOfOnboardingListEffect',
        });

        yield put({
          type: 'saveAll',
          payload: returnedData,
        });
        yield put({
          type: 'saveOnboardingOverview',
          payload: {
            total: response.total,
            currentStatusAll: processStatus,
          },
        });
      } catch (errors) {
        dialog(errors);
      }
    },

    *fetchOnboardList({ payload }, { call, put }) {
      try {
        const {
          PROVISIONAL_OFFER_DRAFT,
          FINAL_OFFERS_DRAFT,

          SENT_PROVISIONAL_OFFERS,
          ACCEPTED_PROVISIONAL_OFFERS,
          RENEGOTIATE_PROVISIONAL_OFFERS,

          PENDING,
          ELIGIBLE_CANDIDATES,
          INELIGIBLE_CANDIDATES,

          SENT_FOR_APPROVAL,
          APPROVED_OFFERS,

          SENT_FINAL_OFFERS,
          ACCEPTED_FINAL_OFFERS,
          RENEGOTIATE_FINAL_OFFERS,

          PROVISIONAL_OFFERS,
          FINAL_OFFERS,
          FINAL_OFFERS_HR,
          FINAL_OFFERS_CANDIDATE,
        } = PROCESS_STATUS;
        const { processStatus = '', name } = payload;
        const tenantId = getCurrentTenant();
        let req;
        if (processStatus === FINAL_OFFERS) {
          req = {
            processStatus: [FINAL_OFFERS_HR, FINAL_OFFERS_CANDIDATE],
            page: 1,
            tenantId,
            name,
          };
        } else if (Array.isArray(processStatus)) {
          req = {
            processStatus,
            page: 1,
            tenantId,
            name,
          };
        } else {
          req = {
            processStatus: [processStatus],
            page: 1,
            tenantId,
            name,
          };
        }
        const response = yield call(getOnboardingList, req);
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        // const returnedData = formatData(response.data[0].paginatedResults);
        const returnedData = formatData(response.data);

        yield put({
          type: 'fetchTotalNumberOfOnboardingListEffect',
        });

        yield put({
          type: 'saveOnboardingOverview',
          payload: {
            total: response.total,
          },
        });

        // Fetch data
        switch (processStatus) {
          case PROVISIONAL_OFFER_DRAFT: {
            yield put({
              type: 'saveProvisionalOfferDrafts',
              payload: returnedData,
            });

            return;
          }
          case FINAL_OFFERS_DRAFT: {
            yield put({
              type: 'saveFinalOfferDrafts',
              payload: returnedData,
            });

            return;
          }

          case SENT_PROVISIONAL_OFFERS: {
            yield put({
              type: 'saveSentProvisionalOffers',
              payload: returnedData,
            });

            return;
          }

          case ACCEPTED_PROVISIONAL_OFFERS: {
            yield put({
              type: 'saveAcceptedProvisionalOffers',
              payload: returnedData,
            });

            return;
          }

          case RENEGOTIATE_PROVISIONAL_OFFERS: {
            yield put({
              type: 'saveRenegotiateProvisionalOffers',
              payload: returnedData,
            });

            return;
          }

          case PENDING: {
            yield put({
              type: 'savePending',
              payload: returnedData,
            });

            return;
          }

          case ELIGIBLE_CANDIDATES: {
            yield put({
              type: 'saveEligibleCandidates',
              payload: returnedData,
            });

            return;
          }

          case INELIGIBLE_CANDIDATES: {
            yield put({
              type: 'saveIneligibleCandidates',
              payload: returnedData,
            });

            return;
          }

          case SENT_FOR_APPROVAL: {
            yield put({
              type: 'saveSentForApproval',
              payload: returnedData,
            });

            return;
          }

          case APPROVED_OFFERS: {
            yield put({
              type: 'saveApprovedOffers',
              payload: returnedData,
            });

            return;
          }

          case SENT_FINAL_OFFERS: {
            yield put({
              type: 'saveSentFinalOffers',
              payload: returnedData,
            });

            return;
          }

          case ACCEPTED_FINAL_OFFERS: {
            yield put({
              type: 'saveAcceptedFinalOffers',
              payload: returnedData,
            });

            return;
          }

          case RENEGOTIATE_FINAL_OFFERS: {
            yield put({
              type: 'saveRenegotiateFinalOffers',
              payload: returnedData,
            });

            return;
          }

          case PROVISIONAL_OFFERS: {
            yield put({
              type: 'saveProvisionalOffers',
              payload: returnedData,
            });

            return;
          }

          case FINAL_OFFERS: {
            yield put({
              type: 'saveFinalOffers',
              payload: returnedData,
            });

            return;
          }

          default:
            return;
        }
      } catch (errors) {
        dialog(errors);
      }
    },

    *deleteTicketDraft({ payload }, { call, put }) {
      let response;
      try {
        const { id = '', tenantId = '' } = payload;
        const req = {
          rookieID: id,
          tenantId,
        };
        response = yield call(deleteDraft, req);
        const { statusCode } = response;
        if (statusCode !== 200) throw response;

        // deleteTicket
        yield put({
          type: 'deleteTicket',
          payload: id,
        });
        yield put({
          type: 'fetchTotalNumberOfOnboardingListEffect',
        });
        // yield put({
        //   type: 'fetchOnboardList',
        //   payload: {
        //     processStatus: PROVISIONAL_OFFER_DRAFT,
        //   },
        // });
        notification.success({ message: 'Delete ticket successfully.' });
      } catch (error) {
        dialog(error);
      }
      return response;
    },

    *reassignTicket({ payload }, { call, put, select }) {
      let response;
      try {
        const {
          id = '',
          tenantId = '',
          newAssignee = '',
          processStatus = '',
          isAll = false,
          page = '',
          limit = '',
        } = payload;
        const req = {
          rookieID: id,
          tenantId,
          newAssignee,
        };
        response = yield call(reassignTicket, req);
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        if (!isAll) {
          yield put({
            type: 'fetchOnboardList',
            payload: {
              tenantId,
              processStatus,
            },
          });
        } else {
          const { currentStatusAll } = yield select((state) => state.onboard.onboardingOverview);

          yield put({
            type: 'fetchOnboardListAll',
            payload: {
              tenantId,
              processStatus: currentStatusAll,
              page,
              limit,
            },
          });
        }
      } catch (error) {
        dialog(error);
      }
      return response;
    },

    *handleExpiryTicket({ payload }, { call, put, select }) {
      let response;
      try {
        const {
          id = '',
          tenantId = '',
          expiryDate = '',
          processStatus = '',
          isAll = false,
          page = '',
          limit = '',
          type = '',
        } = payload;
        const req = {
          rookieID: id,
          tenantId,
          expiryDate,
          type,
        };
        response = yield call(handleExpiryTicket, req);
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        if (!isAll) {
          yield put({
            type: 'fetchOnboardList',
            payload: {
              tenantId,
              processStatus,
            },
          });
        } else {
          const { currentStatusAll } = yield select((state) => state.onboard.onboardingOverview);

          yield put({
            type: 'fetchOnboardListAll',
            payload: {
              tenantId,
              processStatus: currentStatusAll,
              page,
              limit,
            },
          });
        }
      } catch (error) {
        dialog(error);
      }
      return response;
    },
    *initiateBackgroundCheckEffect({ payload }, { call, put }) {
      try {
        const { ACCEPTED_PROVISIONAL_OFFERS, PENDING } = PROCESS_STATUS;
        const { rookieID = '', tenantId = '' } = payload;
        const req = {
          rookieID,
          tenantId,
        };
        const response = yield call(initiateBackgroundCheck, req);
        const { statusCode } = response;
        if (statusCode !== 200) throw response;

        yield put({
          type: 'fetchOnboardList',
          payload: {
            processStatus: ACCEPTED_PROVISIONAL_OFFERS,
          },
        });
        yield put({
          type: 'fetchOnboardList',
          payload: {
            processStatus: PENDING,
          },
        });
      } catch (error) {
        dialog(error);
      }
    },

    *redirectToReview({ payload }) {
      try {
        const { id } = payload;
        history.push(`/onboarding/list/view/${id}`);
        yield null;
      } catch (error) {
        dialog(error);
      }
    },

    *createProfileEffect({ payload }, { call }) {
      let response;
      try {
        response = yield call(createProfile, payload);
        const { statusCode } = response;
        // console.log(data[0].defaultMessage);
        if (statusCode === 400) {
          dialog(response);
        }
      } catch (error) {
        dialog(error);
      }
      return response;
    },

    // eslint-disable-next-line no-shadow
    *fetchTotalNumberOfOnboardingListEffect(_, { call, put }) {
      let response;
      try {
        const payload = {
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        };
        response = yield call(getTotalNumberOnboardingList, payload);
        const { statusCode, data: totalNumber = [] } = response;
        if (statusCode !== 200) throw response;
        // Update menu
        yield put({
          type: 'updateMenuQuantity',
          payload: { totalNumber },
        });
      } catch (error) {
        dialog(error);
      }
      return response;
    },

    // REASSIGN
    *fetchFilterList({ payload }, { call, put }) {
      try {
        const response = yield call(getFilterList, payload);
        const { statusCode, data: filterList = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { filterList } });
        return response;
      } catch (errors) {
        dialog(errors);
        return {};
      }
    },
    *fetchEmployeeList(
      { payload: { company = [], department = [], location = [] } = {} },
      { call, put },
    ) {
      try {
        const response = yield call(getListEmployee, {
          status: ['ACTIVE'],
          company,
          department,
          location,
        });
        const { statusCode, data: hrList = [] } = response;
        if (statusCode !== 200) throw response;

        yield put({ type: 'save', payload: { hrList } });
        return hrList;
      } catch (errors) {
        dialog(errors);
        return [];
      }
    },
    *fetchHRManagerList(
      { payload: { company = [], department = [], location = [], roles = [] } = {} },
      { call, put },
    ) {
      try {
        const response = yield call(getListEmployee, {
          status: ['ACTIVE'],
          company,
          department,
          location,
          roles,
        });
        const { statusCode, data: hrManagerList = [] } = response;
        if (statusCode !== 200) throw response;

        yield put({ type: 'save', payload: { hrManagerList } });
        return hrManagerList;
      } catch (errors) {
        dialog(errors);
        return [];
      }
    },
    *fetchJobTitleList({ payload = {} }, { call, put }) {
      try {
        const newPayload = {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
          // page: '',
        };
        const response = yield call(getPosition, newPayload);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { jobTitleList: data } });
      } catch (errors) {
        dialog(errors);
      }
    },
    // joiningFormalities
    *getListJoiningFormalities({ payload }, { call, put }) {
      try {
        const response = yield call(getListJoiningFormalities, {
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
          ...payload,
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;

        yield put({ type: 'saveJoiningFormalities', payload: { listJoiningFormalities: data } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *updateJoiningFormalities({ payload }, { call }) {
      try {
        const response = yield call(updateJoiningFormalities, {
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
          ...payload,
        });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        notification.success({ message: 'Update successfully' });
        return response;
      } catch (errors) {
        dialog(errors);
        return errors;
      }
    },
    *addJoiningFormalities({ payload }, { call }) {
      try {
        const response = yield call(addJoiningFormalities, {
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
          ...payload,
        });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        notification.success({ message: 'Add successfully' });
        return response;
      } catch (errors) {
        dialog(errors);
        return errors;
      }
    },
    *removeJoiningFormalities({ payload }, { call }) {
      try {
        const response = yield call(removeJoiningFormalities, {
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
          ...payload,
        });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        notification.success({ message: 'Remove successfully' });
      } catch (errors) {
        dialog(errors);
      }
    },
    *getSettingEmployeeId({ payload }, { call, put }) {
      try {
        const response = yield call(getSettingEmployeeId, {
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
          ...payload,
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        const { generatedId = '', prefix = '', _id } = data;
        yield put({
          type: 'saveJoiningFormalities',
          payload: { generatedId, prefix, idItem: _id },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *updateSettingEmployeeId({ payload }, { call, put }) {
      try {
        const response = yield call(updateSettingEmployeeId, {
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
          ...payload,
        });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        const { generatedId = '', prefix = '' } = payload;
        yield put({ type: 'saveJoiningFormalities', payload: { generatedId, prefix } });
        return response;
      } catch (errors) {
        dialog(errors);
        return errors;
      }
    },
    *getEmployeeId({ payload }, { call, put }) {
      try {
        const response = yield call(createUserName, {
          tenantId: getCurrentTenant(),
          ...payload,
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        const { userName = '' } = data;
        yield put({
          type: 'saveJoiningFormalities',
          payload: { userName },
        });
        return response;
      } catch (errors) {
        dialog(errors);
        return {};
      }
    },
    *checkExistedUserName({ payload }, { call }) {
      try {
        const response = yield call(checkExistingUserName, {
          tenantId: getCurrentTenant(),
          ...payload,
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        const { isExistingUserName = false } = data;
        return isExistingUserName;
      } catch (errors) {
        dialog(errors);
        return {};
      }
    },
    *createEmployee({ payload }, { call, put }) {
      try {
        const response = yield call(createEmployee, {
          tenantId: getCurrentTenant(),
          ...payload,
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'saveJoiningFormalities',
          payload: { employeeData: data },
        });
        return response;
      } catch (errors) {
        dialog(errors);
        return {};
      }
    },
    *getListNewComer({ payload }, { call, put }) {
      try {
        const response = yield call(getListNewComer, {
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
          ...payload,
        });
        const { statusCode, data, total } = response;
        if (statusCode !== 200) throw response;

        yield put({
          type: 'saveJoiningFormalities',
          payload: { listNewComer: data, totalComer: total },
        });
        yield put({
          type: 'saveFilter',
          payload: { isSearch: false },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *getCandidateById({ payload }, { call, put }) {
      try {
        const response = yield call(getCandidateById, {
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
          ...payload,
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;

        yield put({
          type: 'saveJoiningFormalities',
          payload: { itemNewComer: data },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    // eslint-disable-next-line no-shadow
    *fetchListDomain(_, { call, put }) {
      try {
        const response = yield call(getDomain, {
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'saveJoiningFormalities',
          payload: { listDomain: data },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *getEmployeeIdFormatByLocation({ payload }, { call, put }) {
      try {
        const response = yield call(getEmployeeIdFormatByLocation, {
          ...payload,
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'saveJoiningFormalities',
          payload: { settingId: data },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *getEmployeeIdFormatList({ payload }, { call, put }) {
      try {
        const response = yield call(getEmployeeIdFormatByLocation, {
          ...payload,
        });
        const { statusCode, data, total } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'saveJoiningFormalities',
          payload: { employeeIdList: data, locationTotal: total },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *updateEmployeeFormatByLocation({ payload }, { call }) {
      let response = {};
      try {
        response = yield call(updateEmployeeFormatByLocation, {
          ...payload,
        });
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({ message });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *updateEmployeeFormatByGlobal({ payload }, { call }) {
      let response = {};
      try {
        response = yield call(updateEmployeeFormatByGlobal, {
          ...payload,
        });
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({ message });
      } catch (errors) {
        dialog(errors);
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
    saveOnboardingOverview(state, action) {
      return {
        ...state,
        onboardingOverview: {
          ...state.onboardingOverview,
          ...action.payload,
        },
      };
    },

    // saveTotalNumber(state, action) {
    //   return {
    //     ...state,
    //     menu: {
    //       ...state.menu,
    //       onboardingOverviewTab: {
    //         ...state.menu.onboardingOverviewTab,
    //         ...action.payload,
    //       },
    //     },
    //   };
    // },

    // 0
    saveAll(state, action) {
      return {
        ...state,
        onboardingOverview: {
          ...state.onboardingOverview,
          dataAll: action.payload,
        },
      };
    },

    // 1
    saveProvisionalOfferDrafts(state, action) {
      return {
        ...state,
        onboardingOverview: {
          ...state.onboardingOverview,
          drafts: {
            ...state.onboardingOverview.drafts,
            provisionalOfferDrafts: action.payload,
          },
        },
      };
    },

    saveFinalOfferDrafts(state, action) {
      return {
        ...state,
        onboardingOverview: {
          ...state.onboardingOverview,
          drafts: {
            ...state.onboardingOverview.drafts,
            finalOfferDrafts: action.payload,
          },
        },
      };
    },

    // 2
    saveSentProvisionalOffers(state, action) {
      return {
        ...state,
        onboardingOverview: {
          ...state.onboardingOverview,
          provisionalOffers: {
            ...state.onboardingOverview.provisionalOffers,
            sentProvisionalOffers: action.payload,
          },
        },
      };
    },

    saveAcceptedProvisionalOffers(state, action) {
      return {
        ...state,
        onboardingOverview: {
          ...state.onboardingOverview,
          provisionalOffers: {
            ...state.onboardingOverview.provisionalOffers,
            acceptedProvisionalOffers: action.payload,
          },
        },
      };
    },

    saveRenegotiateProvisionalOffers(state, action) {
      return {
        ...state,
        onboardingOverview: {
          ...state.onboardingOverview,
          provisionalOffers: {
            ...state.onboardingOverview.provisionalOffers,
            renegotiateProvisionalOffers: action.payload,
          },
        },
      };
    },

    // 3
    savePending(state, action) {
      return {
        ...state,
        onboardingOverview: {
          ...state.onboardingOverview,
          backgroundCheck: {
            ...state.onboardingOverview.backgroundCheck,
            pending: action.payload,
          },
        },
      };
    },

    saveEligibleCandidates(state, action) {
      return {
        ...state,
        onboardingOverview: {
          ...state.onboardingOverview,
          backgroundCheck: {
            ...state.onboardingOverview.backgroundCheck,
            eligibleCandidates: action.payload,
          },
        },
      };
    },

    saveIneligibleCandidates(state, action) {
      return {
        ...state,
        onboardingOverview: {
          ...state.onboardingOverview,
          backgroundCheck: {
            ...state.onboardingOverview.backgroundCheck,
            ineligibleCandidates: action.payload,
          },
        },
      };
    },

    // 4
    saveSentForApproval(state, action) {
      return {
        ...state,
        onboardingOverview: {
          ...state.onboardingOverview,
          awaitingApprovals: {
            ...state.onboardingOverview.awaitingApprovals,
            sentForApprovals: action.payload,
          },
        },
      };
    },

    saveApprovedOffers(state, action) {
      return {
        ...state,
        onboardingOverview: {
          ...state.onboardingOverview,
          awaitingApprovals: {
            ...state.onboardingOverview.awaitingApprovals,
            approvedOffers: action.payload,
          },
        },
      };
    },

    // 5
    saveSentFinalOffers(state, action) {
      return {
        ...state,
        onboardingOverview: {
          ...state.onboardingOverview,
          finalOffers: {
            ...state.onboardingOverview.finalOffers,
            sentFinalOffers: action.payload,
          },
        },
      };
    },

    saveAcceptedFinalOffers(state, action) {
      return {
        ...state,
        onboardingOverview: {
          ...state.onboardingOverview,
          finalOffers: {
            ...state.onboardingOverview.finalOffers,
            acceptedFinalOffers: action.payload,
          },
        },
      };
    },

    saveRenegotiateFinalOffers(state, action) {
      return {
        ...state,
        onboardingOverview: {
          ...state.onboardingOverview,
          finalOffers: {
            ...state.onboardingOverview.finalOffers,
            renegotiateFinalOffers: action.payload,
          },
        },
      };
    },

    // 6
    saveProvisionalOffers(state, action) {
      return {
        ...state,
        onboardingOverview: {
          ...state.onboardingOverview,
          discardedOffers: {
            ...state.onboardingOverview.discardedOffers,
            provisionalOffers: action.payload,
          },
        },
      };
    },

    saveFinalOffers(state, action) {
      return {
        ...state,
        onboardingOverview: {
          ...state.onboardingOverview,
          discardedOffers: {
            ...state.onboardingOverview.discardedOffers,
            finalOffers: action.payload,
          },
        },
      };
    },

    updateMenuQuantity(state, action) {
      const { listMenu } = state.menu.onboardingOverviewTab;
      const { totalNumber } = action.payload;
      const newTotalNumber = {
        drafts: 0,
        provisionalOffers: 0,
        backgroundChecks: 0,
        awaitingApprovals: 0,
        finalOffers: 0,
        discardedOffers: 0,
      };

      totalNumber.forEach((status) => {
        const { _id = '', count = 0 } = status;
        switch (_id) {
          case 'DRAFT':
            newTotalNumber.drafts += count;
            break;
          case 'FINAL-OFFER-DRAFT':
            newTotalNumber.drafts += count;
            break;

          case 'SENT-PROVISIONAL-OFFER':
            newTotalNumber.provisionalOffers += count;
            break;
          case 'ACCEPT-PROVISIONAL-OFFER':
            newTotalNumber.provisionalOffers += count;
            break;
          case 'RENEGOTIATE-PROVISONAL-OFFER':
            newTotalNumber.provisionalOffers += count;
            break;

          case 'PENDING-BACKGROUND-CHECK':
            newTotalNumber.backgroundChecks += count;
            break;
          case 'ELIGIBLE-CANDIDATE':
            newTotalNumber.backgroundChecks += count;
            break;
          case 'INELIGIBLE-CANDIDATE':
            newTotalNumber.backgroundChecks += count;
            break;

          case 'PENDING-APPROVAL-FINAL-OFFER':
            newTotalNumber.awaitingApprovals += count;
            break;
          case 'APPROVED-FINAL-OFFER':
            newTotalNumber.awaitingApprovals += count;
            break;

          case 'SENT-FINAL-OFFER':
            newTotalNumber.finalOffers += count;
            break;
          case 'ACCEPT-FINAL-OFFER':
            newTotalNumber.finalOffers += count;
            break;
          case 'RENEGOTIATE-FINAL-OFFERS':
            newTotalNumber.finalOffers += count;
            break;

          case 'DISCARDED-PROVISONAL-OFFER':
            newTotalNumber.discardedOffers += count;
            break;
          case 'FINAL-OFFERS':
            newTotalNumber.discardedOffers += count;
            break;
          case 'REJECT-FINAL-OFFER-HR':
            newTotalNumber.discardedOffers += count;
            break;
          case 'REJECT-FINAL-OFFER-CANDIDATE':
            newTotalNumber.discardedOffers += count;
            break;
          default:
            break;
        }
      });

      const newListMenu = listMenu.map((item) => {
        const { key = '' } = item;
        let newItem = item;
        let newQuantity = item.quantity;
        let dataLength = 0;
        if (key === 'all') {
          dataLength =
            newTotalNumber.drafts +
            newTotalNumber.provisionalOffers +
            newTotalNumber.backgroundChecks +
            newTotalNumber.awaitingApprovals +
            newTotalNumber.finalOffers +
            newTotalNumber.discardedOffers;
        }
        if (key === 'drafts') {
          dataLength = newTotalNumber.drafts;
          // state.onboardingOverview.drafts.provisionalOfferDrafts.length +
          // state.onboardingOverview.drafts.finalOfferDrafts.length;
        }
        if (key === 'provisionalOffers') {
          dataLength = newTotalNumber.provisionalOffers;
          // state.onboardingOverview.provisionalOffers.sentProvisionalOffers.length +
          // state.onboardingOverview.provisionalOffers.acceptedProvisionalOffers.length +
          // state.onboardingOverview.provisionalOffers.renegotiateProvisionalOffers.length;
        }
        if (key === 'backgroundChecks') {
          dataLength = newTotalNumber.backgroundChecks;
          // state.onboardingOverview.backgroundCheck.pending.length +
          // state.onboardingOverview.backgroundCheck.eligibleCandidates.length +
          // state.onboardingOverview.backgroundCheck.ineligibleCandidates.length;
        }
        if (key === 'awaitingApprovals') {
          dataLength = newTotalNumber.awaitingApprovals;

          // state.onboardingOverview.awaitingApprovals.sentForApprovals.length +
          // state.onboardingOverview.awaitingApprovals.approvedOffers.length;
        }
        if (key === 'finalOffers') {
          dataLength = newTotalNumber.finalOffers;

          // state.onboardingOverview.finalOffers.acceptedFinalOffers.length +
          // state.onboardingOverview.finalOffers.sentFinalOffers.length +
          // state.onboardingOverview.finalOffers.renegotiateFinalOffers.length;
        }
        if (key === 'discardedOffers') {
          dataLength = newTotalNumber.discardedOffers;

          // state.onboardingOverview.discardedOffers.provisionalOffers.length +
          // state.onboardingOverview.discardedOffers.finalOffers.length;
        }
        newQuantity = dataLength;
        newItem = { ...newItem, quantity: newQuantity };
        return newItem;
      });

      return {
        ...state,
        menu: {
          ...state.menu,
          onboardingOverviewTab: {
            // phaseList: newPhaseList,
            listMenu: newListMenu,
          },
        },
      };
    },

    saveOrderNameField(state, action) {
      return {
        ...state,
        settings: {
          optionalOnboardQuestions: {
            nameList: action.payload.nameList,
          },
        },
      };
    },

    deleteTicket(state, action) {
      const { payload } = action;
      const {
        onboardingOverview: { dataAll = [], drafts: { provisionalOfferDrafts = [] } = {} } = {},
      } = state;
      const newList = provisionalOfferDrafts.filter((item) => {
        const { rookieId } = item;
        return rookieId !== `#${payload}`;
      });
      const newAllList = dataAll.filter((item) => {
        const { rookieId } = item;
        return rookieId !== `#${payload}`;
      });
      return {
        ...state,
        onboardingOverview: {
          ...state.onboardingOverview,
          drafts: {
            ...state.onboardingOverview.drafts,
            provisionalOfferDrafts: newList,
          },
          dataAll: newAllList,
        },
      };
    },
    // joiningFormalities
    saveJoiningFormalities(state, action) {
      const { joiningFormalities } = state;
      return {
        ...state,
        joiningFormalities: {
          ...joiningFormalities,
          ...action.payload,
        },
      };
    },
  },
};
export default onboard;
