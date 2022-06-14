import { dialog } from '@/utils/utils';
import {
  addNewConversation,
  getConversation,
  getUserConversations,
  getNumberUnseenConversation,
  setStatusSeenConversation,
  addNewMessage,
  getConversationMessage,
  getListLastMessage,
  getLastMessage,
  getConversationUnSeen,
  seenMessage,
} from '@/services/conversation';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';

const defaultState = {
  activeConversation: {},
  conversationList: [],
  activeConversationMessages: [],
  unseenTotal: 0,
  listLastMessage: [],
  activeConversationUnseen: [],
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
    *getUserConversationsEffect({ payload = {} }, { call, put }) {
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
        // if (payload.userId) {
        //   yield put({
        //     type: 'conversation/getNumberUnseenConversationEffect',
        //     payload: {
        //       userId: payload.userId,
        //     },
        //   });
        // }
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *getConversationUnSeenEffect({ payload }, { call, put }) {
      try {
        const response = yield call(getConversationUnSeen, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data = {}, total = 0 } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: {
            activeConversationUnseen: data,
            unseenTotal: total,
          },
        });
      } catch (error) {
        dialog(error);
      }
    },

    *seenMessageEffect({ payload }, { call }) {
      try {
        const response = yield call(seenMessage, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
      } catch (error) {
        dialog(error);
      }
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
    *setSeenEffect({ payload }, { call }) {
      let response = {};
      try {
        response = yield call(setStatusSeenConversation, {
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
    *getNumberUnseenConversationEffect({ payload }, { put, call }) {
      let response = {};
      try {
        response = yield call(getNumberUnseenConversation, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: {
            unseenTotal: data,
          },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
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
    *getLastMessageEffect({ payload }, { call }) {
      try {
        const response = yield call(getLastMessage, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        // yield put({
        //   type: 'save',
        //   payload: {
        //     lastMessage: data,
        //   },
        // });
      } catch (errors) {
        dialog(errors);
      }
    },
    *getListLastMessageEffect({ payload }, { call, put }) {
      try {
        const response = yield call(getListLastMessage, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: {
            listLastMessage: data,
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
