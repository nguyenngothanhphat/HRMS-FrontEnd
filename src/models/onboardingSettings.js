import { dialog } from '@/utils/utils';
import { notification } from 'antd';
import { addInsurance, getInsuranceList } from '../services/onboardingSettings';

const onboardingSettings = {
  namespace: 'onboardingSettings',
  state: {
    listInsurances: {},
    uploadedInsurance: {},
    // optionalQuestions: [],
  },
  effects: {
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
  },
};
export default onboardingSettings;
