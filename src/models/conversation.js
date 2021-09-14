import { dialog } from '@/utils/utils';
import {
  addNewConversation,
  getConversation,
  getUserConversations,
  addNewMessage,
  getConversationMessage,
} from '@/services/conversation';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';

const defaultState = {
  activeConversation: {},
  conversationList: [],
  activeConversationMessages: [],
};

const country = {
  namespace: 'conversation',
  state: defaultState,
  effects: {
    //   CONVERSATION
    *addNewConversationEffect({ payload }, { call }) {
      let response = {};
      try {
        response = yield call(addNewConversation, {
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
    *getUserConversationsEffect({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getUserConversations, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: {
            conversationList: data,
          },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *getConversationEffect({ payload }, { call, put }) {
      try {
        const response = yield call(getConversation, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: {
            activeConversation: data,
          },
        });
      } catch (errors) {
        dialog(errors);
      }
    },

    // MESSAGE
    *addNewMessageEffect({ payload, preventSaveToRedux = false }, { call, put }) {
      let response = {};
      try {
        response = yield call(addNewMessage, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data = {} } = response;
        if (statusCode !== 200) throw response;
        if (!preventSaveToRedux) {
          yield put({
            type: 'saveNewMessage',
            payload: data,
          });
        }
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *getConversationMessageEffect({ payload }, { call, put }) {
      try {
        const response = yield call(getConversationMessage, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: {
            activeConversationMessages: data,
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
    saveNewMessage(state, action) {
      const { activeConversationMessages } = state;
      return {
        ...state,
        activeConversationMessages: [...activeConversationMessages, action.payload],
      };
    },
    clearState(state) {
      return {
        ...state,
        activeConversation: {},
        activeConversationMessages: [],
      };
    },
  },
};
export default country;
