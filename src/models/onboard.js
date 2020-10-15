import { getOnboardingList } from '@/services/onboard';
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
const receivedProvisionalOffersData = rookieList; // Provisional Offers (delete)
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

const PHASE_DATA = [
  {
    id: 1,
    title: 'phase 1',
    menuItem: [
      {
        id: 4,
        name: 'Provisional offers',
        key: 'provisionalOffers',
        component: 'ProvisionalOffers',
        quantity: sentProvisionalOffersData.length,
      },
      {
        id: 10,
        name: 'Background Checks',
        key: 'backgroundChecks',
        component: 'BackgroundCheck',
        // quantity: sentProvisionalOffersData.length,
        quantity: 10,
      },
      {
        id: 7,
        name: 'Final offers',
        key: 'finalOffers',
        component: 'FinalOffers',
        quantity: sentFinalOffersData.length,
      },
      {
        id: 6,
        name: 'Awaiting approvals',
        key: 'awaitingApprovals',
        component: 'AwaitingApprovals',
        quantity: approvedFinalOffersData.length,
      },
      {
        id: 11,
        name: 'Discarded offers',
        key: 'discardedOffers',
        component: 'DiscardedOffers',
        // quantity: sentFinalOffersData.length,
        quantity: 5,
      },
      {
        id: 8,
        name: 'All Drafts',
        key: 'finalOfferDrafts',
        component: 'FinalOfferDrafts',
        quantity: finalOfferDraftsData.length,
      },
      // {
      //   id: 1,
      //   name: 'Pending Eligibility Checks',
      //   // name: {formatMessage({ id: 'component.onboardingOverview.new' })},
      //   key: 'pendingEligibilityChecks',
      //   component: 'PendingEligibilityChecks',
      //   quantity: sentEligibilityFormsData.length,
      // },
      // {
      //   id: 2,
      //   name: 'Eligible Candidates',
      //   key: 'eligibleCandidates',
      //   component: 'EligibleCandidates',
      //   quantity: eligibleCandidatesData.length,
      // },
      // {
      //   id: 3,
      //   name: 'Ineligible candidates',
      //   key: 'ineligibleCandidates',
      //   component: 'IneligibleCandidates',
      //   quantity: ineligibleCandidatesData.length,
      // },
    ],
  },
  {
    id: 2,
    title: 'phase 2',
    menuItem: [
      // {
      //   id: 4,
      //   name: 'Provisional offers',
      //   key: 'provisionalOffers',
      //   component: 'ProvisionalOffers',
      //   quantity: sentProvisionalOffersData.length,
      // },
      // {
      //   id: 10,
      //   name: 'Background Checks',
      //   key: 'backgroundChecks',
      //   component: 'BackgroundCheck',
      //   // quantity: sentProvisionalOffersData.length,
      //   quantity: 10,
      // },
      // {  // Del
      //   id: 5,
      //   name: 'Discarded Provisional offers',
      //   key: 'discardedProvisionalOffers',
      //   component: 'DiscardedProvisionalOffers',
      //   quantity: discardedProvisionalOffersData.length,
      // },
    ],
  },
  {
    id: 3,
    title: 'phase 3',
    menuItem: [
      // {
      //   id: 7,
      //   name: 'Final offers',
      //   key: 'finalOffers',
      //   component: 'FinalOffers',
      //   quantity: sentFinalOffersData.length,
      // },
      // {
      //   id: 6,
      //   name: 'Awaiting approvals',
      //   key: 'awaitingApprovals',
      //   component: 'AwaitingApprovals',
      //   quantity: approvedFinalOffersData.length,
      // },
      // {
      //   id: 11,
      //   name: 'Discarded offers',
      //   key: 'discardedOffers',
      //   component: 'DiscardedOffers',
      //   // quantity: sentFinalOffersData.length,
      //   quantity: 5,
      // },
      // {
      //   id: 8,
      //   name: 'All Drafts',
      //   key: 'finalOfferDrafts',
      //   component: 'FinalOfferDrafts',
      //   quantity: finalOfferDraftsData.length,
      // },
      // { // Del
      //   id: 9,
      //   name: 'Discarded Final Offers',
      //   key: 'discardedFinalOffers',
      //   component: 'DiscardedFinalOffers',
      //   quantity: discardedFinalOffersData.length,
      // },
    ],
  },
];

