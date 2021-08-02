import { dialog } from '@/utils/utils';
import { notification } from 'antd';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import {
  addInsurance,
  addBenefit,
  getInsuranceList,
  getListBenefitDefault,
  getListBenefit,
  deleteBenefit,
  addDocument,
} from '../services/onboardingSettings';

const onboardingSettings = {
  namespace: 'onboardingSettings',
  state: {
    listInsurances: {},
    uploadedInsurance: {},
    listBenefitDefault: [],
    listBenefit: [],
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

    *fetchListBenefitDefault({ payload: { country = '' } = {} }, { call, put }) {
      try {
        const payload = {
          country,
          tenantId: getCurrentTenant(),
        };
        const response = yield call(getListBenefitDefault, payload);
        const { statusCode, data: listBenefitDefault = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { listBenefitDefault } });
        return listBenefitDefault;
      } catch (errors) {
        dialog(errors);
        return {};
      }
    },

    *fetchListBenefit({ payload: { country = '' } = {} }, { call, put }) {
      try {
        const payload = {
          country,
          tenantId: getCurrentTenant(),
        };
        const response = yield call(getListBenefit, payload);
        const { statusCode, data: listBenefit = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { listBenefit } });
        return listBenefit;
      } catch (errors) {
        dialog(errors);
        return {};
      }
    },

    *addBenefit({ payload: data }, { call, put }) {
      try {
        const { country } = data;
        const payload = {
          ...data,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        };
        const response = yield call(addBenefit, payload);
        const { statusCode, message = '', data: dataBenefits = {} } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        yield put({ type: 'save', payload: { dataBenefits } });
        yield put({
          type: 'fetchListBenefit',
          payload: {
            country,
            tenantId: getCurrentTenant(),
          },
        });
        return response;
      } catch (errors) {
        dialog(errors);
        return {};
      }
    },

    *deleteBenefit({ payload: data }, { call, put }) {
      try {
        const payload = {
          ...data.payload,
          tenantId: getCurrentTenant(),
        };

        const response = yield call(deleteBenefit, payload);
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message: 'Delete benefit succesfully!',
        });
        yield put({
          type: 'fetchListBenefit',
          payload: {
            country: data.country,
            tenantId: getCurrentTenant(),
          },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *addDocument({ payload: data }, { call, put }) {
      try {
        const { country } = data;
        const payload = {
          ...data.payload,
          tenantId: getCurrentTenant(),
        };
        const response = yield call(addDocument, payload);
        const { statusCode, message = '' } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });

        yield put({
          type: 'fetchListBenefit',
          payload: {
            country,
            tenantId: getCurrentTenant(),
          },
        });
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
