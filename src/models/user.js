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

        let formatArrRoles = [];
        let switchRoleAbility = false;
        const { signInRole = [], roles = [], candidate = {}, isFirstLogin = false } = data;
        const formatRole = signInRole.map((role) => role.toLowerCase());

        if (isFirstLogin) {
          history.replace('/first-change-password');
          return {};
        }

        if (formatRole.indexOf('candidate') > -1) {
          setAuthority(...formatRole);
          setTenantId(candidate.tenant);
          setCurrentCompany(candidate.company);
          setCurrentLocation(candidate.location);
          history.replace('/candidate');
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
