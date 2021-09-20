import moment from 'moment';
import _ from 'lodash';
import { notification } from 'antd';

import {
  deleteDraft,
  getOnboardingList,
  getTotalNumberOnboardingList,
  handleExpiryTicket,
  reassignTicket,
  withdrawTicket,
  getPosition,
  getLocationList,
} from '@/services/onboard';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import { dialog } from '@/utils/utils';
import { NEW_PROCESS_STATUS_TABLE_NAME, NEW_PROCESS_STATUS } from '@/utils/onboarding';

const MENU_DATA = [
  {
    id: 1,
    name: 'All',
    key: 'all',
    component: 'All',
    quantity: 0,
    link: 'all',
  },
  {
    id: 2,
    name: 'Drafts',
    key: 'drafts',
    component: 'Drafts',
    quantity: 0,
    link: 'drafts',
  },
  {
    id: 3,
    name: 'Profile Verification',
    key: 'profileVerification',
    component: 'ProfileVerification',
    quantity: 0,
    link: 'profile-verification',
  },
  {
    id: 4,
    name: 'Document Verification',
    key: 'documentVerification',
    component: 'DocumentVerification',
    quantity: 0,
    link: 'document-verification',
  },
  {
    id: 5,
    name: 'Salary Negotiation',
    key: 'salaryNegotiation',
    component: 'SalaryNegotiation',
    quantity: 0,
    link: 'salary-negotiation',
  },
  {
    id: 6,
    name: 'Awaiting Approvals',
    key: 'awaitingApprovals',
    component: 'AwaitingApprovals',
    quantity: 0,
    link: 'awaiting-approvals',
  },
  {
    id: 7,
    name: 'Offer Released',
    key: 'offerReleased',
    component: 'OfferReleased',
    quantity: 0,
    link: 'offer-released',
  },
  {
    id: 8,
    name: 'Offer Accepted',
    key: 'offerAccepted',
    component: 'OfferAccepted',
    quantity: 0,
    link: 'offer-accepted',
  },
  {
    id: 9,
    name: 'Rejected Offers',
    key: 'rejectedOffers',
    component: 'RejectedOffers',
    quantity: 0,
    link: 'rejected-offer',
  },
  {
    id: 10,
    name: 'Withdrawn Offers',
    key: 'withdrawnOffers',
    component: 'WithdrawnOffers',
    quantity: 0,
    link: 'withdrawn-offers',
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
      currentStep = 0,
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
      candidateId: `#${ticketID}`,
      isNew,
      candidateName: fullName,
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
      processStatus: NEW_PROCESS_STATUS_TABLE_NAME[processStatus],
      processStatusId: processStatus,
      currentStep,
    };
    formatList.push(rookie);
  });

  return formatList;
};