const MENU_DATA = [
  {
    id: 1,
    name: 'Provisional offers',
    key: 'provisionalOffers',
    component: 'ProvisionalOffers',
    quantity: sentProvisionalOffersData.length,
  },
  {
    id: 2,
    name: 'Background Checks',
    key: 'backgroundChecks',
    component: 'BackgroundCheck',
    // quantity: sentProvisionalOffersData.length,
    quantity: 10,
  },
  {
    id: 3,
    name: 'Final offers',
    key: 'finalOffers',
    component: 'FinalOffers',
    quantity: sentFinalOffersData.length,
  },
  {
    id: 4,
    name: 'Awaiting approvals',
    key: 'awaitingApprovals',
    component: 'AwaitingApprovals',
    quantity: approvedFinalOffersData.length,
  },
  {
    id: 5,
    name: 'Discarded offers',
    key: 'discardedOffers',
    component: 'DiscardedOffers',
    // quantity: sentFinalOffersData.length,
    quantity: 5,
  },
  {
    id: 6,
    name: 'All Drafts',
    key: 'finalOfferDrafts',
    component: 'FinalOfferDrafts',
    quantity: finalOfferDraftsData.length,
  },
];

const PROCESS_STATUS = {
  SENT_ELIGIBILITY_FORMS: 'SENT-ELIGIBILITY-FORMS',
  RECEIVED_SUBMITTED_DOCUMENTS: 'RECEIVED-SUBMITTED-DOCUMENTS',
  ELIGIBLE_CANDIDATES: 'ELIGIBLE-CANDIDATES-FOR-OFFERS',
  INELIGIBLE_CANDIDATES: 'INELIGIBLE-CANDIDATES',
  SENT_PROVISIONAL_OFFERS: 'SENT-PROVISION-OFFER',
  RECEIVED_PROVISIONAL_OFFERS: 'RECEIVED-PROVISION-OFFER',
  DISCARDED_PROVISIONAL_OFFERS: 'DISCARDED-PROVISONAL-OFFER',
  PENDING_APPROVALS: 'PENDING-APPROVAL',
  APPROVED_FINAL_OFFERS: 'APPROVED-FINAL-OFFERS',
  REJECT_FINAL_OFFERS: 'REJECT-FINAL-OFFER',
  SENT_FINAL_OFFERS: 'SENT-FINAL-OFFER',
  ACCEPTED_FINAL_OFFERS: 'ACCEPT-OFFER',
  FINAL_OFFERS_DRAFTS: 'FINAL-OFFER-DRAFES',
  DISCARDED_FINAL_OFFERS: 'ACCEPT-OFFER',
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

  const newDate = `${formatDay(day)} ${formatMonth(month)}, ${year}`;
  return newDate;
};

const dateDiffInDays = (a, b) => {
  // a and b are javascript Date objects
  // console.log(a);
  // console.log(b);
  // console.log(typeof a);
  // console.log(typeof b);
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  // Discard the time and time-zone information.
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  // console.log(utc1);

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
};

