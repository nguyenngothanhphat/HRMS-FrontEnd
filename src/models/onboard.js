import getOnboardingList from '@/services/onboard';
import { dialog } from '@/utils/utils';

const rookieList = [
  {
    key: '1',
    rookieId: '#16003134',
    isNew: true,
    rookieName: 'Matt Wagoner',
    position: 'Sr. UX Designer',
    location: 'Mumbai',
    comments: 'Passport submission pending …',
    dateSent: '29th Sept, 2020',
    dateReceived: '11th October, 2020',
    dateJoin: '29th Sept, 2020',
    dateRequest: '20 Aug, 2020',
    expire: '30th Oct, 2020',
    documentVerified: '4/5',
    resubmit: 2,
    changeRequest: 'Change in DOJ',
  },
  {
    key: '2',
    rookieId: '#18001829',
    isNew: true,
    rookieName: 'JT Grauke',
    position: 'UI Designer',
    location: 'Mumbai',
    comments: 'Fake eligibility documents',
    dateSent: '3rd Oct, 2020',
    dateReceived: '11th October, 2020',
    dateJoin: '29th Sept, 2020',
    dateRequest: '20 Aug, 2020',
    expire: '30th Oct, 2020',
    documentVerified: '4/5',
    resubmit: 1,
    changeRequest: '-',
  },
  {
    key: '3',
    rookieId: '#16210862',
    isNew: true,
    rookieName: 'Ryan Jhonson',
    position: 'Sr. UI Designer',
    location: 'Chennai',
    comments: 'Fake eligibility documents',
    dateSent: '30th Nov, 2020',
    dateReceived: '11th October, 2020',
    dateJoin: '29th Sept, 2020',
    dateRequest: '20 Aug, 2020',
    expire: '30th Oct, 2020',
    documentVerified: '4/5',
    resubmit: '-',
    changeRequest: '-',
  },
  {
    key: '4',
    rookieId: '#10928389',
    isNew: true,
    rookieName: 'Billy Hoffman',
    position: 'Illustrator',
    location: 'Mumbai',
    comments: 'Fake eligibility documents',
    dateSent: '29th Sept, 2020',
    dateReceived: '11th October, 2020',
    dateJoin: '29th Sept, 2020',
    dateRequest: '20 Aug, 2020',
    expire: '30th Oct, 2020',
    documentVerified: '4/5',
    resubmit: 1,
    changeRequest: 'Change in DOJ',
  },
  {
    key: '5',
    rookieId: '#16013134',
    rookieName: 'Karthik Naren',
    position: 'Jr. UI Designer',
    location: 'Dubai',
    comments: 'Eligibility date expireds',
    dateSent: '12th Jan, 2020',
    dateReceived: '11th October, 2020',
    dateJoin: '29th Sept, 2020',
    dateRequest: '20 Aug, 2020',
    expire: '30th Oct, 2020',
    documentVerified: '4/5',
    resubmit: '-',
    changeRequest: 'Change in DOJ',
  },
  {
    key: '6',
    rookieId: '#16211862',
    rookieName: 'Ema Drek',
    position: 'Sr. UX Designer',
    location: 'Bangalore',
    comments: 'Eligibility date expired',
    dateSent: '09th Aug, 2020',
    dateReceived: '11th October, 2020',
    dateJoin: '29th Sept, 2020',
    dateRequest: '20 Aug, 2020',
    expire: '30th Oct, 2020',
    documentVerified: '4/5',
    resubmit: '-',
    changeRequest: '-',
  },
  {
    key: '7',
    rookieId: '#11928389',
    rookieName: 'Suraj Bhatt',
    position: 'Sr. Illustrator',
    location: 'Dubai',
    comments: 'Fake eligibility documents',
    dateSent: '19th June, 2020',
    dateReceived: '11th October, 2020',
    dateJoin: '29th Sept, 2020',
    dateRequest: '20 Aug, 2020',
    expire: '30th Oct, 2020',
    documentVerified: '4/5',
    resubmit: 3,
    changeRequest: 'Change in DOJ',
  },
  {
    key: '8',
    rookieId: '#10978389',
    rookieName: 'Siddartha',
    position: 'Sr. Illustrator',
    location: 'Dubai',
    comments: 'Fake eligibility documents',
    dateSent: '23th May, 2020',
    dateReceived: '11th October, 2020',
    dateJoin: '29th Sept, 2020',
    dateRequest: '20 Aug, 2020',
    expire: '30th Oct, 2020',
    documentVerified: '4/5',
    resubmit: '-',
    changeRequest: '-',
  },
  {
    key: '9',
    rookieId: '#10926389',
    rookieName: 'Suraj Bhatt',
    position: 'Sr. Illustrator',
    location: 'Dubai',
    comments: 'Eligibility date expired',
    dateSent: '23th May, 2020',
    dateReceived: '11th October, 2020',
    dateJoin: '29th Sept, 2020',
    dateRequest: '20 Aug, 2020',
    expire: '30th Oct, 2020',
    documentVerified: '4/5',
    resubmit: 2,
    changeRequest: 'Change in DOJ',
  },
  {
    key: '10',
    rookieId: '#10928089',
    rookieName: 'Suraj Bhatt',
    position: 'Sr. Illustrator',
    location: 'Dubai',
    comments: 'Eligibility date expired',
    dateSent: '23th May, 2020',
    dateReceived: '11th October, 2020',
    dateJoin: '29th Sept, 2020',
    dateRequest: '20 Aug, 2020',
    expire: '30th Oct, 2020',
    documentVerified: '4/5',
    resubmit: '-',
    changeRequest: '-',
  },
  // Clone
  {
    key: '11',
    rookieId: '#26003134',
    rookieName: 'Matt Wagoner',
    position: 'Sr. UX Designer',
    location: 'Mumbai',
    comments: 'Passport submission pending …',
    dateSent: '23th May, 2020',
    dateReceived: '11th October, 2020',
    dateJoin: '29th Sept, 2020',
    dateRequest: '20 Aug, 2020',
    expire: '30th Oct, 2020',
    documentVerified: '4/5',
    resubmit: 1,
    changeRequest: 'Change in DOJ',
  },
  {
    key: '12',
    rookieId: '#28001829',
    isNew: true,
    rookieName: 'JT Grauke',
    position: 'UI Designer',
    location: 'Mumbai',
    comments: 'Fake eligibility documents',
    dateSent: '23th May, 2020',
    dateReceived: '11th October, 2020',
    dateJoin: '29th Sept, 2020',
    dateRequest: '20 Aug, 2020',
    expire: '30th Oct, 2020',
    documentVerified: '4/5',
    resubmit: '-',
    changeRequest: '-',
  },
  {
    key: '13',
    rookieId: '#26210862',
    rookieName: 'Ryan Jhonson',
    position: 'Sr. UI Designer',
    location: 'Chennai',
    comments: 'Fake eligibility documents',
    dateSent: '23th May, 2020',
    dateReceived: '11th October, 2020',
    dateJoin: '29th Sept, 2020',
    dateRequest: '20 Aug, 2020',
    expire: '30th Oct, 2020',
    documentVerified: '4/5',
    resubmit: '-',
    changeRequest: 'Change in DOJ',
  },
  {
    key: '14',
    rookieId: '#20928389',
    rookieName: 'Billy Hoffman',
    position: 'Illustrator',
    location: 'Mumbai',
    comments: 'Fake eligibility documents',
    dateSent: '23th May, 2020',
    dateReceived: '11th October, 2020',
    dateJoin: '29th Sept, 2020',
    dateRequest: '20 Aug, 2020',
    expire: '30th Oct, 2020',
    documentVerified: '4/5',
    resubmit: 1,
    changeRequest: 'Change in DOJ',
  },
  {
    key: '15',
    rookieId: '#26013134',
    rookieName: 'Karthik Naren',
    position: 'Jr. UI Designer',
    location: 'Dubai',
    comments: 'Eligibility date expireds',
    dateSent: '23th May, 2020',
    dateReceived: '11th October, 2020',
    dateJoin: '29th Sept, 2020',
    dateRequest: '20 Aug, 2020',
    expire: '30th Oct, 2020',
    documentVerified: '4/5',
    resubmit: 1,
    changeRequest: '-',
  },
  {
    key: '16',
    rookieId: '#26211862',
    isNew: true,
    rookieName: 'Ema Drek',
    position: 'Sr. UX Designer',
    location: 'Bangalore',
    comments: 'Eligibility date expired',
    dateSent: '23th May, 2020',
    dateReceived: '11th October, 2020',
    dateJoin: '29th Sept, 2020',
    dateRequest: '20 Aug, 2020',
    expire: '30th Oct, 2020',
    documentVerified: '4/5',
    resubmit: '-',
    changeRequest: 'Change in DOJ',
  },
  {
    key: '17',
    rookieId: '#21928389',
    isNew: true,
    rookieName: 'Suraj Bhatt',
    position: 'Sr. Illustrator',
    location: 'Dubai',
    comments: 'Fake eligibility documents',
    dateSent: '23th May, 2020',
    dateReceived: '11th October, 2020',
    dateJoin: '29th Sept, 2020',
    dateRequest: '20 Aug, 2020',
    expire: '30th Oct, 2020',
    documentVerified: '4/5',
    resubmit: '-',
    changeRequest: '-',
  },
  {
    key: '18',
    rookieId: '#20978389',
    rookieName: 'Siddartha',
    position: 'Sr. Illustrator',
    location: 'Dubai',
    comments: 'Fake eligibility documents',
    dateSent: '23th May, 2020',
    dateReceived: '11th October, 2020',
    dateJoin: '29th Sept, 2020',
    dateRequest: '20 Aug, 2020',
    expire: '30th Oct, 2020',
    documentVerified: '4/5',
    resubmit: 1,
    changeRequest: 'Change in DOJ',
  },
  {
    key: '19',
    rookieId: '#20926389',
    rookieName: 'Suraj Bhatt',
    position: 'Sr. Illustrator',
    location: 'Dubai',
    comments: 'Eligibility date expired',
    dateSent: '23th May, 2020',
    dateReceived: '11th October, 2020',
    dateJoin: '29th Sept, 2020',
    dateRequest: '20 Aug, 2020',
    expire: '30th Oct, 2020',
    documentVerified: '4/5',
    resubmit: '-',
    changeRequest: 'Change in DOJ',
  },
  {
    key: '20',
    rookieId: '#20928089',
    isNew: true,
    rookieName: 'Suraj Bhatt',
    position: 'Sr. Illustrator',
    location: 'Dubai',
    comments: 'Eligibility date expired',
    dateSent: '23th May, 2020',
    dateReceived: '11th October, 2020',
    dateJoin: '29th Sept, 2020',
    dateRequest: '20 Aug, 2020',
    expire: '30th Oct, 2020',
    documentVerified: '4/5',
    resubmit: 1,
    changeRequest: '-',
  },
];

