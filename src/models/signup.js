import { dialog } from '@/utils/utils';
import { history } from 'umi';
import { notification } from 'antd';
import { signupAdmin, getUserInfo, getSecurityCode, activeAdmin } from '../services/user';

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
    user: {
      firstName: '',
      email: '',
    },
  },
  effects: {
    *fetchUserInfo({ payload }, { call, put }) {
      try {
        const response = yield call(getUserInfo, payload);
        const { statusCode, data: userInfo = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { user: userInfo } });
        history.replace('/signup-verify');
      } catch (errors) {
        dialog(errors);
      }
    },

    *fetchSecurityCode({ payload }, { call, put }) {
      try {
        const response = yield call(getSecurityCode, payload);
        const { statusCode, data: { securityCode: { codeNumber } = {} } = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { codeNumber } });
        history.replace('/signup-configlocation');
      } catch (errors) {
        dialog(errors);
      }
    },

    *signupAdmin({ payload }, { call, put }) {
      try {
        const response = yield call(signupAdmin, payload);
        const { statusCode, message, data: { id = '' } = {} } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        yield put({
          type: 'activeAdmin',
          payload: { id },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *activeAdmin({ payload }, { call }) {
      try {
        const response = yield call(activeAdmin, payload);
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        history.replace('/login');
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
