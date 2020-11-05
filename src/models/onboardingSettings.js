import { dialog } from '@/utils/utils';
import { notification } from 'antd';
import { getInsuranceList, addInsurance } from '../services/onboardingSettings';

const onboardingSettings = {
  namespace: 'onboardingSettings',
  state: {
    listInsurances: [],
    uploadedInsurance: [],
  },
  effects: {
    *fetchListInsurances(_, { call, put }) {
      try {
        const response = yield call(getInsuranceList);
        const { statusCode, data: listInsurances = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { listInsurances } });
      } catch (errors) {
        dialog(errors);
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
        } = data;
        // console.log('data add passport', data);
        const response = yield call(addInsurance, {
          selfInsured,
          carrierName,
          carrierAddress,
          phone,
          policyNumber,
        });
        const { statusCode, message = '', data: uploadedInsurance = [] } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        yield put({ type: 'save', payload: { uploadedInsurance } });
        return statusCode;
      } catch (errors) {
        dialog(errors);
        return '';
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