const employeeList = rookieList.filter(
  (rookie) => rookie.isNew === undefined || rookie.isNew === null,
);

// Mock data for table
const sentEligibilityFormsData = rookieList; // Pending Eligibility Checks
const receivedSubmittedDocumentsData = rookieList; // Pending Eligibility Checks
const eligibleCandidatesData = rookieList;
const ineligibleCandidatesData = rookieList;
const sentProvisionalOffersData = rookieList; // Provisional Offers
const acceptedProvisionalOffersData = rookieList; // Provisional Offers
const renegotiateProvisionalOffersData = rookieList; // Provisional Offers
// const receivedProvisionalOffersData = rookieList; // Provisional Offers (delete)
const discardedProvisionalOffersData = employeeList;
const sentForApprovalsData = employeeList; // Awaiting Approvals
const approvedOffersData = employeeList; // Awaiting Approvals
const approvedFinalOffersData = employeeList; // Awaiting Approvals
const pendingApprovalsData = employeeList; // Awaiting Approvals  del
const rejectFinalOfferData = employeeList; // Awaiting Approvals  del
const acceptedFinalOffersData = employeeList; // Final Offers
const sentFinalOffersData = rookieList; // Final Offers
const renegotiateFinalOffersData = rookieList; // Final Offers
const provisionalOfferDraftsData = employeeList; // All Drafts
const finalOfferDraftsData = employeeList; // All Drafts
const discardedFinalOffersData = rookieList;
const provisionalOffersData = rookieList; // Discarded Offers
const finalOffersData = rookieList; // Discarded Offers

