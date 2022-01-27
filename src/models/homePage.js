import { notification } from 'antd';
import { dialog } from '@/utils/utils';
import {
  addPost,
  deletePost,
  getPostsByType,
  getPostTypeList,
  updatePost,
  votePoll,
  getSelectedPollOptionByEmployee,
  getPollResult,
} from '../services/homePage';
import { getCurrentTenant, getCurrentCompany } from '../utils/authority';

const defaultState = {
  postTypeList: [],
  pollResult: {},
  selectedPollOption: {},
};

const homePage = {
  namespace: 'homePage',
  state: defaultState,
  effects: {
    // POST TYPE
    *fetchPostTypeListEffect({ payload }, { call, put }) {
      try {
        const response = yield call(getPostTypeList, {
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
        return response;
      } catch (errors) {
        dialog(errors);
      }
      return {};
    },

    // POST MANAGEMENT
    *addPostEffect({ payload }, { call }) {
      try {
        const response = yield call(addPost, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({ message });

        return response;
      } catch (errors) {
        dialog(errors);
      }
      return {};
    },

    *updatePostEffect({ payload }, { call }) {
      try {
        const response = yield call(updatePost, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({ message });

        return response;
      } catch (errors) {
        dialog(errors);
      }
      return {};
    },
    *deletePostEffect({ payload }, { call }) {
      try {
        const response = yield call(deletePost, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({ message });

        return response;
      } catch (errors) {
        dialog(errors);
      }
      return {};
    },
    // GET LIST POST BY TYPE
    *fetchPostListByTypeEffect({ payload }, { call, put }) {
      try {
        const response = yield call(getPostsByType, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;

        yield put({
          type: 'save',
          payload: { postsByType: data },
        });
        return response;
      } catch (errors) {
        dialog(errors);
      }
      return {};
    },

    // POLL
    *votePollEffect({ payload }, { call }) {
      try {
        const response = yield call(votePoll, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;

        return response;
      } catch (errors) {
        dialog(errors);
      }
      return {};
    },
    *fetchPollResultEffect({ payload }, { call, put }) {
      try {
        const response = yield call(getPollResult, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { pollResult: data },
        });
        return response;
      } catch (errors) {
        dialog(errors);
      }
      return {};
    },
    *fetchSelectedPollOptionByEmployeeEffect({ payload }, { call, put }) {
      try {
        const response = yield call(getSelectedPollOptionByEmployee, {
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
        return response;
      } catch (errors) {
        dialog(errors);
      }
      return {};
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
