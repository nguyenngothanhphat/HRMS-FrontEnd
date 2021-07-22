/* eslint-disable compat/compat */
import { dialog } from '@/utils/utils';
import { history } from 'umi';
import { notification } from 'antd';
import {
  signupAdmin,
  getUserInfo,
  getSecurityCode,
  activeAdmin,
  getIndustryListInSignUp,
  getCompanyTypeListInSignUp,
  sendAgainSecurityCode,
} from '../services/user';

const delay = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

const signup = {
  namespace: 'signup',
  state: {
    currentStep: 0,
    checkLegalSameHeadQuarter: false,
    codeNumber: '',
    company: {
      name: '',
      dba: '',
      ein: '',
      companyType: '',
      industry: '',
    },
    headQuarterAddress: {
      addressLine1: '',
      addressLine2: '',
      country: '',
      state: '',
      zipCode: '',
    },
    legalAddress: {
      addressLine1: '',
      addressLine2: '',
      country: '',
      state: '',
      zipCode: '',
    },
    locations: [],
    user: {
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
    },
    companyTypeList: [],
    industryList: [],
  },
  effects: {
    *fetchUserInfo({ payload }, { call, put }) {
      try {
        const response = yield call(getUserInfo, payload);
        const { statusCode, data: userInfo = [] } = response;
        if (statusCode === 400) return response;
        if (statusCode !== 200 && statusCode !== 400) {
          throw response;
        }
        yield put({ type: 'save', payload: { user: userInfo } });
        history.replace('/signup-verify');
      } catch (errors) {
        dialog(errors);
      }
      return {};
    },

    *fetchSecurityCode({ payload }, { call, put }) {
      try {
        const response = yield call(getSecurityCode, payload);
        const { statusCode, data = {} } = response;
        if (statusCode !== 200) throw response;
        if (!data?.result) {
          notification.error({
            message: 'Wrong code number',
          });
        } else {
          yield put({ type: 'save', payload: { codeNumber: data?.securityCode?.codeNumber } });
          yield put({
            type: 'clearStateLastSignUp',
          });
          history.replace('/signup-configlocation');
        }
      } catch (errors) {
        dialog(errors);
      }
    },

    *signupAdmin({ payload }, { call }) {
      try {
        yield call(delay, 2000);

        const response = yield call(signupAdmin, payload);
        const { statusCode } = response;
        // const payloadAutoLogin = {
        //   email: payload?.user?.email,
        //   password: payload?.user?.password,
        // };
        if (statusCode !== 200) throw response;
        notification.success({
          message: 'Sign up successfully. Please check email to active your account.',
        });
        setTimeout(() => {
          history.push('/login');
        }, 1000);
        // yield put({
        //   type: 'activeAdmin',
        //   payload: { id },
        //   payloadAutoLogin,
        // });
      } catch (errors) {
        dialog(errors);
      }
    },
    *activeAdmin({ payload, payloadAutoLogin = false }, { call, put }) {
      try {
        const response = yield call(activeAdmin, payload);
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        if (payloadAutoLogin) {
          yield put({
            type: 'login/login',
            payload: payloadAutoLogin,
          });
        }
        return response;
      } catch (errors) {
        dialog(errors);
        return {};
      }
    },
    *fetchCompanyTypeListInSignUp(_, { call, put }) {
      try {
        const response = yield call(getCompanyTypeListInSignUp);
        const { statusCode, data: companyTypeList = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { companyTypeList } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchIndustryListInSignUp(_, { call, put }) {
      try {
        const response = yield call(getIndustryListInSignUp);
        const { statusCode, data: industryList = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { industryList } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *sendAgainSecurityCode({ payload }, { call, put }) {
      try {
        const response = yield call(sendAgainSecurityCode, payload);
        const { statusCode, data = {} } = response;
        if (statusCode !== 200) throw response;
        if (!data?.result) {
          notification.error({
            message: 'Email delivery failed !',
          });
        } else {
          yield put({ type: 'save', payload: { codeNumber: data?.securityCode?.codeNumber } });
          notification.success({
            message: 'Email sent successfully !',
          });
        }
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
    clearStateLastSignUp(state) {
      return {
        ...state,
        currentStep: 0,
        checkLegalSameHeadQuarter: false,
        company: {
          name: '',
          dba: '',
          ein: '',
        },
        headQuarterAddress: {
          address: '',
          country: '',
          state: '',
          zipCode: '',
        },
        legalAddress: {
          address: '',
          country: '',
          state: '',
          zipCode: '',
        },
        locations: [],
      };
    },
    saveCompany(state, action) {
      const { company } = state;
      return {
        ...state,
        company: {
          ...company,
          ...action.payload,
        },
      };
    },
    saveHeadQuarterAddress(state, action) {
      const { headQuarterAddress } = state;
      return {
        ...state,
        headQuarterAddress: {
          ...headQuarterAddress,
          ...action.payload,
        },
      };
    },
    saveLegalAddress(state, action) {
      const { legalAddress } = state;
      return {
        ...state,
        legalAddress: {
          ...legalAddress,
          ...action.payload,
        },
      };
    },
    saveUser(state, action) {
      const { user } = state;
      return {
        ...state,
        user: {
          ...user,
          ...action.payload,
        },
      };
    },
  },
};
export default signup;