const pendingData = rookieList; // Background Checks

const MENU_DATA = [
  {
    id: 1,
    name: 'All Drafts',
    key: 'allDrafts',
    component: 'AllDrafts',
    // quantity: finalOfferDraftsData.length,
    quantity: provisionalOfferDraftsData.length,
  },
  {
    id: 2,
    name: 'Provisional offers',
    key: 'provisionalOffers',
    component: 'ProvisionalOffers',
    // quantity: sentProvisionalOffersData.length,
    quantity: acceptedProvisionalOffersData.length,
  },
  {
    id: 3,
    name: 'Background checks',
    key: 'backgroundChecks',
    component: 'BackgroundCheck',
    // quantity: sentProvisionalOffersData.length,
    quantity: pendingData.length,
  },
  {
    id: 4,
    name: 'Awaiting approvals',
    key: 'awaitingApprovals',
    component: 'AwaitingApprovals',
    quantity: sentForApprovalsData.length,
  },
  {
    id: 5,
    name: 'Final offers',
    key: 'finalOffers',
    component: 'FinalOffers',
    quantity: sentFinalOffersData.length,
  },
  {
    id: 6,
    name: 'Discarded offers',
    key: 'discardedOffers',
    component: 'DiscardedOffers',
    quantity: provisionalOffersData.length,
    // quantity: 5,
  },
];

