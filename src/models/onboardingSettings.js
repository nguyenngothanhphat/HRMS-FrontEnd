import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import { dialog } from '@/utils/utils';
import { notification } from 'antd';
import {
  addInsurance,
  addOptionalOnboardQuestions,
  getInsuranceList,
  getListOptionalOnboardQuestions,
  removeOptionalOnboardQuestions,
  updateOptionalOnboardQuestions,
} from '../services/onboardingSettings';

const onboardingSettings = {
  namespace: 'onboardingSettings',
  state: {
    listInsurances: {},
    uploadedInsurance: {},
    optionalQuestions: [],
    optionalOnboardQuestionList: [],
  },
  effects: {
    *fetchListOptionalOnboardQuestions({ payload = {} }, { call, put }) {
      try {
        const response = yield call(getListOptionalOnboardQuestions, payload);
        const { statusCode, data: optionalOnboardQuestionList = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { optionalOnboardQuestionList },
        });
        return optionalOnboardQuestionList;
      } catch (errors) {
        // dialog(errors);
        return {};
      }
    },

    *updateOptionalOnboardQuestions({ payload = {} }, { call, put }) {
      try {
        const response = yield call(updateOptionalOnboardQuestions, {
          tenantId: getCurrentTenant(),
          id: payload._id,
          ...payload,
        });
        const { statusCode, data: optionalOnboardQuestion = {} } = response;

        if (statusCode !== 200) throw response;
        notification.success({
          message: `Update the question successfully!`,
          duration: 3,
        });
        yield put({
          type: 'updateQuestion',
          payload: optionalOnboardQuestion,
        });
        return response;
      } catch (errors) {
        // dialog(errors);
        return {};
      }
    },

    *addOptionalOnboardQuestions({ payload = {} }, { call, put }) {
      try {
        const response = yield call(addOptionalOnboardQuestions, {
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
          ...payload,
        });
        const { statusCode, data: optionalOnboardQuestion = {} } = response;

        if (statusCode !== 200) throw response;
        notification.success({
          message: `Add the question successfully!`,
          duration: 3,
        });
        yield put({
          type: 'saveQuestion',
          payload: optionalOnboardQuestion,
        });
        return response;
      } catch (errors) {
        // dialog(errors);
        return {};
      }
    },

    *removeOptionalOnboardQuestions({ payload = {} }, { call, put }) {
      try {
        const response = yield call(removeOptionalOnboardQuestions, {
          tenantId: getCurrentTenant(),
          id: payload._id,
          ...payload,
        });
        const { statusCode, data: optionalOnboardQuestion = {} } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message: `Remove the question successfully!`,
          duration: 3,
        });
        yield put({
          type: 'removeQuestion',
          payload: optionalOnboardQuestion,
        });
        return response;
      } catch (errors) {
        // dialog(errors);
        return {};
      }
    },

    *fetchListInsurances({ payload = {} }, { call, put }) {
      try {
        const response = yield call(getInsuranceList, payload);
        const { statusCode, data: listInsurances = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { listInsurances } });
        return listInsurances;
      } catch (errors) {
        // dialog(errors);
        return {};
      }
    },

    *addInsurance({ data }, { call, put }) {
      try {
        const {
          selfInsured = false, // false,
          carrierName = '', // Adenhall,
          carrierAddress = '', // "Ho Chi Minh",
          phone = '', // "12345678900",
          policyNumber = '', // "123-6546-789"
          tenantId,
        } = data;
        // console.log('data add passport', data);
        const response = yield call(addInsurance, {
          selfInsured,
          carrierName,
          carrierAddress,
          phone,
          policyNumber,
          tenantId,
        });
        const { statusCode, message = '', data: uploadedInsurance = {} } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        yield put({ type: 'save', payload: { uploadedInsurance } });
        return response;
      } catch (errors) {
        dialog(errors);
        return {};
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

    saveQuestion(state, action) {
      return {
        ...state,
        optionalOnboardQuestionList: [action.payload, ...state.optionalOnboardQuestionList],
      };
    },

    removeQuestion(state, action) {
      const { optionalOnboardQuestionList } = state;
      const indexOfQuestion = optionalOnboardQuestionList.findIndex(
        (item) => item._id === action.payload._id,
      );

      if (indexOfQuestion > -1) {
        return {
          ...state,
          optionalOnboardQuestionList: [
            ...optionalOnboardQuestionList.slice(0, indexOfQuestion),
            ...optionalOnboardQuestionList.slice(indexOfQuestion + 1),
          ],
        };
      }
      return state;
    },

    updateQuestion(state, action) {
      const { optionalOnboardQuestionList } = state;
      const indexOfQuestion = optionalOnboardQuestionList.findIndex(
        (item) => item._id === action.payload._id,
      );

      if (indexOfQuestion > -1) {
        return {
          ...state,
          optionalOnboardQuestionList: [
            ...optionalOnboardQuestionList.slice(0, indexOfQuestion),
            action.payload,
            ...optionalOnboardQuestionList.slice(indexOfQuestion + 1),
          ],
        };
      }
      return state;
    },
  },
};
export default onboardingSettings;
