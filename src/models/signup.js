import { dialog } from '@/utils/utils';
import { history } from 'umi';
// import { getListCountry, getListState } from '../services/country';
import { getUserInfo } from '../services/user';

const signup = {
  namespace: 'signup',
  state: {
    currentStep: 1,
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
    // *fetchListCountry(_, { call, put }) {
    //   try {
    //     const response = yield call(getListCountry);
    //     const { statusCode, data: listCountry = [] } = response;
    //     if (statusCode !== 200) throw response;
    //     yield put({ type: 'save', payload: { listCountry } });
    //   } catch (errors) {
    //     dialog(errors);
    //   }
    // },
    // *fetchListState({ payload }, { call, put }) {
    //   try {
    //     const response = yield call(getListState, payload);
    //     const { statusCode, data: listState = [] } = response;
    //     if (statusCode !== 200) throw response;
    //     yield put({ type: 'save', payload: { listState } });
    //   } catch (errors) {
    //     dialog(errors);
    //   }
    // },
    *fetchUserInfo({ payload }, { call, put }) {
      console.log('fetch user info');
      try {
        const response = yield call(getUserInfo, payload);
        const { statusCode, data: userInfo = [] } = response;
        console.log(response);
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { user: userInfo } });
        history.replace('/signup-verify');
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