// const PROCESS_STATUS = {
//   SENT_ELIGIBILITY_FORMS: 'SENT-ELIGIBILITY-FORMS',
//   RECEIVED_SUBMITTED_DOCUMENTS: 'RECEIVED-SUBMITTED-DOCUMENTS',
//   ELIGIBLE_CANDIDATES: 'ELIGIBLE-CANDIDATES-FOR-OFFERS',
//   INELIGIBLE_CANDIDATES: 'INELIGIBLE-CANDIDATES',
//   SENT_PROVISIONAL_OFFERS: 'SENT-PROVISION-OFFER',
//   RECEIVED_PROVISIONAL_OFFERS: 'RECEIVED-PROVISION-OFFER',
//   DISCARDED_PROVISIONAL_OFFERS: 'DISCARDED-PROVISONAL-OFFER',
//   PENDING_APPROVALS: 'PENDING-APPROVAL',
//   APPROVED_FINAL_OFFERS: 'APPROVED-FINAL-OFFERS',
//   REJECT_FINAL_OFFERS: 'REJECT-FINAL-OFFER',
//   SENT_FINAL_OFFERS: 'SENT-FINAL-OFFER',
//   ACCEPTED_FINAL_OFFERS: 'ACCEPT-OFFER',
//   FINAL_OFFERS_DRAFTS: 'FINAL-OFFER-DRAFES',
//   DISCARDED_FINAL_OFFERS: 'ACCEPT-OFFER',
// };

