import { history } from 'umi';
import { accountLogin, signinGoogle, getURLGoogle, getURLLollypop } from '@/services/login';
import {
  setAuthority,
  setTenantId,
  setCurrentCompany,
  removeLocalStorage,
  setIsSigninGoogle,
  setFirstChangePassword,
} from '@/utils/authority';
import { setToken } from '@/utils/token';
import { dialog } from '@/utils/utils';

const Model = {
  namespace: 'login',
  state: {
    status: undefined,
    candidate: '',
    messageError: '',
    urlGoogle: '',
    urlLollypop: '',
  },
  effects: {
    *login({ payload }, { call, put }) {
      try {
        const response = yield call(accountLogin, payload);
        yield put({
          type: 'changeLoginStatus',
          payload: response,
        });
        const { statusCode, data = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { messageError: '' } });
        setToken(response.data.token);

        let formatArrRoles = [];
        const { user: { signInRole = [], isFirstLogin = false } = {}, listCompany = [] } = data;
        const formatRole = signInRole.map((role) => role.toLowerCase());

        // CANDIDATE
        const isCandidate = formatRole.indexOf('candidate') > -1;
        const isOnlyCandidate = isCandidate && formatRole.length === 1;

        if (isFirstLogin && !isOnlyCandidate) {
          history.replace('/first-change-password');
        }

        if (isOnlyCandidate) {
          yield put({
            type: 'saveCandidateId',
            payload: response,
          });
          setAuthority([...formatArrRoles, ...formatRole]);
          if (isFirstLogin) {
            setFirstChangePassword(true);
            history.replace('/candidate-change-password');
          } else {
            history.replace('/candidate-portal');
          }
        } else {
          // ELSE
          let isAdminOrOwner = false;
          if (formatRole.includes('owner')) {
            isAdminOrOwner = true;
          }
          // if (formatRole.includes('admin')) {
          //   isAdminOrOwner = true;
          // }
          formatArrRoles = [...formatArrRoles, ...formatRole];
          setAuthority(formatArrRoles);

          // redirect
          if (isAdminOrOwner || isCandidate) {
            history.replace('/control-panel');
          } else if (listCompany.length === 1) {
            const { tenant: tenantId = '', _id: selectedCompany = '' } = listCompany[0];
            setTenantId(tenantId);
            setCurrentCompany(selectedCompany);
            history.push('/');
          } else {
            history.replace('/control-panel');
          }
        }
      } catch (errors) {
        const { data = [] } = errors;
        if (data.length > 0) {
          const [firstError] = data;
          const { defaultMessage: messageError = '' } = firstError;
          yield put({ type: 'save', payload: { messageError } });
        }
      }
      return {};
    },

    *logout(_, { put }) {
      setToken('');
      setAuthority('');
      removeLocalStorage();
      yield put({
        type: 'user/saveCurrentUser',
        payload: {
          currentUser: {},
        },
      });
      yield put({
        type: 'user/save',
        payload: {
          permissions: {},
        },
      });
      history.replace('/login');
    },
    *logoutCandidate(_, { put }) {
      setToken('');
      setAuthority('');
      removeLocalStorage();
      yield put({
        type: 'user/saveCurrentUser',
        payload: {
          currentUser: {},
        },
      });
      yield put({
        type: 'user/save',
        payload: {
          permissions: {},
        },
      });
      history.replace('/candidate');
    },
    *loginGoogle({ payload }, { call, put }) {
      try {
        const response = yield call(signinGoogle, { ...payload, email: '*', password: '*' });
        const { statusCode, data = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'changeLoginStatus',
          payload: response,
        });
        setToken(response.data.token);

        let formatArrRoles = [];
        const {
          user: { signInRole = [], isFirstLogin = false, isLoginGoogle = false } = {},
          listCompany = [],
        } = data;
        const formatRole = signInRole.map((role) => role.toLowerCase());

        // save if google signin
        setIsSigninGoogle(isLoginGoogle);

        if (isFirstLogin && !isLoginGoogle) {
          history.replace('/first-change-password');
          return {};
        }

        let isAdminOrOwner = false;
        if (formatRole.includes('owner')) {
          isAdminOrOwner = true;
        }

        formatArrRoles = [...formatArrRoles, ...formatRole];
        setAuthority(formatArrRoles);

        // redirect
        if (isAdminOrOwner) {
          history.replace('/control-panel');
        } else if (listCompany.length === 1) {
          const { tenant: tenantId = '', _id: selectedCompany = '' } = listCompany[0];
          setTenantId(tenantId);
          setCurrentCompany(selectedCompany);
          history.push('/');
        } else {
          history.replace('/control-panel');
        }
      } catch (errors) {
        dialog(errors);
      }
      return {};
    },
    *getURLGoogle({ payload }, { call, put }) {
      try {
        const response = yield call(getURLGoogle, payload);
        const { statusCode, data = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { urlGoogle: data },
        });
      } catch (errors) {
        dialog(errors);
      }
      return {};
    },
    *getURLLollypop({ payload }, { call, put }) {
      try {
        const response = yield call(getURLLollypop, payload);
        const { statusCode, data = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { urlLollypop: data },
        });
      } catch (errors) {
        dialog(errors);
      }
      return {};
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return { ...state, status: payload.status, type: payload.type };
    },
    saveCandidateId(state, { payload }) {
      return { ...state, candidate: payload.data.user._id };
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
