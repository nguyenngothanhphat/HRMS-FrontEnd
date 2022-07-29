import { notification } from 'antd';
import { dialog } from '@/utils/utils';
import {
  addComment,
  // setting page
  addPost,
  addQuickLink,
  flagPost,
  deletePost,
  deleteQuickLink,
  editComment,
  // portal
  // getCelebrationList,
  getPollResult,
  // social activities
  getPostComments,
  getPostReactionList,
  getPostsByType,
  getPostTypeList,
  getQuickLinkList,
  getSelectedPollOptionByEmployee,
  getTotalPostsOfType,
  getTotalQuickLink,
  reactPost,
  removeComment,
  updateBannerPosition,
  updatePost,
  updateQuickLink,
  upsertCelebrationConversation,
  votePoll,
  getListPolicy,
} from '../services/homePage';
import { getCurrentCompany, getCurrentTenant } from '../utils/authority';
import { TAB_IDS } from '@/utils/homePage';
// import { TAB_IDS } from '@/utils/homePage';

const getVarStateName = (type) => {
  switch (type) {
    case TAB_IDS.ANNIVERSARY:
      return 'celebrationList';

    case TAB_IDS.ANNOUNCEMENTS:
      return 'announcements';
    default:
      return '';
  }
};

const defaultState = {
  listPolicy: [],
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
  announcementTotal: 0,

  // social activities
  postComments: [],
  reactionList: [],
  reactionTotal: 0,
};

const homePage = {
  namespace: 'homePage',
  state: defaultState,
  effects: {
    // PORTAL
    *fetchCelebrationList({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getPostsByType, {
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
    *flagPostEffect({ payload }, { call }) {
      let response = {};
      try {
        response = yield call(flagPost, {
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
        const { statusCode, data = [], total = 0 } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { announcements: data, announcementTotal: total },
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
    *fetchPostByIdEffect({ payload, varName = TAB_IDS.ANNOUNCEMENTS }, { call, put }) {
      let response = {};
      try {
        response = yield call(getPostsByType, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'refreshPost',
          payload: { data, varName },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },

    *fetchAnniversaryByIdEffect({ payload, varName = TAB_IDS.ANNOUNCEMENTS }, { call, put }) {
      let response = {};
      try {
        response = yield call(getPostsByType, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'refreshPost',
          payload: { data, varName },
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
    *fetchAnniversaryCommentsEffect({ payload }, { call, put }) {
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

    *addCommentEffect({ payload, varName = TAB_IDS.ANNOUNCEMENTS }, { call, put }) {
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
            varName,
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
    *removeCommentEffect({ params, postId, varName = TAB_IDS.ANNOUNCEMENTS }, { call, put }) {
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
            varName,
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

    *reactAnniversaryEffect({ payload }, { call }) {
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

    *fetchPostReactionListEffect({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getPostReactionList, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data = [], total = 0 } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { reactionList: data, reactionTotal: total },
        });
      } catch (errors) {
        dialog(errors);
        return [];
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
    *fetchAllQuickLinkHomePageEffect({ payload }, { call, put }) {
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
          payload: { quickLinkListAllHomePage: data },
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
    *fetchListPolicy({ payload }, { call, put }) {
      let response;
      try {
        response = yield call(getListPolicy, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: {
            listPolicy: data,
          },
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
    refreshPost(state, action) {
      const { data = {}, varName = TAB_IDS.ANNOUNCEMENTS } = action.payload;
      const varStateName = getVarStateName(varName);

      const tempList = state[varStateName].map((item) => {
        if (item._id === data?._id) {
          return data;
        }
        return item;
      });
      return {
        ...state,
        [varStateName]: tempList,
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
                  return { ...x, content: comment.content };
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
      const { postId = '', length = 0, varName = TAB_IDS.ANNOUNCEMENTS } = action.payload;
      const varStateName = getVarStateName(varName);

      const newAnnouncements = state[varStateName].map((item) => {
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
        [varStateName]: newAnnouncements,
      };
    },

    clearState() {
      return defaultState;
    },
  },
};
export default homePage;
