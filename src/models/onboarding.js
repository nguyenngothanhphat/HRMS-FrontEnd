import { notification } from 'antd';
import { history } from 'umi';
import { MENU_DATA, NEW_PROCESS_STATUS } from '@/constants/onboarding';
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
  reassignTicket,
  removeJoiningFormalities,
  updateEmployeeFormatByGlobal,
  updateEmployeeFormatByLocation,
  updateJoiningFormalities,
  updateSettingEmployeeId,
  withdrawTicket,
  getListEmployeeByIds,
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
      onboardingData: [],
    },
    searchOnboarding: {
      jobTitleList: [],
      locationList: [],
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
      listEmployeeByIds: [],
    },
    reloadTableData: false,
  },

  effects: {
    *fetchOnboardList({ payload = {} }, { call, put }) {
      let response = {};
      try {
        const tenantId = getCurrentTenant();
        const company = getCurrentCompany();
        const req = {
          tenantId,
          company,
          ...payload,
        };
        response = yield call(getOnboardingList, req);
        if (response) {
          const { statusCode, data = [] } = response;
          if (statusCode !== 200) throw response;
          // const data = formatData(response.data)
          yield put({
            type: 'saveOnboardingOverview',
            payload: {
              total: response.total,
              onboardingData: data,
            },
          });
        }
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *deleteTicketDraft({ payload = {} }, { call }) {
      let response;
      try {
        const { id = '', tenantId = '' } = payload;
        const req = {
          rookieID: id,
          tenantId,
        };
        response = yield call(deleteDraft, req);
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
      } catch (error) {
        dialog(error);
      }
      return response;
    },

    *reassignTicket({ payload }, { call }) {
      let response;
      try {
        const { id = '', tenantId = '', newAssignee = '' } = payload;

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
      } catch (error) {
        dialog(error);
      }
      return response;
    },

    *handleExpiryTicket({ payload }, { call }) {
      let response;
      try {
        const { id = '', tenantId = '', expiryDate = '', type = '' } = payload;
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
      } catch (error) {
        dialog(error);
      }
      return response;
    },
    *withdrawTicket({ payload = {} }, { call }) {
      let response = {};
      try {
        response = yield call(withdrawTicket, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
      } catch (errors) {
        dialog(errors);
      }
      return response;
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
    *fetchTotalNumberOfOnboardingListEffect({ payload }, { call, put }) {
      let response;
      try {
        const payloadTemp = {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        };
        response = yield call(getTotalNumberOnboardingList, payloadTemp);
        if (response) {
          const { statusCode, data: totalNumber = [] } = response;
          if (statusCode !== 200) throw response;
          // Update menu
          yield put({
            type: 'updateMenuQuantity',
            payload: { totalNumber },
          });
        }
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
      let response = {};
      try {
        response = yield call(getListEmployee, {
          ...payload,
          status: ['ACTIVE'],
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data: employeeList = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { employeeList } });
      } catch (errors) {
        dialog(errors);
      }
      return response;
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
    *fetchListEmployeeByIds({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getListEmployeeByIds, {
          ...payload,
        });
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'saveJoiningFormalities',
          payload: { listEmployeeByIds: data },
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
          newTotalNumber.referenceVerification +
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