const formatData = (list) => {
  const formatList = [];
  list.map((item) => {
    const {
      _id,
      fullName,
      position,
      title,
      workLocation,
      updatedAt,
      createdAt,
      comments = 'Passport submission pending …',
    } = item;

    const dateSent = formatDate(createdAt);
    const dateReceived = formatDate(updatedAt);
    const dateJoin = formatDate(updatedAt);
    // console.log(dateDiffInDays(Date.now(), new Date(updatedAt)));

    const rookie = {
      rookieId: `#${_id.substring(0, 8)}`,
      isNew: true,
      rookieName: fullName,
      position: title.name,
      location: workLocation.name,
      comments: 'Passport submission pending …',
      dateSent,
      dateReceived,
      dateJoin,
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
        phaseList: PHASE_DATA,
        listMenu: MENU_DATA,
      },
    },
  },

  effects: {
    *fetchAllOnboardList({ payload }, { call, put }) {
      try {
        // yield put({
        //   type: 'updateMenuQuantity',
        //   payload: {},
        // });
        const {
          SENT_ELIGIBILITY_FORMS,
          RECEIVED_SUBMITTED_DOCUMENTS,
          ELIGIBLE_CANDIDATES,
          INELIGIBLE_CANDIDATES,
          SENT_PROVISIONAL_OFFERS,
          RECEIVED_PROVISIONAL_OFFERS,
          DISCARDED_PROVISIONAL_OFFERS,
          PENDING_APPROVALS,
          APPROVED_FINAL_OFFERS,
          REJECT_FINAL_OFFERS,
          SENT_FINAL_OFFERS,
          ACCEPTED_FINAL_OFFERS,
          FINAL_OFFERS_DRAFTS,
          DISCARDED_FINAL_OFFERS,
        } = PROCESS_STATUS;

        yield put({
          type: 'fetchOnboardList',
          payload: {
            processStatus: SENT_ELIGIBILITY_FORMS,
          },
        });
        yield put({
          type: 'fetchOnboardList',
          payload: {
            processStatus: RECEIVED_SUBMITTED_DOCUMENTS,
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
        yield put({
          type: 'fetchOnboardList',
          payload: {
            processStatus: SENT_PROVISIONAL_OFFERS,
          },
        });
        yield put({
          type: 'fetchOnboardList',
          payload: {
            processStatus: RECEIVED_PROVISIONAL_OFFERS,
          },
        });
        yield put({
          type: 'fetchOnboardList',
          payload: {
            processStatus: DISCARDED_PROVISIONAL_OFFERS,
          },
        });
        yield put({
          type: 'fetchOnboardList',
          payload: {
            processStatus: PENDING_APPROVALS,
          },
        });
        yield put({
          type: 'fetchOnboardList',
          payload: {
            processStatus: APPROVED_FINAL_OFFERS,
          },
        });
        yield put({
          type: 'fetchOnboardList',
          payload: {
            processStatus: REJECT_FINAL_OFFERS,
          },
        });
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
            processStatus: FINAL_OFFERS_DRAFTS,
          },
        });
        yield put({
          type: 'fetchOnboardList',
          payload: {
            processStatus: DISCARDED_FINAL_OFFERS,
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
          processStatus,
          page: 1,
          limit: 1,
        };
        const response = yield call(getOnboardingList, req);
        // console.log(response);
        const returnedData = formatData(response.data);
        const { statusCode } = response;
        if (statusCode !== 200) throw response;

        const {
          SENT_ELIGIBILITY_FORMS,
          RECEIVED_SUBMITTED_DOCUMENTS,
          ELIGIBLE_CANDIDATES,
          INELIGIBLE_CANDIDATES,
          SENT_PROVISIONAL_OFFERS,
          RECEIVED_PROVISIONAL_OFFERS,
          DISCARDED_PROVISIONAL_OFFERS,
          PENDING_APPROVALS,
          APPROVED_FINAL_OFFERS,
          REJECT_FINAL_OFFERS,
          SENT_FINAL_OFFERS,
          ACCEPTED_FINAL_OFFERS,
          FINAL_OFFERS_DRAFTS,
          DISCARDED_FINAL_OFFERS,
        } = PROCESS_STATUS;

        // Fetch data
        switch (processStatus) {
          case SENT_ELIGIBILITY_FORMS: {
            yield put({
              type: 'saveSentEligibilityForms',
              payload: returnedData,
            });
            // Update menu
            yield put({
              type: 'updateMenuQuantity',
              payload: {},
            });
            return;
          }
          case RECEIVED_SUBMITTED_DOCUMENTS: {
            yield put({
              type: 'saveReceivedSubmittedDocuments',
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
          case RECEIVED_PROVISIONAL_OFFERS: {
            yield put({
              type: 'saveReceivedProvisionalOffers',
              payload: returnedData,
            });
            // Update menu
            yield put({
              type: 'updateMenuQuantity',
              payload: {},
            });
            return;
          }
          case DISCARDED_PROVISIONAL_OFFERS: {
            yield put({
              type: 'saveDiscardedProvisionalOffers',
              payload: returnedData,
            });
            // Update menu
            yield put({
              type: 'updateMenuQuantity',
              payload: {},
            });
            return;
          }
          case PENDING_APPROVALS: {
            yield put({
              type: 'savePendingApprovals',
              payload: returnedData,
            });
            // Update menu
            yield put({
              type: 'updateMenuQuantity',
              payload: {},
            });
            return;
          }
          case APPROVED_FINAL_OFFERS: {
            yield put({
              type: 'saveApprovedFinalOffers',
              payload: returnedData,
            });
            // Update menu
            yield put({
              type: 'updateMenuQuantity',
              payload: {},
            });
            return;
          }
          case REJECT_FINAL_OFFERS: {
            yield put({
              type: 'saveRejectFinalOffers',
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
          case FINAL_OFFERS_DRAFTS: {
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
          case DISCARDED_FINAL_OFFERS: {
            yield put({
              type: 'saveDiscardedFinalOffer',
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

    saveSentEligibilityForms(state, action) {
      return {
        ...state,
        onboardingOverview: {
          ...state.onboardingOverview,
          pendingEligibilityChecks: {
            ...state.onboardingOverview.pendingEligibilityChecks,
            sentEligibilityForms: action.payload,
          },
        },
      };
    },

    saveReceivedSubmittedDocuments(state, action) {
      return {
        ...state,
        onboardingOverview: {
          ...state.onboardingOverview,
          pendingEligibilityChecks: {
            ...state.onboardingOverview.pendingEligibilityChecks,
            receivedSubmittedDocuments: action.payload,
          },
        },
      };
    },

    saveEligibleCandidates(state, action) {
      return {
        ...state,
        onboardingOverview: {
          ...state.onboardingOverview,
          eligibleCandidates: action.payload,
        },
      };
    },

    saveIneligibleCandidates(state, action) {
      return {
        ...state,
        onboardingOverview: {
          ...state.onboardingOverview,
          ineligibleCandidates: action.payload,
        },
      };
    },

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

    saveReceivedProvisionalOffers(state, action) {
      return {
        ...state,
        onboardingOverview: {
          ...state.onboardingOverview,
          provisionalOffers: {
            ...state.onboardingOverview.provisionalOffers,
            receivedProvisionalOffers: action.payload,
          },
        },
      };
    },

    saveDiscardedProvisionalOffers(state, action) {
      return {
        ...state,
        onboardingOverview: {
          ...state.onboardingOverview,
          discardedProvisionalOffers: action.payload,
        },
      };
    },

    savePendingApprovals(state, action) {
      return {
        ...state,
        onboardingOverview: {
          ...state.onboardingOverview,
          awaitingApprovals: {
            ...state.onboardingOverview.awaitingApprovals,
            pendingApprovals: action.payload,
          },
        },
      };
    },

    saveApprovedFinalOffers(state, action) {
      return {
        ...state,
        onboardingOverview: {
          ...state.onboardingOverview,
          awaitingApprovals: {
            ...state.onboardingOverview.awaitingApprovals,
            approvedFinalOffers: action.payload,
          },
        },
      };
    },

    saveRejectFinalOffers(state, action) {
      return {
        ...state,
        onboardingOverview: {
          ...state.onboardingOverview,
          awaitingApprovals: {
            ...state.onboardingOverview.awaitingApprovals,
            rejectFinalOffer: action.payload,
          },
        },
      };
    },

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

    saveFinalOfferDrafts(state, action) {
      return {
        ...state,
        onboardingOverview: {
          ...state.onboardingOverview,
          finalOfferDrafts: action.payload,
        },
      };
    },

    saveDiscardedFinalOffer(state, action) {
      return {
        ...state,
        onboardingOverview: {
          ...state.onboardingOverview,
          discardedFinalOffers: action.payload,
        },
      };
    },

    updateMenuQuantity(state, action) {
      const { phaseList } = state.menu.onboardingOverviewTab;
      let newPhaseList = [];
      newPhaseList = phaseList.map((phaseItem) => {
        const { menuItem } = phaseItem;

        const newMenuItem = menuItem.map((item) => {
          const { key } = item;
          let newItem = item;
          let newQuantity = item.quantity;
          let dataLength = 0;
          if (key === 'pendingEligibilityChecks') {
            dataLength =
              state.onboardingOverview.pendingEligibilityChecks.sentEligibilityForms.length;
          }
          if (key === 'eligibleCandidates') {
            dataLength = state.onboardingOverview.eligibleCandidates.length;
          }
          if (key === 'ineligibleCandidates') {
            dataLength = state.onboardingOverview.ineligibleCandidates.length;
          }
          if (key === 'provisionalOffers') {
            dataLength = state.onboardingOverview.provisionalOffers.sentProvisionalOffers.length;
          }
          if (key === 'discardedProvisionalOffers') {
            dataLength = state.onboardingOverview.discardedProvisionalOffers.length;
          }
          if (key === 'awaitingApprovals') {
            dataLength = state.onboardingOverview.awaitingApprovals.approvedFinalOffers.length;
          }
          if (key === 'finalOffers') {
            dataLength = state.onboardingOverview.finalOffers.acceptedFinalOffers.length;
          }
          if (key === 'finalOfferDrafts') {
            dataLength = state.onboardingOverview.finalOfferDrafts.length;
          }
          if (key === 'discardedFinalOffers') {
            dataLength = state.onboardingOverview.discardedFinalOffers.length;
          }
          newQuantity = dataLength;
          newItem = { ...newItem, quantity: newQuantity };
          return newItem;
        });
        return {
          menuItem: newMenuItem,
        };
      });

      return {
        ...state,
        menu: {
          ...state.menu,
          onboardingOverviewTab: {
            phaseList: newPhaseList,
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