const PROCESS_STATUS = {
  PROVISIONAL_OFFER_DRAFT: 'PROVISIONAL_OFFER_DRAFT',
  FINAL_OFFERS_DRAFT: 'FINAL_OFFERS_DRAFT',

  SENT_PROVISIONAL_OFFERS: 'SENT-PROVISIONAL-OFFER',
  ACCEPTED_PROVISIONAL_OFFERS: 'ACCEPTED_PROVISIONAL_OFFER',
  RENEGOTIATE_PROVISIONAL_OFFERS: 'RENEGOTIATE_PROVISIONAL_OFFER',

  PENDING: 'PENDING-BACKGROUND-CHECK',
  ELIGIBLE_CANDIDATES: 'ELIGIBLE_CANDIDATE',
  INELIGIBLE_CANDIDATES: 'INELIGIBLE_CANDIDATE',

  SENT_FOR_APPROVAL: 'SENT_FOR_APPROVAL',
  APPROVED_OFFERS: 'APPROVED_OFFERS',

  SENT_FINAL_OFFERS: 'SENT_FINAL_OFFERS',
  ACCEPTED_FINAL_OFFERS: 'ACCEPTED_FINAL_OFFERS',
  RENEGOTIATE_FINAL_OFFERS: 'RENEGOTIATE_FINAL_OFFERS',

  PROVISIONAL_OFFERS: 'PROVISIONAL_OFFERS',
  FINAL_OFFERS: 'FINAL_OFFERS',
};

const formatMonth = (month) => {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  return monthNames[month];
};