const onboarding = {
  namespace: 'onboarding',
  state: {
    mainTabActiveKey: '1',
    menu: {
      onboardingOverviewTab: {
        listMenu: MENU_DATA,
        totalNumber: [],
      },
    },
    onboardingOverview: {
      dataAll: [],
      drafts: [],
      profileVerifications: [],
      documentVerifications: [],
      salaryNegotiations: [],
      awaitingApprovals: [],
      offerReleased: [],
      offerAccepted: [],
      rejectedOffers: [],
      withdrawnOffers: [],
      currentStatus: '',
    },
    searchOnboarding: {
      jobTitleList: [],
      locationList: [],
    },
  },
  effects: {
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

    /* ////////////////////////////////////////////////////////////////////////////////////////////// */
    *fetchOnboardListAll({ payload }, { call, put }) {
      try {
        yield put({
          type: 'fetchTotalNumberOfOnboardingListEffect',
        });

        const { processStatus = '', page, limit, name } = payload;
        const tenantId = getCurrentTenant();
        const company = getCurrentCompany();
        const req = {
          processStatus,
          page,
          tenantId,
          limit,
          name,
          company,
        };
        const response = yield call(getOnboardingList, req);
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        const returnedData = formatData(response.data);

        yield put({
          type: 'saveAll',
          payload: returnedData,
        });
        yield put({
          type: 'saveOnboardingOverview',
          payload: {
            total: response.total,
            currentStatus: processStatus || 'All',
          },
        });
        return response;
      } catch (errors) {
        dialog(errors);
        return '';
      }
    },
    *fetchOnboardList({ payload }, { call, put }) {
      try {
        yield put({
          type: 'fetchTotalNumberOfOnboardingListEffect',
        });

        const {
          DRAFT,
          PROFILE_VERIFICATION,
          DOCUMENT_VERIFICATION,
          SALARY_NEGOTIATION,
          AWAITING_APPROVALS,
          OFFER_RELEASED,
          OFFER_ACCEPTED,
          OFFER_REJECTED,
          OFFER_WITHDRAWN,
        } = NEW_PROCESS_STATUS;

        const { processStatus = [], page, limit, name } = payload;
        const tenantId = getCurrentTenant();
        const company = getCurrentCompany();
        const req = {
          // processStatus,
          page,
          limit,
          tenantId,
          // name,
          company,
          ...payload,
        };
        const response = yield call(getOnboardingList, req);
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        const returnedData = formatData(response.data);

        yield put({
          type: 'saveOnboardingOverview',
          payload: {
            total: response.total,
            currentStatus: processStatus[0],
          },
        });

        // Fetch data
        switch (processStatus[0]) {
          case DRAFT: {
            yield put({
              type: 'saveOnboardingOverview',
              payload: { drafts: returnedData },
            });
            return response;
          }
          case PROFILE_VERIFICATION: {
            yield put({
              type: 'saveOnboardingOverview',
              payload: { profileVerifications: returnedData },
            });
            return response;
          }
          case DOCUMENT_VERIFICATION: {
            yield put({
              type: 'saveOnboardingOverview',
              payload: { documentVerifications: returnedData },
            });
            return response;
          }
          case SALARY_NEGOTIATION: {
            yield put({
              type: 'saveOnboardingOverview',
              payload: { salaryNegotiations: returnedData },
            });
            return response;
          }
          case AWAITING_APPROVALS: {
            yield put({
              type: 'saveOnboardingOverview',
              payload: { awaitingApprovals: returnedData },
            });
            return response;
          }
          case OFFER_RELEASED: {
            yield put({
              type: 'saveOnboardingOverview',
              payload: { offerReleased: returnedData },
            });
            return response;
          }
          case OFFER_ACCEPTED: {
            yield put({
              type: 'saveOnboardingOverview',
              payload: { offerAccepted: returnedData },
            });
            return response;
          }
          case OFFER_REJECTED: {
            yield put({
              type: 'saveOnboardingOverview',
              payload: { rejectedOffers: returnedData },
            });
            return response;
          }
          case OFFER_WITHDRAWN: {
            yield put({
              type: 'saveOnboardingOverview',
              payload: { withdrawnOffers: returnedData },
            });
            return response;
          }
          default:
            console.log(returnedData);
            return response;
        }
      } catch (errors) {
        dialog(errors);
        return '';
      }
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
    *withdrawTicket({ payload = {}, processStatus = '' }, { call, put }) {
      let response = {};
      try {
        response = yield call(withdrawTicket, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;

        // Refresh table tab OFFER_WITHDRAWN and current tab which has implemented action withdraw

        yield put({
          type: 'fetchOnboardList',
          payload: {
            processStatus: NEW_PROCESS_STATUS.OFFER_WITHDRAWN,
          },
        });
        yield put({
          type: 'fetchOnboardList',
          payload: {
            processStatus,
          },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *deleteTicketDraft({ payload = {}, processStatus = '' }, { call, put }) {
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

        if (processStatus === NEW_PROCESS_STATUS.DRAFT) {
          yield put({
            type: 'fetchOnboardList',
            payload: {
              processStatus,
            },
          });
          yield put({
            type: 'fetchOnboardListAll',
            payload: {},
          });
        }

        notification.success({ message: 'Delete ticket successfully.' });
      } catch (error) {
        dialog(error);
      }
      return response;
    },
    *reassignTicket({ payload }, { call, put }) {
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
          yield put({
            type: 'fetchOnboardListAll',
            payload: {
              tenantId,
              processStatus: '',
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
        yield put({ type: 'saveSearch', payload: { jobTitleList: data } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchLocationList({ payload = {} }, { call, put }) {
      try {
        const newPayload = {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        };
        const response = yield call(getLocationList, newPayload);
        const { statusCode, data: locationList = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'saveSearch',
          payload: { locationList },
        });
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
    saveSearch(state, action) {
      return {
        ...state,
        searchOnboarding: {
          ...state.searchOnboarding,
          ...action.payload,
        },
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
    saveAll(state, action) {
      return {
        ...state,
        onboardingOverview: {
          ...state.onboardingOverview,
          dataAll: action.payload,
        },
      };
    },
    updateMenuQuantity(state, action) {
      const {
        DRAFT,
        PROFILE_VERIFICATION,
        DOCUMENT_VERIFICATION,
        SALARY_NEGOTIATION,
        AWAITING_APPROVALS,
        OFFER_RELEASED,
        OFFER_ACCEPTED,
        OFFER_REJECTED,
        OFFER_WITHDRAWN,
      } = NEW_PROCESS_STATUS;
      const { listMenu } = state.menu.onboardingOverviewTab;
      const { totalNumber } = action.payload;

      const newTotalNumber = {
        all: 0,
        drafts: 0,
        profileVerification: 0,
        documentVerification: 0,
        salaryNegotiation: 0,
        awaitingApprovals: 0,
        offerReleased: 0,
        offerAccepted: 0,
        rejectedOffers: 0,
        withdrawnOffers: 0,
      };

      totalNumber.forEach((status) => {
        const { _id = '', count = 0 } = status;
        switch (_id) {
          case DRAFT:
            newTotalNumber.drafts += count;
            break;
          case PROFILE_VERIFICATION:
            newTotalNumber.profileVerification += count;
            break;
          case DOCUMENT_VERIFICATION:
            newTotalNumber.documentVerification += count;
            break;
          case SALARY_NEGOTIATION:
            newTotalNumber.salaryNegotiation += count;
            break;
          case AWAITING_APPROVALS:
            newTotalNumber.awaitingApprovals += count;
            break;
          case OFFER_RELEASED:
            newTotalNumber.offerReleased += count;
            break;
          case OFFER_ACCEPTED:
            newTotalNumber.offerAccepted += count;
            break;
          case OFFER_REJECTED:
            newTotalNumber.rejectedOffers += count;
            break;
          case OFFER_WITHDRAWN:
            newTotalNumber.withdrawnOffers += count;
            break;
          default:
            break;
        }

        newTotalNumber.all =
          newTotalNumber.drafts +
          newTotalNumber.profileVerification +
          newTotalNumber.documentVerification +
          newTotalNumber.salaryNegotiation +
          newTotalNumber.awaitingApprovals +
          newTotalNumber.offerReleased +
          newTotalNumber.offerAccepted +
          newTotalNumber.rejectedOffers +
          newTotalNumber.withdrawnOffers;
      });

      const newListMenu = listMenu.map((item) => {
        const { key = '' } = item;
        let newItem = item;
        let newQuantity = item.quantity;
        let dataLength = 0;
        if (key === 'all') {
          dataLength = newTotalNumber.all;
        }
        if (key === 'drafts') {
          dataLength = newTotalNumber.drafts;
        }
        if (key === 'profileVerification') {
          dataLength = newTotalNumber.profileVerification;
        }
        if (key === 'documentVerification') {
          dataLength = newTotalNumber.documentVerification;
        }
        if (key === 'salaryNegotiation') {
          dataLength = newTotalNumber.salaryNegotiation;
        }
        if (key === 'awaitingApprovals') {
          dataLength = newTotalNumber.awaitingApprovals;
        }
        if (key === 'offerReleased') {
          dataLength = newTotalNumber.offerReleased;
        }
        if (key === 'offerAccepted') {
          dataLength = newTotalNumber.offerAccepted;
        }
        if (key === 'rejectedOffers') {
          dataLength = newTotalNumber.rejectedOffers;
        }
        if (key === 'withdrawnOffers') {
          dataLength = newTotalNumber.withdrawnOffers;
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
            listMenu: newListMenu,
          },
        },
      };
    },
  },
};

export default onboarding;
