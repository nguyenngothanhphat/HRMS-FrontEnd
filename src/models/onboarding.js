import { notification } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { history } from 'umi';
import {
  MENU_DATA,
  NEW_PROCESS_STATUS,
  NEW_PROCESS_STATUS_TABLE_NAME,
  PROCESS_STATUS,
} from '@/constants/onboarding';
import {
  addJoiningFormalities,
  checkExistingUserName,
  createEmployee,
  createProfile,
  createUserName,
  deleteDraft,
  getCandidateById,
  getDomain,
  getEmployeeIdFormatByLocation,
  getFilterList,
  getListEmployee,
  getListJoiningFormalities,
  getListNewComer,
  getLocationList,
  getOnboardingList,
  getPosition,
  getSettingEmployeeId,
  getTotalNumberOnboardingList,
  handleExpiryTicket,
  initiateBackgroundCheck,
  reassignTicket,
  removeJoiningFormalities,
  updateEmployeeFormatByGlobal,
  updateEmployeeFormatByLocation,
  updateJoiningFormalities,
  updateSettingEmployeeId,
  withdrawTicket,
} from '@/services/onboarding';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import { dialog } from '@/utils/utils';

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
      needsChanges: [],
      offerReleased: [],
      offerAccepted: [],
      rejectedOffers: [],
      withdrawnOffers: [],
      joinedOffers: [],
      currentStatus: '',
      referenceVerification: [],
      checkListVerification: [],
    },
    searchOnboarding: {
      jobTitleList: [],
      locationList: [],
      isFilter: false,
    },
    customFields: {},
    employeeList: [],
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
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;
        // const data = formatData(response.data);

        yield put({
          type: 'saveAll',
          payload: data,
        });
        yield put({
          type: 'saveOnboardingOverview',
          payload: {
            total: response.total,
            currentStatus: processStatus || 'ALL',
          },
        });
        return response;
      } catch (errors) {
        dialog(errors);
        return '';
      }
    },
    *fetchOnboardList({ payload = {} }, { call, put }) {
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
          NEEDS_CHANGES,
          OFFER_RELEASED,
          OFFER_ACCEPTED,
          OFFER_REJECTED,
          OFFER_WITHDRAWN,
          JOINED,
          REFERENCE_VERIFICATION,
          DOCUMENT_CHECKLIST_VERIFICATION,
        } = NEW_PROCESS_STATUS;

        const { processStatus = [], page, limit } = payload;
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
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;
        // const data = formatData(response.data);

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
              payload: {
                drafts: data,
              },
            });
            return response;
          }
          case PROFILE_VERIFICATION: {
            yield put({
              type: 'saveOnboardingOverview',
              payload: {
                profileVerifications: data,
              },
            });
            return response;
          }
          case DOCUMENT_VERIFICATION: {
            yield put({
              type: 'saveOnboardingOverview',
              payload: {
                documentVerifications: data,
              },
            });
            return response;
          }
          case SALARY_NEGOTIATION: {
            yield put({
              type: 'saveOnboardingOverview',
              payload: {
                salaryNegotiations: data,
              },
            });
            return response;
          }
          case AWAITING_APPROVALS: {
            yield put({
              type: 'saveOnboardingOverview',
              payload: {
                awaitingApprovals: data,
              },
            });
            return response;
          }
          case NEEDS_CHANGES: {
            yield put({
              type: 'saveOnboardingOverview',
              payload: {
                needsChanges: data,
              },
            });
            return response;
          }
          case OFFER_RELEASED: {
            yield put({
              type: 'saveOnboardingOverview',
              payload: {
                offerReleased: data,
              },
            });
            return response;
          }
          case OFFER_ACCEPTED: {
            yield put({
              type: 'saveOnboardingOverview',
              payload: {
                offerAccepted: data,
              },
            });
            return response;
          }
          case OFFER_REJECTED: {
            yield put({
              type: 'saveOnboardingOverview',
              payload: {
                rejectedOffers: data,
              },
            });
            return response;
          }
          case OFFER_WITHDRAWN: {
            yield put({
              type: 'saveOnboardingOverview',
              payload: {
                withdrawnOffers: data,
              },
            });
            return response;
          }
          case REFERENCE_VERIFICATION: {
            yield put({
              type: 'saveOnboardingOverview',
              payload: {
                referenceVerification: data,
              },
            });
            return response;
          }
          case DOCUMENT_CHECKLIST_VERIFICATION: {
            yield put({
              type: 'saveOnboardingOverview',
              payload: {
                checkListVerification: data,
              },
            });
            return response;
          }
          case JOINED: {
            yield put({
              type: 'saveOnboardingOverview',
              payload: {
                joinedOffers: data,
              },
            });
            return response;
          }
          default:
            return response;
        }
      } catch (errors) {
        dialog(errors);
        return '';
      }
    },
    *filterOnboardList({ payload = {}, currentStatus = '' }, { call, put }) {
      try {
        const tenantId = getCurrentTenant();
        const company = getCurrentCompany();

        const {
          DRAFT,
          PROFILE_VERIFICATION,
          DOCUMENT_VERIFICATION,
          SALARY_NEGOTIATION,
          AWAITING_APPROVALS,
          NEEDS_CHANGES,
          OFFER_RELEASED,
          OFFER_ACCEPTED,
          OFFER_REJECTED,
          OFFER_WITHDRAWN,
          JOINED,
          REFERENCE_VERIFICATION,
          DOCUMENT_CHECKLIST_VERIFICATION,
        } = NEW_PROCESS_STATUS;

        const response = yield call(getOnboardingList, {
          ...payload,
          tenantId,
          company,
        });

        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;
        // const data = formatData(response.data);

        yield put({
          type: 'saveOnboardingOverview',
          payload: {
            total: response.total,
          },
        });

        switch (currentStatus) {
          case DRAFT:
            yield put({
              type: 'saveOnboardingOverview',
              payload: {
                drafts: data,
              },
            });
            break;
          case PROFILE_VERIFICATION: {
            yield put({
              type: 'saveOnboardingOverview',
              payload: {
                profileVerifications: data,
              },
            });
            break;
          }
          case DOCUMENT_VERIFICATION: {
            yield put({
              type: 'saveOnboardingOverview',
              payload: {
                documentVerifications: data,
              },
            });
            break;
          }
          case SALARY_NEGOTIATION: {
            yield put({
              type: 'saveOnboardingOverview',
              payload: {
                salaryNegotiations: data,
              },
            });
            break;
          }
          case AWAITING_APPROVALS: {
            yield put({
              type: 'saveOnboardingOverview',
              payload: {
                awaitingApprovals: data,
              },
            });
            break;
          }
          case NEEDS_CHANGES: {
            yield put({
              type: 'saveOnboardingOverview',
              payload: {
                needsChanges: data,
              },
            });
            break;
          }
          case OFFER_RELEASED: {
            yield put({
              type: 'saveOnboardingOverview',
              payload: {
                offerReleased: data,
              },
            });
            break;
          }
          case OFFER_ACCEPTED: {
            yield put({
              type: 'saveOnboardingOverview',
              payload: {
                offerAccepted: data,
              },
            });
            break;
          }
          case OFFER_REJECTED: {
            yield put({
              type: 'saveOnboardingOverview',
              payload: {
                rejectedOffers: data,
              },
            });
            break;
          }
          case OFFER_WITHDRAWN: {
            yield put({
              type: 'saveOnboardingOverview',
              payload: {
                withdrawnOffers: data,
              },
            });
            break;
          }
          case REFERENCE_VERIFICATION: {
            yield put({
              type: 'saveOnboardingOverview',
              payload: {
                referenceVerification: data,
              },
            });
            break;
          }
          case DOCUMENT_CHECKLIST_VERIFICATION: {
            yield put({
              type: 'saveOnboardingOverview',
              payload: {
                checkListVerification: data,
              },
            });
            break;
          }
          case JOINED: {
            yield put({
              type: 'saveOnboardingOverview',
              payload: {
                joinedOffers: data,
              },
            });
            return response;
          }
          default:
            // ALL
            yield put({
              type: 'saveAll',
              payload: data,
            });
            break;
        }
      } catch (errors) {
        dialog(errors);
      }
      return {};
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
              processStatus: [processStatus],
            },
          });
          yield put({
            type: 'fetchOnboardListAll',
            payload: {},
          });
        }

        notification.success({
          message: 'Delete ticket successfully.',
        });
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
          // page = '',
          // limit = '',
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
              // page,
              // limit,
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
    *withdrawTicket({ payload = {}, processStatus = '' }, { call, put }) {
      let response = {};
      try {
        response = yield call(withdrawTicket, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode } = response;
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
    *fetchEmployeeList({ payload = {} }, { call, put }) {
      try {
        const response = yield call(getListEmployee, {
          ...payload,
          status: ['ACTIVE'],
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data: employeeList = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { employeeList } });
        return employeeList;
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
          payload: {
            locationList,
          },
        });
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
    updateMenuQuantity(state, action) {
      const {
        DRAFT,
        PROFILE_VERIFICATION,
        DOCUMENT_VERIFICATION,
        SALARY_NEGOTIATION,
        AWAITING_APPROVALS,
        NEEDS_CHANGES,
        OFFER_RELEASED,
        OFFER_ACCEPTED,
        OFFER_REJECTED,
        OFFER_WITHDRAWN,
        JOINED,
        REFERENCE_VERIFICATION,
        DOCUMENT_CHECKLIST_VERIFICATION,
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
        needsChanges: 0,
        offerReleased: 0,
        offerAccepted: 0,
        rejectedOffers: 0,
        withdrawnOffers: 0,
        joined: 0,
        referenceVerification: 0,
        checkListVerification: 0,
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
          case NEEDS_CHANGES:
            newTotalNumber.needsChanges += count;
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
          case JOINED:
            newTotalNumber.joined += count;
            break;
          case REFERENCE_VERIFICATION:
            newTotalNumber.referenceVerification += count;
            break;
          case DOCUMENT_CHECKLIST_VERIFICATION:
            newTotalNumber.checkListVerification += count;
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
          newTotalNumber.needsChanges +
          newTotalNumber.offerReleased +
          newTotalNumber.offerAccepted +
          newTotalNumber.rejectedOffers +
          newTotalNumber.withdrawnOffers +
          newTotalNumber.referenceVerification +
          newTotalNumber.joined +
          newTotalNumber.checkListVerification;
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
        if (key === 'needsChanges') {
          dataLength = newTotalNumber.needsChanges;
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
        if (key === 'checkList') {
          dataLength = newTotalNumber.checkListVerification;
        }
        if (key === 'joined') {
          dataLength = newTotalNumber.joined;
        }
        if (key === 'referenceVerification') {
          dataLength = newTotalNumber.referenceVerification;
        }

        newQuantity = dataLength;
        newItem = {
          ...newItem,
          quantity: newQuantity,
        };
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
export default onboarding;
