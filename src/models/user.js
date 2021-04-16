import { queryCurrent, query as queryUsers, fetchCompanyOfUser } from '@/services/user';
import {
  getCurrentCompany,
  setCurrentLocation,
  getCurrentLocation,
  getCurrentTenant,
  isOwner,
  setAuthority,
  setIsSwitchingRole,
} from '@/utils/authority';

import { history } from 'umi';
import { checkPermissions } from '@/utils/permissions';

const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {},
    permissions: {},
    companiesOfUser: [],
  },
  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    *fetchCurrent({ refreshCompanyList = true, isSwitchingRole = false }, { call, put }) {
      try {
        const company = getCurrentCompany();
        const tenantId = getCurrentTenant();
        const payload = {
          company,
          tenantId,
        };
        const response = yield call(queryCurrent, payload);
        const { statusCode, data = {} } = response;
        if (statusCode !== 200) throw response;

        // if there's no tenantId and companyId, return to dashboard
        if (!tenantId || !company) {
          history.replace('/control-panel');
        }
        yield put({
          type: 'saveCurrentUser',
          payload: {
            ...data,
            name: data?.firstName,
            isSwitchingRole,
          },
        });

        const checkIsOwner = isOwner();
        if (!checkIsOwner) {
          // for admin, auto set location
          // setCurrentLocation(response?.data?.manageLocation[0]?._id);
          const currentLocation = getCurrentLocation();
          if (!currentLocation || currentLocation === 'undefined') {
            setCurrentLocation(response?.data?.manageLocation[0]?._id);
          }
        }

        if (!isSwitchingRole) {
          let formatArrRoles = [];
          const { signInRole = [] } = data;
          const formatRole = signInRole.map((role) => role.toLowerCase());

          if (formatRole.includes('owner')) {
            formatArrRoles = [...formatArrRoles, 'owner'];
          }
          if (formatRole.includes('admin')) {
            formatArrRoles = [...formatArrRoles, 'admin'];
          }
          data?.permissionAdmin.forEach((e) => {
            formatArrRoles = [...formatArrRoles, e];
          });
          data?.permissionEmployee.forEach((e) => {
            formatArrRoles = [...formatArrRoles, e];
          });

          setAuthority(formatArrRoles);
          yield put({
            type: 'save',
            payload: {
              permissions: {
                ...checkPermissions(formatArrRoles, checkIsOwner),
              },
            },
          });
        }

        return response;
      } catch (errors) {
        // error
        return {};
      } finally {
        if (refreshCompanyList) {
          yield put({
            type: 'fetchCompanyOfUser',
          });
        }
      }
    },

    *fetchCompanyOfUser(_, { call, put }) {
      try {
        const response = yield call(fetchCompanyOfUser);
        const { statusCode, data = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: {
            companiesOfUser: data?.listCompany,
          },
        });
      } catch (errors) {
        // error
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

    saveCurrentUser(state, action) {
      setIsSwitchingRole(action.payload.isSwitchingRole);
      return { ...state, currentUser: action.payload || {} };
    },

    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
export default UserModel;
