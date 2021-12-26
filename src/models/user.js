import { history } from 'umi';
import { queryCurrent, query as queryUsers, fetchCompanyOfUser } from '@/services/user';
import {
  getCurrentCompany,
  setCurrentLocation,
  getCurrentLocation,
  getCurrentTenant,
  setAuthority,
  setIsSwitchingRole,
  setTenantId,
  setCurrentCompany,
  getIsSigninGoogle,
} from '@/utils/authority';

import { checkPermissions, getCurrentUserRoles } from '@/utils/permissions';

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
        if (statusCode !== 200) {
          history.replace('/login');
          throw response;
        }

        let formatArrRoles = [];
        let switchRoleAbility = false;
        const {
          signInRole = [],
          // roles = [],
          candidate = {},
          isFirstLogin = false,
          employee = {},
          employee: { title: { roles = [] } = {} || {} } = {} || {},
        } = data;
        const formatRole = signInRole.map((role) => role.toLowerCase());

        const candidateLinkMode = localStorage.getItem('candidate-link-mode') === 'true';
        const isSigninGoogle = getIsSigninGoogle();

        if (isFirstLogin && !candidateLinkMode && !isSigninGoogle) {
          history.replace('/first-change-password');
          return {};
        }

        const isCandidate = formatRole.indexOf('candidate') > -1;
        const isOnlyCandidate = isCandidate && formatRole.length === 1;

        if (isOnlyCandidate) {
          setAuthority(...formatRole);
          setTenantId(candidate.tenant);
          setCurrentCompany(candidate.company);
          setCurrentLocation(candidate.location);
          if (!window.location.href.includes('candidate')) {
            history.replace('/candidate-portal');
          }
          yield put({
            type: 'saveCurrentUser',
            payload: {
              ...data,
              name: data?.firstName,
              isSwitchingRole,
            },
          });
          return {};
        }

        // if there's no tenantId and companyId, return to control panel
        if ((!tenantId || !company) && !window.location.href.includes('add-company')) {
          formatArrRoles = [...formatRole];
          setAuthority(formatArrRoles);
          history.replace('/control-panel');
        } else {
          // role in company will be selected
          let checkIsOwner = false;
          let checkIsAdmin = false;
          let checkIsEmployee = false;

          // ROLES PROCESSING
          const isOwnerRole = formatRole.includes('owner');
          const isAdminRole = formatRole.includes('admin');
          const isEmployeeRole = formatRole.includes('employee');
          const { permissionAdmin = [], permissionEmployee = [] } = data;

          // IS OWNER
          if (isOwnerRole) {
            formatArrRoles = [
              'owner',
              // ...permissionAdmin, ...permissionEmployee
            ];
            checkIsOwner = true;
          }

          // IS BOTH ADMIN & EMPLOYEE
          if (isAdminRole && isEmployeeRole) {
            const perAdminExist = permissionAdmin.length > 0;
            const perEmployeeExist = permissionEmployee.length > 0;

            if (perAdminExist && !perEmployeeExist) {
              formatArrRoles = ['admin'];
              formatArrRoles = [...formatArrRoles, ...permissionAdmin];
              checkIsAdmin = true;
            }
            if (!perAdminExist && perEmployeeExist) {
              formatArrRoles = ['employee'];
              formatArrRoles = [...formatArrRoles, ...permissionEmployee];
              checkIsEmployee = true;
            }
            if (perAdminExist && perEmployeeExist) {
              switchRoleAbility = true;
              if (!isSwitchingRole) {
                formatArrRoles = ['admin'];
                formatArrRoles = [
                  ...formatArrRoles,
                  ...permissionAdmin,
                  // , ...permissionEmployee
                ];
                checkIsAdmin = true;
              } else {
                formatArrRoles = ['employee'];
                formatArrRoles = [...formatArrRoles, ...permissionEmployee];
                checkIsEmployee = true;
              }
            }
          } else {
            // IS ONLY ADMIN
            if (isAdminRole) {
              formatArrRoles = ['admin'];
              formatArrRoles = [...formatArrRoles, ...permissionAdmin];
              checkIsAdmin = true;
            }
            // IS ONLY EMPLOYEE
            if (isEmployeeRole) {
              formatArrRoles = ['employee'];
              formatArrRoles = [...formatArrRoles, ...permissionEmployee];
              checkIsEmployee = true;
            }
          }

          const employeeRoles = roles.map((role) => role.toLowerCase());
          const otherEmployeeRoles = employeeRoles.filter((role) => role !== 'employee');
          if (checkIsEmployee && otherEmployeeRoles.length > 0) {
            formatArrRoles = [...formatArrRoles, ...otherEmployeeRoles];
          }

          // DONE

          const { title: { name: titleName = '' } = {} || {} } = employee || {};
          const currentUserRoles = [...getCurrentUserRoles(formatArrRoles, titleName)];
          formatArrRoles = [...formatArrRoles, ...currentUserRoles].filter((x) => x);

          setAuthority(formatArrRoles);
          localStorage.setItem('switchRoleAbility', switchRoleAbility);

          // LOCATION PROCESSING
          // set work locations of admin
          if (checkIsAdmin) {
            // for admin, auto set location
            // setCurrentLocation(response?.data?.manageLocation[0]?._id);
            const currentLocation = getCurrentLocation();
            if (!currentLocation || currentLocation === 'undefined') {
              setCurrentLocation(response?.data?.manageLocation[0]?._id);
            }
          }

          // set work locations of employee
          if (checkIsEmployee) {
            setCurrentLocation(response?.data?.location?._id);
          }

          yield put({
            type: 'save',
            payload: {
              permissions: {
                ...checkPermissions(formatArrRoles, checkIsOwner, checkIsAdmin, checkIsEmployee),
              },
              currentUserRoles,
            },
          });
        }

        yield put({
          type: 'saveCurrentUser',
          payload: {
            ...data,
            name: data?.firstName,
            isSwitchingRole,
          },
        });

        // save dashboard widgets
        yield put({
          type: 'dashboard/save',
          payload: {
            employeeWidgets: data.widgetDashboardShow || [],
          },
        });

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

    clearDataInACompany(state) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          employee: {},
          permissionAdmin: [],
          permissionEmployee: [],
          location: null,
        },
        permissions: [],
      };
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
