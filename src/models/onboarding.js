import moment from 'moment';
import _ from 'lodash';

import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import { dialog } from '@/utils/utils';
import { getOnboardingList, getTotalNumberOnboardingList } from '@/services/onboard';
import { PROCESS_STATUS_TABLE_NAME } from '@/utils/onboarding';

const allData = []; // ALL
const draftData = []; // DRAFT
const profileVerificationData = []; // PROFILE VERFICATION

const MENU_DATA = [
  {
    id: 1,
    name: 'All',
    key: 'all',
    component: 'All',
    quantity: allData.length,
    link: 'all',
  },
  {
    id: 2,
    name: 'Drafts',
    key: 'drafts',
    component: 'Drafts',
    quantity: draftData.length,
    link: 'drafts',
  },
  {
    id: 3,
    name: 'Profile Verification',
    key: 'profileVerification',
    component: 'ProfileVerification',
    quantity: profileVerificationData.length,
    link: 'profile-verification',
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
      const { listMenu } = state.menu.onboardingOverviewTab;
      const { totalNumber } = action.payload;

      const newTotalNumber = {
        all: 0,
        drafts: 0,
        profileVerificationData: 0,
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
          default:
            break;
        }

        newTotalNumber.all = newTotalNumber.drafts + newTotalNumber.profileVerificationData;
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
