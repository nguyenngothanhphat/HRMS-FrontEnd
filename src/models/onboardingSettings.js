import { dialog } from '@/utils/utils';
import { notification } from 'antd';
import {
  getInsuranceList,
  addInsurance,
  getTemplateQuestionOnboardingTenantList,
  updateTemplateQuestionOnboardingTenant,
} from '../services/onboardingSettings';

const onboardingSettings = {
  namespace: 'onboardingSettings',
  state: {
    listInsurances: {},
    uploadedInsurance: {},
    optionalQuestions: [],
    templateOnboardQuestionDefault: {
      id: null,
      settings: [],
    },
  },
  effects: {
    *fetchListOptionalOnboardQuestions({ payload = {} }, { call, put }) {
      try {
        const response = yield call(getTemplateQuestionOnboardingTenantList, payload);
        const { statusCode, data: listTemplateQuestionDefault = [] } = response;
        if (statusCode !== 200) throw response;
        const { _id, settings } = listTemplateQuestionDefault[0];
        yield put({
          type: 'save',
          payload: {
            templateOnboardQuestionDefault: {
              id: _id,
              settings,
            },
          },
        });
        return listTemplateQuestionDefault;
      } catch (errors) {
        // dialog(errors);
        return {};
      }
    },

    *updateOptionalOnboardQuestions({ payload = {} }, { call, put }) {
      try {
        const response = yield call(updateTemplateQuestionOnboardingTenant, payload);
        const { statusCode, data: listTemplateQuestionDefault = [] } = response;
        if (statusCode !== 200) throw response;
        const { _id, settings } = listTemplateQuestionDefault;
        yield put({
          type: 'save',
          payload: {
            templateOnboardQuestionDefault: {
              id: _id,
              settings,
            },
          },
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
    // saveQuestion(state, action) {
    //   return {
    //     ...state,
    //     templateOnboardQuestionDefault: {
    //       ...state.templateOnboardQuestionDefault,
    //       ...action.payload,
    //     },
    //   };
    // },
  },
};
export default onboardingSettings;
