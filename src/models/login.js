/* eslint-disable compat/compat */
/* eslint-disable require-yield */
import { stringify } from 'querystring';
import { history } from 'umi';
import { accountLogin, signInThirdParty } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { setToken } from '@/utils/token';
import { getPageQuery, dialog } from '@/utils/utils';

const Model = {
  namespace: 'login',
  state: {
    status: undefined,
    candidate: '',
  },
  effects: {
    *login({ payload }, { call, put }) {
      try {
        const response = yield call(accountLogin, payload);
        yield put({
          type: 'changeLoginStatus',
          payload: response,
        });
        console.log('abcd', response);
        yield put({
          type: 'saveCandidateId',
          payload: response,
        });
        if (response.statusCode !== 200) throw response;
        console.log(response);
        setToken(response.data.token);
        const [itemRole] = response.data.user.roles;
        const { _id: role = '' } = itemRole;
        console.log(response.data.user.roles);
        setAuthority(role.toLowerCase());
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        console.log('p', params);
        let { redirect } = params;
        console.log('r', redirect);
        if (role === 'CANDIDATE') {
          history.replace('/candidate');
          return;
        }

        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }
        history.replace(redirect || '/');
      } catch (errors) {
        console.log(errors);
        dialog(errors);
      }
    },

    *logout(_, { put }) {
      const { redirect } = getPageQuery(); // Note: There may be security issues, please note
      setToken('');
      setAuthority('');
      yield put({
        type: 'user/saveCurrentUser',
        payload: {
          currentUser: {},
        },
      });
      if (window.location.pathname !== '/login' && !redirect) {
        history.replace({
          pathname: '/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
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
        const [itemRole] = response.data.user.roles;
        const { _id: role = '' } = itemRole;
        setAuthority(role.toLowerCase());
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }
        history.replace(redirect || '/');
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
  },
};
export default Model;
