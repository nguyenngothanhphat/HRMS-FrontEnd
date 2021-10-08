import { history } from 'umi';
import { accountLogin, signInThirdParty, signinGoogle, getURLGoogle } from '@/services/login';
import {
  setAuthority,
  setTenantId,
  setCurrentCompany,
  removeLocalStorage,
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

        if (isFirstLogin) {
          history.replace('/first-change-password');
          return {};
        }

        // CANDIDATE
        const isCandidate = formatRole.indexOf('candidate') > -1;
        const isOnlyCandidate = isCandidate && formatRole.length === 1;

        if (isOnlyCandidate) {
          yield put({
            type: 'saveCandidateId',
            payload: response,
          });
          setAuthority([...formatArrRoles, ...formatRole]);
          history.replace('/candidate-portal');
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
            yield put({
              type: 'user/fetchCurrent',
              refreshCompanyList: false,
            });
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
    *loginThirdParty({ payload }, { call, put }) {
      try {
        const { accessToken = '', profileObj: { email = '' } = {} } = payload;
        const password = '*';
        const value = { accessToken, email, password };
        const response = yield call(signInThirdParty, value);
        const { statusCode, data = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'changeLoginStatus',
          payload: response,
        });
        setToken(response.data.token);

        // const arrayRoles = response.data.user.roles;
        // let formatArrRoles = [];
        // arrayRoles.forEach((e) => {
        //   formatArrRoles = [...formatArrRoles, e._id.toLowerCase(), ...e.permissions];
        // });
        // setAuthority(formatArrRoles);
        // if (formatArrRoles.indexOf('candidate') > -1) {
        //   history.replace('/candidate');
        //   return;
        // }
        // history.replace('/');
        let formatArrRoles = [];
        const { user: { signInRole = [], isFirstLogin = false } = {}, listCompany = [] } = data;
        const formatRole = signInRole.map((role) => role.toLowerCase());

        if (isFirstLogin) {
          history.replace('/first-change-password');
          return {};
        }

        // CANDIDATE
        if (formatRole.indexOf('candidate') > -1) {
          yield put({
            type: 'saveCandidateId',
            payload: response,
          });
          history.replace('/candidate');
        }
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
        if (isAdminOrOwner) {
          history.replace('/control-panel');
        } else if (listCompany.length === 1) {
          const { tenant: tenantId = '', _id: selectedCompany = '' } = listCompany[0];
          setTenantId(tenantId);
          setCurrentCompany(selectedCompany);
          yield put({
            type: 'user/fetchCurrent',
            refreshCompanyList: false,
          });
          history.push('/');
        } else {
          history.replace('/control-panel');
        }
      } catch (errors) {
        dialog(errors);
      }
      return {};
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
        const { user: { signInRole = [], isFirstLogin = false } = {}, listCompany = [] } = data;
        const formatRole = signInRole.map((role) => role.toLowerCase());

        if (isFirstLogin) {
          history.replace('/first-change-password');
          return {};
        }

        if (formatRole.indexOf('candidate') > -1) {
          yield put({
            type: 'saveCandidateId',
            payload: response,
          });
          history.replace('/candidate');
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
          yield put({
            type: 'user/fetchCurrent',
            refreshCompanyList: false,
          });
          history.push('/');
        } else {
          history.replace('/control-panel');
        }
      } catch (errors) {
        dialog(errors);
        history.push('/');
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
