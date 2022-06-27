import { notification } from 'antd';
import { dialog } from '@/utils/utils';
import {
  // portal
  getCelebrationList,
  upsertCelebrationConversation,
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
  updateBannerPosition,
  getQuickLinkList,
  getTotalQuickLink,
  addQuickLink,
  updateQuickLink,
  deleteQuickLink,

  // social activities
  getPostComments,
  addComment,
  editComment,
  removeComment,
  reactPost,
} from '../services/homePage';
import { getCurrentTenant, getCurrentCompany } from '../utils/authority';
// import { TAB_IDS } from '@/utils/homePage';

const defaultState = {
  // portal
  celebrationList: [],
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

  // social activities
  postComments: [],
};

const homePage = {
  namespace: 'homePage',
  state: defaultState,
  effects: {
    // PORTAL
    *fetchCelebrationList({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getCelebrationList, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: {
            celebrationList: data,
          },
        });
      } catch (errors) {
        dialog(errors);
        return [];
      }
      return response;
    },
    *upsertCelebrationConversationEffect({ payload }, { call }) {
      let response = {};
      try {
        response = yield call(upsertCelebrationConversation, {
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

    *updateBannerPositionEffect({ payload }, { call }) {
      let response = {};
      try {
        response = yield call(updateBannerPosition, {
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
    *fetchPostCommentsEffect({ payload }, { call, put }) {
      let response = {};
      try {
        const { post } = payload;

        response = yield call(getPostComments, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;

        yield put({
          type: 'saveCommentToPost',
          payload: {
            postId: post,
            comments: data,
          },
        });
      } catch (errors) {
        dialog(errors);
        return [];
      }
      return response;
    },

    *addCommentEffect({ payload }, { call, put }) {
      let response = {};
      try {
        const { post } = payload;
        response = yield call(addComment, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;

        yield put({
          type: 'updateCommentTotal',
          payload: {
            postId: post,
            length: 1,
          },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },

    *editCommentEffect({ payload, params, postId }, { call, put }) {
      let response = {};
      try {
        response = yield call(
          editComment,
          {
            ...payload,
            tenantId: getCurrentTenant(),
            company: getCurrentCompany(),
          },
          params,
        );
        const { statusCode, data = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'updateCommentInPost',
          payload: {
            postId,
            comment: data,
          },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *removeCommentEffect({ params, postId }, { call, put }) {
      let response = {};
      try {
        response = yield call(removeComment, {
          ...params,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        const { commentId } = params;
        yield put({
          type: 'removeCommentFromPost',
          payload: {
            postId,
            commentId,
          },
        });
        yield put({
          type: 'updateCommentTotal',
          payload: {
            postId,
            length: -1,
          },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },

    *reactPostEffect({ payload }, { call }) {
      let response = {};
      try {
        response = yield call(reactPost, {
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

    // QUICK LINKS
    *fetchQuickLinkHomePageEffect({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getQuickLinkList, {
          ...payload,
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { quickLinkListHomePage: data },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *fetchQuickLinkTimeOffEffect({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getQuickLinkList, {
          ...payload,
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { quickLinkListTimeOff: data },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *fetchTotalQuickLinkTypeEffect({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getTotalQuickLink, {
          ...payload,
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { totalQuickLinkType: data },
        });
      } catch (error) {
        dialog(error);
      }
      return response;
    },
    *addQuickLinkEffect({ payload }, { call }) {
      let response = {};
      try {
        response = yield call(addQuickLink, {
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
    *updateQuickLinkEffect({ payload }, { call }) {
      let response = {};
      try {
        response = yield call(updateQuickLink, {
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
    *deleteQuickLinkEffect({ payload }, { call }) {
      let response = {};
      try {
        response = yield call(deleteQuickLink, {
          ...payload,
          tenantId: getCurrentTenant(),
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
    saveCommentToPost(state, action) {
      let newPostComments = [...state.postComments];
      const { postId, comments = [] } = action.payload;

      const find = newPostComments.find((item) => item._id === postId);
      if (find) {
        newPostComments = newPostComments.map((item) => {
          if (item._id === postId) {
            return {
              ...item,
              data: comments,
            };
          }
          return item;
        });
      } else {
        newPostComments = [
          {
            _id: postId,
            data: comments,
          },
          ...newPostComments,
        ];
      }

      return {
        ...state,
        postComments: newPostComments,
      };
    },
    updateCommentInPost(state, action) {
      let newPostComments = [...state.postComments];
      const { postId, comment = {} } = action.payload;

      const find = newPostComments.find((item) => item._id === postId);
      if (find) {
        newPostComments = newPostComments.map((item) => {
          if (item._id === postId) {
            return {
              ...item,
              data: item.data.map((x) => {
                if (x._id === comment._id) {
                  return comment;
                }
                return x;
              }),
            };
          }
          return item;
        });
      }

      return {
        ...state,
        postComments: newPostComments,
      };
    },
    removeCommentFromPost(state, action) {
      const { postId = '', commentId = '' } = action.payload;

      const newPostComments = state.postComments.map((x) => {
        if (x._id === postId) {
          return {
            ...x,
            data: x.data.filter((y) => y._id !== commentId),
          };
        }
        return x;
      });

      return {
        ...state,
        postComments: newPostComments,
      };
    },
    updateCommentTotal(state, action) {
      const { postId = '', length = 0 } = action.payload;

      const newAnnouncements = state.announcements.map((item) => {
        if (item._id === postId) {
          return {
            ...item,
            totalComment: item.totalComment + length,
          };
        }
        return item;
      });

      return {
        ...state,
        announcements: newAnnouncements,
      };
    },
    clearState() {
      return defaultState;
    },
  },
};
export default homePage;
