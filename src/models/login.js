/* eslint-disable compat/compat */
/* eslint-disable require-yield */
import { stringify } from 'querystring';
import { history } from 'umi';
import { accountLogin } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { setToken } from '@/utils/token';
import { getPageQuery, dialog } from '@/utils/utils';

const Model = {
  namespace: 'login',
  state: {
    status: undefined,
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
        setToken(response.data.token);
        const [itemRole] = response.data.user.roles;
        const { _id: role = '' } = itemRole;
        let dummyRole = role;
        if (role === 'CUSTOMER') {
          dummyRole = 'admin';
        }

        setAuthority(dummyRole.toLowerCase());
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
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return { ...state, status: payload.status, type: payload.type };
    },
  },
};
export default Model;
