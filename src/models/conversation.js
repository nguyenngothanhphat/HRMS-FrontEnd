import { dialog } from '@/utils/utils';
import {
  addNewConversation,
  getConversation,
  getUserConversations,
  addNewMessage,
  getConversationMessage,
} from '@/services/conversation';

const country = {
  namespace: 'conversation',
  state: {
    activeConversation: {},
    conversationList: [],
    activeConversationMessages: [],
  },
  effects: {
    //   CONVERSATION
    *addNewConversationEffect({ payload }, { call }) {
      let response = {};
      try {
        response = yield call(addNewConversation, payload);
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
        response = yield call(getUserConversations, payload);
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
        const response = yield call(getConversation, payload);
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
    *addNewMessageEffect({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(addNewMessage, payload);
        const { statusCode, data = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'saveNewMessage',
          payload: data,
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *getConversationMessageEffect({ payload }, { call, put }) {
      try {
        const response = yield call(getConversationMessage, payload);
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
  },
};
export default country;
