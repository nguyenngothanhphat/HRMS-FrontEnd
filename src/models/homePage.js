import { notification } from 'antd';
import { dialog } from '@/utils/utils';
import {
  // portal
  getBirthdayInWeek,
  // setting page
  addPost,
  deletePost,
  getPostsByType,
  getTotalPostsOfType,
  getPostTypeList,
  updatePost,
  votePoll,
  getSelectedPollOptionByEmployee,
  getPollResult,
} from '../services/homePage';
import { getCurrentTenant, getCurrentCompany } from '../utils/authority';
import { TAB_IDS } from '@/utils/homePage';

const defaultState = {
  // portal
  birthdayInWeekList: [],
  // setting page
  postTypeList: [],
  pollResult: [],
  announcements: [],
  banners: [],
  polls: [],
  anniversaries: [],
  images: [],
  totalPostsOfType: [],
  selectedPollOption: {},
};

const homePage = {
  namespace: 'homePage',
  state: defaultState,
  effects: {
    // PORTAL
    *fetchBirthdayInWeekList({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getBirthdayInWeek, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: {
            birthdayInWeekList: data,
          },
        });
      } catch (errors) {
        dialog(errors);
        return [];
      }
      return response;
    },

    // POST TYPE
    *fetchPostTypeListEffect({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getPostTypeList, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;

        yield put({
          type: 'save',
          payload: { postTypeList: data },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },

    // POST MANAGEMENT
    *addPostEffect({ payload }, { call }) {
      let response = {};
      try {
        response = yield call(addPost, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({ message });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },

    *updatePostEffect({ payload }, { call }) {
      let response = {};
      try {
        response = yield call(updatePost, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({ message });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *deletePostEffect({ payload }, { call }) {
      let response = {};
      try {
        response = yield call(deletePost, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({ message });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    // GET LIST POST BY TYPE
    *fetchAnnouncementsEffect({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getPostsByType, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { announcements: data },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *fetchAnniversariesEffect({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getPostsByType, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { anniversaries: data },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *fetchBannersEffect({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getPostsByType, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { banners: data },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *fetchImagesEffect({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getPostsByType, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { images: data },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *fetchPollsEffect({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getPostsByType, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { polls: data },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *fetchTotalPostsOfType({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getTotalPostsOfType, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { totalPostsOfType: data },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    // POLL
    *votePollEffect({ payload }, { call }) {
      let response = {};
      try {
        response = yield call(votePoll, {
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
    *fetchPollResultEffect({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getPollResult, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { pollResult: data },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *fetchSelectedPollOptionByEmployeeEffect({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getSelectedPollOptionByEmployee, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { selectedPollOption: data },
        });
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
    clearState() {
      return defaultState;
    },
  },
};
export default homePage;
