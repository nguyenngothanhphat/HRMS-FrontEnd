import { history } from 'umi';
import { accountLogin, signInThirdParty } from '@/services/login';
import { setAuthority, setTenantId, setCurrentCompany } from '@/utils/authority';
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
        const { statusCode, data = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { messageError: '' } });
        setToken(response.data.token);

        // if (formatArrRoles.indexOf('candidate') > -1) {
        //   history.replace('/candidate');
        //   yield put({
        //     type: 'saveCandidateId',
        //     payload: response,
        //   });
        //   return;
        // }

        let formatArrRoles = [];
        const { user: { signInRole = [] } = {}, listCompany = [] } = data;
        const formatRole = signInRole.map((role) => role.toLowerCase());

        let isAdminOrOwner = false;
        if (formatRole.includes('owner')) {
          isAdminOrOwner = true;
        }
        if (formatRole.includes('admin')) {
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
      localStorage.removeItem('currentCompanyId');
      localStorage.removeItem('tenantId');
      localStorage.removeItem('currentLocation');
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
