/* eslint-disable compat/compat */
/* eslint-disable require-yield */
// import { stringify } from 'querystring';
import { history } from 'umi';
import { accountLogin, signInThirdParty } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { setToken } from '@/utils/token';
import { dialog } from '@/utils/utils';

const Model = {
  namespace: 'login',
  state: {
    status: undefined,
    candidate: '',
    messageError: '',
  },
  effects: {
    *login({ payload }, { call, put }) {
      try {
        const response = yield call(accountLogin, payload);
        yield put({
          type: 'changeLoginStatus',
          payload: response,
        });

        if (response.statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { messageError: '' } });
        setToken(response.data.token);
        const arrayRoles = response.data.user.roles;
        let formatArrRoles = [];
        arrayRoles.forEach((e) => {
          formatArrRoles = [...formatArrRoles, e._id.toLowerCase(), ...e.permissions];
        });
        setAuthority(formatArrRoles);
        if (formatArrRoles.indexOf('candidate') > -1) {
          history.replace('/candidate');
          yield put({
            type: 'saveCandidateId',
            payload: response,
          });
          return;
        }
        history.replace('/');
      } catch (errors) {
        const { data = [] } = errors;
        if (data.length > 0) {
          const [firstError] = data;
          const { defaultMessage: messageError = '' } = firstError;
          yield put({ type: 'save', payload: { messageError } });
        }
      }
    },

    *logout(_, { put }) {
      setToken('');
      setAuthority('');
      localStorage.removeItem('dataRoles');
      localStorage.removeItem('Rolesname');
      yield put({
        type: 'user/saveCurrentUser',
        payload: {
          currentUser: {},
        },
      });
      history.replace('/login');
    },
    *loginThirdParty({ payload }, { call, put }) {
      try {
        const { accessToken = '', profileObj: { email = '' } = {} } = payload;
        const password = '*';
        const value = { accessToken, email, password };
        const response = yield call(signInThirdParty, value);
        if (response.statusCode !== 200) throw response;
        yield put({
          type: 'changeLoginStatus',
          payload: response,
        });
        setToken(response.data.token);
        const arrayRoles = response.data.user.roles;
        let formatArrRoles = [];
        arrayRoles.forEach((e) => {
          formatArrRoles = [...formatArrRoles, e._id.toLowerCase(), ...e.permissions];
        });
        setAuthority(formatArrRoles);
        if (formatArrRoles.indexOf('candidate') > -1) {
          history.replace('/candidate');
          return;
        }
        history.replace('/');
      } catch (errors) {
        dialog(errors);
      }
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return { ...state, status: payload.status, type: payload.type };
    },
    saveCandidateId(state, { payload }) {
      return { ...state, candidate: payload.data.user.candidate };
    },
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
export default Model;