const formatDay = (day) => {
  const nth = (d) => {
    if (d > 3 && d < 21) return 'th';
    switch (d % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  };
  return day + nth(day);
};

const formatDate = (date) => {
  const dateObj = new Date(date);
  const month = dateObj.getUTCMonth() + 1; // months from 1-12
  const day = dateObj.getUTCDate();
  const year = dateObj.getUTCFullYear();

  const newDate = `${formatDay(day)} ${formatMonth(month).substring(0, 3)}, ${year}`;
  return newDate;
};

const dateDiffInDays = (a, b) => {
  // a and b are javascript Date objects
  const SECOND_IN_DAY = 1000 * 60 * 60 * 24;
  const firstDate = new Date(a);
  const secondDate = new Date(b);

  const diff = parseFloat((firstDate.getDate() - secondDate.getDate()) / SECOND_IN_DAY);
  return diff;
};

const formatData = (list) => {
  const formatList = [];
  list.map((item) => {
    const {
      ticketID,
      fullName,
      // position,
      title,
      workLocation,
      updatedAt,
      createdAt,
      comments = 'Passport submission pending …',
    } = item;
    // console.log(ticketID, fullName, title, workLocation, updatedAt, createdAt, comments);
    const dateSent = formatDate(createdAt);
    const dateReceived = formatDate(updatedAt);
    const dateJoin = formatDate(updatedAt);
    const dateRequest = formatDate(updatedAt);
    const expire = formatDate(updatedAt);
    // const documentVerified =
    const isNew = dateDiffInDays(Date.now(), updatedAt) < 3;

    const rookie = {
      // rookieId: `#${_id.substring(0, 8)}`,
      rookieId: ticketID,
      isNew,
      rookieName: fullName,
      position: title.name,
      location: workLocation.name || 'Vietnam',
      comments,
      dateSent,
      dateReceived,
      dateJoin,
      dateRequest,
      expire,
      documentVerified: '4/5',
      resubmit: 1,
      changeRequest: '-',
    };
    formatList.push(rookie);
    return null;
  });
  return formatList;
};

const onboard = {
  namespace: 'onboard',

  state: {
    onboardingOverview: {
      pendingEligibilityChecks: {
        sentEligibilityForms: sentEligibilityFormsData,
        receivedSubmittedDocuments: receivedSubmittedDocumentsData,
      },
      eligibleCandidates: eligibleCandidatesData,
      ineligibleCandidates: ineligibleCandidatesData,
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
      allDrafts: {
        provisionalOfferDrafts: provisionalOfferDraftsData,
        finalOfferDrafts: finalOfferDraftsData,
      },
      discardedFinalOffers: discardedFinalOffersData,
      discardedOffers: {
        provisionalOffers: provisionalOffersData,
        finalOffers: finalOffersData,
      },
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
      },
    },
  },

  effects: {
    *fetchAllOnboardList(_, { put }) {
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
        } = PROCESS_STATUS;

        // 1
        yield put({
          type: 'fetchOnboardList',
          payload: {
            processStatus: PROVISIONAL_OFFER_DRAFT,
          },
        });
        yield put({
          type: 'fetchOnboardList',
          payload: {
            processStatus: FINAL_OFFERS_DRAFT,
          },
        });

        // 2
        yield put({
          type: 'fetchOnboardList',
          payload: {
            processStatus: SENT_PROVISIONAL_OFFERS,
          },
        });
        yield put({
          type: 'fetchOnboardList',
          payload: {
            processStatus: ACCEPTED_PROVISIONAL_OFFERS,
          },
        });
        yield put({
          type: 'fetchOnboardList',
          payload: {
            processStatus: RENEGOTIATE_PROVISIONAL_OFFERS,
          },
        });

        // 3
        yield put({
          type: 'fetchOnboardList',
          payload: {
            processStatus: PENDING,
          },
        });
        yield put({
          type: 'fetchOnboardList',
          payload: {
            processStatus: ELIGIBLE_CANDIDATES,
          },
        });
        yield put({
          type: 'fetchOnboardList',
          payload: {
            processStatus: INELIGIBLE_CANDIDATES,
          },
        });

        // 4
        yield put({
          type: 'fetchOnboardList',
          payload: {
            processStatus: SENT_FOR_APPROVAL,
          },
        });
        yield put({
          type: 'fetchOnboardList',
          payload: {
            processStatus: APPROVED_OFFERS,
          },
        });

        // 5
        yield put({
          type: 'fetchOnboardList',
          payload: {
            processStatus: SENT_FINAL_OFFERS,
          },
        });
        yield put({
          type: 'fetchOnboardList',
          payload: {
            processStatus: ACCEPTED_FINAL_OFFERS,
          },
        });
        yield put({
          type: 'fetchOnboardList',
          payload: {
            processStatus: RENEGOTIATE_FINAL_OFFERS,
          },
        });

        // 6
        yield put({
          type: 'fetchOnboardList',
          payload: {
            processStatus: PROVISIONAL_OFFERS,
          },
        });
        yield put({
          type: 'fetchOnboardList',
          payload: {
            processStatus: FINAL_OFFERS,
          },
        });
      } catch (error) {
        dialog(error);
      }
    },

    *fetchOnboardList({ payload }, { call, put }) {
      try {
        const { processStatus = '' } = payload;
        const req = {
          processStatus: [processStatus],
          page: 1,
          limit: 1,
        };
        const response = yield call(getOnboardingList, req);
        // console.log(response);
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        const returnedData = formatData(response.data[0].paginatedResults);

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
        } = PROCESS_STATUS;

        // Fetch data
        switch (processStatus) {
          case PROVISIONAL_OFFER_DRAFT: {
            yield put({
              type: 'saveProvisionalOfferDrafts',
              payload: returnedData,
            });
            // Update menu
            yield put({
              type: 'updateMenuQuantity',
              payload: {},
            });
            return;
          }
          case FINAL_OFFERS_DRAFT: {
            yield put({
              type: 'saveFinalOfferDrafts',
              payload: returnedData,
            });
            // Update menu
            yield put({
              type: 'updateMenuQuantity',
              payload: {},
            });
            return;
          }

          case SENT_PROVISIONAL_OFFERS: {
            yield put({
              type: 'saveSentProvisionalOffers',
              payload: returnedData,
            });
            // Update menu
            yield put({
              type: 'updateMenuQuantity',
              payload: {},
            });
            return;
          }

          case ACCEPTED_PROVISIONAL_OFFERS: {
            yield put({
              type: 'saveAcceptedProvisionalOffers',
              payload: returnedData,
            });
            // Update menu
            yield put({
              type: 'updateMenuQuantity',
              payload: {},
            });
            return;
          }

          case RENEGOTIATE_PROVISIONAL_OFFERS: {
            yield put({
              type: 'saveRenegotiateProvisionalOffers',
              payload: returnedData,
            });
            // Update menu
            yield put({
              type: 'updateMenuQuantity',
              payload: {},
            });
            return;
          }

          case PENDING: {
            yield put({
              type: 'savePending',
              payload: returnedData,
            });
            // Update menu
            yield put({
              type: 'updateMenuQuantity',
              payload: {},
            });
            return;
          }

          case ELIGIBLE_CANDIDATES: {
            yield put({
              type: 'saveEligibleCandidates',
              payload: returnedData,
            });
            // Update menu
            yield put({
              type: 'updateMenuQuantity',
              payload: {},
            });
            return;
          }

          case INELIGIBLE_CANDIDATES: {
            yield put({
              type: 'saveIneligibleCandidates',
              payload: returnedData,
            });
            // Update menu
            yield put({
              type: 'updateMenuQuantity',
              payload: {},
            });
            return;
          }

          case SENT_FOR_APPROVAL: {
            yield put({
              type: 'saveSentForApproval',
              payload: returnedData,
            });
            // Update menu
            yield put({
              type: 'updateMenuQuantity',
              payload: {},
            });
            return;
          }

          case APPROVED_OFFERS: {
            yield put({
              type: 'saveApprovedOffers',
              payload: returnedData,
            });
            // Update menu
            yield put({
              type: 'updateMenuQuantity',
              payload: {},
            });
            return;
          }

          case SENT_FINAL_OFFERS: {
            yield put({
              type: 'saveSentFinalOffers',
              payload: returnedData,
            });
            // Update menu
            yield put({
              type: 'updateMenuQuantity',
              payload: {},
            });
            return;
          }

          case ACCEPTED_FINAL_OFFERS: {
            yield put({
              type: 'saveAcceptedFinalOffers',
              payload: returnedData,
            });
            // Update menu
            yield put({
              type: 'updateMenuQuantity',
              payload: {},
            });
            return;
          }

          case RENEGOTIATE_FINAL_OFFERS: {
            yield put({
              type: 'saveRenegotiateFinalOffers',
              payload: returnedData,
            });
            // Update menu
            yield put({
              type: 'updateMenuQuantity',
              payload: {},
            });
            return;
          }

          case PROVISIONAL_OFFERS: {
            yield put({
              type: 'saveProvisionalOffers',
              payload: returnedData,
            });
            // Update menu
            yield put({
              type: 'updateMenuQuantity',
              payload: {},
            });
            return;
          }

          case FINAL_OFFERS: {
            yield put({
              type: 'saveFinalOffers',
              payload: returnedData,
            });
            // Update menu
            yield put({
              type: 'updateMenuQuantity',
              payload: {},
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
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },

    // 1
    saveProvisionalOfferDrafts(state, action) {
      return {
        ...state,
        onboardingOverview: {
          ...state.onboardingOverview,
          allDrafts: {
            ...state.onboardingOverview.allDrafts,
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
          allDrafts: {
            ...state.onboardingOverview.allDrafts,
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

    updateMenuQuantity(state) {
      const { listMenu } = state.menu.onboardingOverviewTab;
      const newListMenu = listMenu.map((item) => {
        const { key = '' } = item;
        let newItem = item;
        let newQuantity = item.quantity;
        let dataLength = 0;
        if (key === 'allDrafts') {
          dataLength = state.onboardingOverview.allDrafts.provisionalOfferDrafts.length;
        }
        if (key === 'provisionalOffers') {
          dataLength = state.onboardingOverview.provisionalOffers.sentProvisionalOffers.length;
        }
        if (key === 'backgroundChecks') {
          dataLength = state.onboardingOverview.backgroundCheck.pending.length;
        }
        if (key === 'awaitingApprovals') {
          dataLength = state.onboardingOverview.awaitingApprovals.sentForApprovals.length;
        }
        if (key === 'finalOffers') {
          dataLength = state.onboardingOverview.finalOffers.acceptedFinalOffers.length;
        }
        if (key === 'discardedOffers') {
          dataLength = state.onboardingOverview.discardedOffers.provisionalOffers.length;
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
  },
};
export default onboard;
