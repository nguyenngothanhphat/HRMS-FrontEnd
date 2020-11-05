import { getOnboardingList, deleteDraft, inititateBackgroundCheck } from '@/services/onboard';
import _ from 'lodash';
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

const PROCESS_STATUS = {
  PROVISIONAL_OFFER_DRAFT: 'DRAFT',
  FINAL_OFFERS_DRAFT: 'FINAL-OFFERS-DRAFT',

  SENT_PROVISIONAL_OFFERS: 'SENT-PROVISIONAL-OFFER',
  ACCEPTED_PROVISIONAL_OFFERS: 'ACCEPT-PROVISIONAL-OFFER',
  RENEGOTIATE_PROVISIONAL_OFFERS: 'RENEGOTIATE-PROVISONAL-OFFER',

  PENDING: 'PENDING-BACKGROUND-CHECK',
  ELIGIBLE_CANDIDATES: 'ELIGIBLE-CANDIDATE',
  INELIGIBLE_CANDIDATES: 'INELIGIBLE-CANDIDATE',

  SENT_FOR_APPROVAL: 'PENDING-APPROVAL-FINAL-OFFER',
  APPROVED_OFFERS: 'APPROVED-FINAL-OFFER',

  SENT_FINAL_OFFERS: 'SENT-FINAL-OFFERS',
  ACCEPTED_FINAL_OFFERS: 'ACCEPT-FINAL-OFFER',
  RENEGOTIATE_FINAL_OFFERS: 'RENEGOTIATE-FINAL-OFFERS',

  PROVISIONAL_OFFERS: 'DISCARDED-PROVISONAL-OFFER',
  FINAL_OFFERS: 'FINAL-OFFERS',
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
  if (!date) {
    return '';
  }
  const dateObj = new Date(date);
  const month = dateObj.getUTCMonth(); // months from 1-12
  // const month = dateObj.getUTCMonth() + 1; // months from 1-12
  const day = dateObj.getUTCDate();
  const year = dateObj.getUTCFullYear();

  const newDate = `${formatDay(day)} ${formatMonth(month).substring(0, 3)}, ${year}`;
  return newDate;
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
      fullName,
      // position,
      title = '',
      workLocation = '',
      updatedAt = '',
      createdAt = '',
      comments = '',
    } = item;
    const dateSent = formatDate(createdAt) || '';
    const dateReceived = formatDate(updatedAt) || '';
    const dateJoin = formatDate(updatedAt) || '';
    const dateRequest = formatDate(updatedAt) || '';
    const expire = formatDate(updatedAt) || '';
    let isNew = false;
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
      expire: expire || '',
      documentVerified: '',
      resubmit: 0,
      changeRequest: '-',
    };
    formatList.push(rookie);
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
    // eslint-disable-next-line no-shadow
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
        };
        const response = yield call(getOnboardingList, req);
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        // const returnedData = formatData(response.data[0].paginatedResults);
        const returnedData = formatData(response.data);

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

    *deleteTicketDraft({ payload }, { call, put }) {
      try {
        const { id = '' } = payload;
        const req = {
          rookieID: id,
        };
        const response = yield call(deleteDraft, req);
        const { statusCode } = response;
        if (statusCode !== 200) throw response;

        // deleteTicket
        yield put({
          type: 'deleteTicket',
          payload: id,
        });
        yield put({
          type: 'updateMenuQuantity',
          payload: {},
        });
        // yield put({
        //   type: 'fetchOnboardList',
        //   payload: {
        //     processStatus: PROVISIONAL_OFFER_DRAFT,
        //   },
        // });
      } catch (error) {
        dialog(error);
      }
    },

    *inititateBackgroundCheckEffect({ payload }, { call, put }) {
      try {
        const { ACCEPTED_PROVISIONAL_OFFERS, PENDING } = PROCESS_STATUS;
        const { rookieID = '' } = payload;
        const req = {
          rookieID,
        };
        const response = yield call(inititateBackgroundCheck, req);
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
          dataLength =
            state.onboardingOverview.allDrafts.provisionalOfferDrafts.length +
            state.onboardingOverview.allDrafts.finalOfferDrafts.length;
        }
        if (key === 'provisionalOffers') {
          dataLength =
            state.onboardingOverview.provisionalOffers.sentProvisionalOffers.length +
            state.onboardingOverview.provisionalOffers.acceptedProvisionalOffers.length +
            state.onboardingOverview.provisionalOffers.renegotiateProvisionalOffers.length;
        }
        if (key === 'backgroundChecks') {
          dataLength =
            state.onboardingOverview.backgroundCheck.pending.length +
            state.onboardingOverview.backgroundCheck.eligibleCandidates.length +
            state.onboardingOverview.backgroundCheck.ineligibleCandidates.length;
        }
        if (key === 'awaitingApprovals') {
          dataLength =
            state.onboardingOverview.awaitingApprovals.sentForApprovals.length +
            state.onboardingOverview.awaitingApprovals.approvedOffers.length;
        }
        if (key === 'finalOffers') {
          dataLength =
            state.onboardingOverview.finalOffers.acceptedFinalOffers.length +
            state.onboardingOverview.finalOffers.sentFinalOffers.length +
            state.onboardingOverview.finalOffers.renegotiateFinalOffers.length;
        }
        if (key === 'discardedOffers') {
          dataLength =
            state.onboardingOverview.discardedOffers.provisionalOffers.length +
            state.onboardingOverview.discardedOffers.finalOffers.length;
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
        onboardingOverview: { allDrafts: { provisionalOfferDrafts = [] } = {} } = {},
      } = state;
      const newList = provisionalOfferDrafts.filter((item) => {
        const { rookieId } = item;
        return rookieId !== `#${payload}`;
      });
      return {
        ...state,
        onboardingOverview: {
          ...state.onboardingOverview,
          allDrafts: {
            ...state.onboardingOverview.allDrafts,
            provisionalOfferDrafts: newList,
          },
        },
      };
    },
  },
};
export default onboard;
