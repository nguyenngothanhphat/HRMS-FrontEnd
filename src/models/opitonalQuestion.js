// import { message, notification } from 'antd';
import { dialog } from '@/utils/utils';
import { getCurrentTenant, getCurrentCompany, getCurrentLocation } from '@/utils/authority';

import {
  getListPage,
  getQuestionByName,
  getQuestionById,
  getQuestionByPage,
  updateQuestionByHr,
  updateQuestionByCandidate,
  removeQuestion,
  addQuestion,
} from '@/services/optionalQuestion';

const optionalQuestion = {
  namespace: 'optionalQuestion',
  state: {
    candidate: '',
    optionalQuestionId: '',
    pageName: '',
    data: {
      // _id: '',
      // candidate: '',
      // name: '',
      // isDefault: false,
      // position: {
      //   move_to: 'IN-PAGE',
      //   page: '',
      // },
      // settings: [],
      // company: '',
      // location: '',
    },
    listPage: [],
  },

  effects: {
    *getListPage({ payload }, { call, put }) {
      try {
        const response = yield call(getListPage, { ...payload, tenantId: getCurrentTenant() });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { listPage: data.listPage },
        });
      } catch (error) {
        dialog(error);
      }
    },
    *getQuestionById({ payload }, { call, put }) {
      try {
        const response = yield call(getQuestionById, {
          ...payload,
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        if (data) {
          yield put({
            type: 'save',
            payload: { data },
          });
        } else
          yield put({
            type: 'resetDefault',
          });
      } catch (error) {
        dialog(error);
      }
    },
    *getQuestionByPage({ payload }, { call, put }) {
      try {
        const response = yield call(getQuestionByPage, {
          ...payload,
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        if (data) {
          yield put({
            type: 'save',
            payload: { data },
          });
        } else
          yield put({
            type: 'resetDefault',
          });
      } catch (error) {
        dialog(error);
      }
    },
    *getQuestionByName({ payload }, { call, put }) {
      try {
        const response = yield call(getQuestionByName, {
          ...payload,
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        if (data) {
          yield put({
            type: 'save',
            payload: { data },
          });
        } else
          yield put({
            type: 'resetDefault',
          });
      } catch (error) {
        dialog(error);
      }
    },
    *addQuestion({ payload }, { call, put }) {
      try {
        const response = yield call(addQuestion, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
          location: getCurrentLocation(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { data },
        });
        return response;
      } catch (error) {
        dialog(error);
        return error;
      }
    },
    *updateQuestionByHR({ payload }, { call, put }) {
      try {
        const response = yield call(updateQuestionByHr, {
          ...payload,
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { data },
        });
      } catch (error) {
        dialog(error);
      }
    },
    *updateQuestionByCandidate({ payload }, { call, put }) {
      try {
        const response = yield call(updateQuestionByCandidate, {
          ...payload,
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { data },
        });
      } catch (error) {
        dialog(error);
      }
    },
    *removeQuestion({ payload }, { call, put }) {
      try {
        const response = yield call(removeQuestion, {
          ...payload,
          tenantId: getCurrentTenant(),
        });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'resetDefault',
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
    resetDefault(state) {
      return {
        ...state,
        // candidate: '',
        optionalQuestionId: '',
        data: {
          // _id: '',
          // candidate: '',
          // name: '',
          // isDefault: false,
          // position: {
          //   move_to: 'IN-PAGE',
          //   page: '',
          // },
          // settings: [],
          // company: '',
          // location: '',
        },
        // listPage: [],
      };
    },
  },
};

export default optionalQuestion;
