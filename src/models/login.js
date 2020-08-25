import router from 'umi/router';
import AccountLogin, { GetCompanyCode, SignIn } from '@/services/login';
import { notification } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import { setAuthority } from '@/utils/authority';
import { getPageQuery, dialogLogin } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';
import { setToken } from '@/utils/token';
import { isArray } from 'util';

export default {
  namespace: 'login',

  state: {
    message: undefined,
    statusCode: 200,
    email: '',
    companyCode: [],
  },

  effects: {
    *login({ payload }, { call, put }) {
      try {
        const response = yield call(AccountLogin, payload);
        const { statusCode } = response;
        yield put({
          type: 'changeLoginStatus',
          payload: response,
        });
        if (statusCode !== 200) throw response;
        const {
          data: { token, expiresIn, user },
        } = response;
        let { roles = ['guest'] } = user;
        roles = roles.map(role => {
          if (typeof role === 'string') return role;
          return role._id;
        });
        setAuthority(roles);
        reloadAuthorized();
        setToken({
          token,
          expiresIn,
        });
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
            window.location.href = redirect;
            return;
          }
        }
        yield call(router.push, redirect || '/');
      } catch (errors) {
        dialogLogin(errors);
      }
    },

    *logout(_, { call, put }) {
      setAuthority('guest');
      reloadAuthorized();
      setToken(undefined);
      yield put({
        type: 'changeLoginStatus',
        payload: { companyCode: [] },
      });
      if (window.location.pathname.indexOf('/login') === -1)
        yield call(router.push, {
          pathname: '/login',
        });
    },

    *fetchCompanyCode({ payload }, { call, put }) {
      try {
        const { email } = payload;
        const response = yield call(GetCompanyCode, payload);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        if (isArray(data)) {
          if (data.length === 0) {
            notification.error({
              message: formatMessage({ id: 'signin.emailNotExitst' }),
              description: formatMessage({ id: 'signin.emailNotExitsDes' }),
            });
          } else {
            yield put({
              type: 'changeLoginStatus',
              payload: { companyCode: data, email },
            });
          }
        }
      } catch (errors) {
        dialogLogin(errors);
      }
    },

    *signin({ payload }, { call, put }) {
      try {
        const response = yield call(SignIn, payload);
        const { statusCode } = response;
        yield put({
          type: 'changeLoginStatus',
          payload: response,
        });
        if (statusCode !== 200) throw response;
        const {
          data: { token, expiresIn, user },
        } = response;
        let { roles = ['guest'] } = user;
        roles = roles.map(role => {
          if (typeof role === 'string') return role;
          return role._id;
        });
        setAuthority(roles);
        reloadAuthorized();
        setToken({
          token,
          expiresIn,
        });
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
            window.location.href = redirect;
            return;
          }
        }
        yield call(router.push, redirect || '/');
      } catch (errors) {
        dialogLogin(errors);
      }
    },
    *backstep1({ payload }, { put }) {
      yield put({
        type: 'changeLoginStatus',
        payload,
      });
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
