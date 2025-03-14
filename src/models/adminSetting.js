import { notification } from 'antd';
import {
  addDepartment,
  addGrade,
  addPosition,
  addRole,
  countEmployee,
  getCompanyById,
  getDepartmentByID,
  getDomains,
  getEmployeeList,
  getGradeByID,
  getListDepartments,
  getListGrade,
  getListPermissionOfRole,
  getListTitle,
  getPermissionList,
  getPositionByID,
  getRoleByID,
  getRoleList,
  getRolesByCompany,
  getSettingTicketById,
  getSettingTicketList,
  removeDepartment,
  removeDomains,
  removeGrade,
  removeRole,
  removeSettingTicket,
  removeTitle,
  setDomains,
  setEmailDomain,
  setupComplete,
  updateDepartment,
  updateGrade,
  updatePosition,
  updateRole,
  upsertSettingTicket,
} from '@/services/adminSetting';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import { dialog } from '@/utils/utils';

const adminSetting = {
  namespace: 'adminSetting',
  state: {
    listRoleByCompany: [],
    countEmployee: 0,
    idRoles: '',
    permissionList: [],
    originData: {
      totalTitle: 0,
      listTitles: [],
      listRoles: [],
      listPermissions: [],
      listDepartments: [],
      totalDepartmentList: 0,
      listGrades: [],
      listSupportTeam: [],
      emailDomain: '',
      listDomain: [],
    },
    tempData: {
      listTitles: [],
      totalTitle: 0,
      listRoles: [],
      listPermissions: [],
      listDepartments: [],
      totalDepartmentList: 0,
      listGrades: [],
      listSupportTeam: [
        {
          supportTeam: 'Human Resource',
          queryType: ['Policy Query', 'Leave Query', 'Paycheck Query'],
        },
        {
          supportTeam: 'IT',
          queryType: ['Policy Query', 'Leave Query'],
        },
      ],
    },
    viewingPosition: {},
    viewingDepartment: {},
    viewingRole: {},
    viewingQueryType: {},
    listEmployees: [],
    settingTicketList: [],
    viewingSettingTicket: null,
  },
  effects: {
    *fetchRoleList({ payload = {} }, { call, put }) {
      try {
        const response = yield call(getRoleList, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data: listRoles = [] } = response;
        if (statusCode !== 200) throw response;
        // localStorage.setItem('dataRoles', JSON.stringify(formatData));
        yield put({ type: 'saveOrigin', payload: { listRoles } });
        yield put({ type: 'saveTemp', payload: { listRoles } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchPermissionList({ payload = {} }, { call, put }) {
      try {
        const response = yield call(getPermissionList, payload);
        const { statusCode, data: permissionList = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { permissionList } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchListTitle({ payload = {} }, { call, put }) {
      const resp = [];
      try {
        const response = yield call(getListTitle, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data: listTitles = [], total: totalTitle } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'saveOrigin', payload: { listTitles, totalTitle } });
        yield put({ type: 'saveTemp', payload: { listTitles, totalTitle } });
      } catch (errors) {
        dialog(errors);
      }
      return resp;
    },
    *countEmployeeInPosition({ payload: { title } }, { call, put }) {
      try {
        const response = yield call(countEmployee, {
          title,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;

        yield put({ type: 'save', payload: { countEmployee: data } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *removePosition({ payload: { id = '' } }, { call }) {
      let response = {};
      try {
        response = yield call(removeTitle, {
          id,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
      } catch (errors) {
        dialog(errors);
        return 0;
      }
      return response;
    },

    *fetchDepartmentList({ payload = {} }, { call, put }) {
      try {
        const response = yield call(getListDepartments, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data: listDepartments = [], total: totalDepartmentList = 0 } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'saveOrigin', payload: { listDepartments, totalDepartmentList } });
        yield put({ type: 'saveTemp', payload: { listDepartments, totalDepartmentList } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchListPermissionOfRole({ payload: { idRoles = '' } }, { call, put }) {
      let response = {};
      try {
        response = yield call(getListPermissionOfRole, {
          idRoles,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data: listPermissions = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { idRoles } });
        yield put({ type: 'saveOrigin', payload: { listPermissions } });
        yield put({ type: 'saveTemp', payload: { listPermissions } });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *fetchRoleByID({ payload: { id: _id = '' } = {} }, { call, put }) {
      let response = {};
      try {
        response = yield call(getRoleByID, {
          _id,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { viewingRole: data } });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *updateRole({ payload = {} }, { call }) {
      let response = {};

      try {
        response = yield call(updateRole, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *addPosition({ payload = {} }, { call }) {
      let response = {};
      try {
        response = yield call(addPosition, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *fetchPositionByID({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getPositionByID, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { viewingPosition: data } });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },

    *updatePosition({ payload }, { call }) {
      let response = {};
      try {
        response = yield call(updatePosition, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },

    // DEPARTMENT
    *addDepartment({ payload }, { call }) {
      let response = {};
      try {
        response = yield call(addDepartment, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *removeDepartment({ payload: { id = '' } }, { call }) {
      let response = {};
      try {
        response = yield call(removeDepartment, {
          id,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *fetchDepartmentByID({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getDepartmentByID, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { viewingDepartment: data } });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },

    *updateDepartment({ payload }, { call }) {
      let response = {};
      try {
        response = yield call(updateDepartment, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },

    *getRolesByCompany({ payload: { company = '' } }, { call, put }) {
      try {
        const response = yield call(getRolesByCompany, { company, tenantId: getCurrentTenant() });
        const { statusCode, data: listRoleByCompany = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { listRoleByCompany } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *setupComplete(_, { call, put }) {
      try {
        const response = yield call(setupComplete);
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'user/fetchCurrent',
        });
      } catch (errors) {
        dialog(errors);
      }
    },

    // roles
    *addRole({ payload = {} }, { call, put }) {
      try {
        const response = yield call(addRole, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        yield put({
          type: 'fetchListRoles',
        });
        return response;
      } catch (errors) {
        dialog(errors);
        return {};
      }
    },
    *removeRole({ payload = {} }, { call, put }) {
      try {
        const response = yield call(removeRole, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        yield put({
          type: 'fetchListRoles',
        });
        return response;
      } catch (errors) {
        dialog(errors);
        return {};
      }
    },

    *fetchEmployeeList({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getEmployeeList, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { listEmployees: data } });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },

    // grade
    *fetchGradeList({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getListGrade, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { listGrades: data } });
        yield put({ type: 'saveTemp', payload: { listGrades: data } });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *addGrade({ payload }, { call }) {
      let response = {};
      try {
        response = yield call(addGrade, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({ message });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *updateGrade({ payload }, { call }) {
      let response = {};
      try {
        response = yield call(updateGrade, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({ message });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *removeGrade({ payload }, { call }) {
      let response = {};
      try {
        response = yield call(removeGrade, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({ message });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *fetchGradeByID({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getGradeByID, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { viewingGrade: data } });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },

    // domain
    *saveDomain({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(setEmailDomain, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'getDomain',
        });
        // yield put({ type: 'save', payload: { emailDomain: data} })
        notification.success({ message });
      } catch (error) {
        dialog(error);
      }
    },

    *getDomain(_, { call, put }) {
      let response = {};
      try {
        response = yield call(getCompanyById, {
          id: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'saveOrigin', payload: { emailDomain: data.emailDomain } });
      } catch (error) {
        dialog(error);
      }
    },

    // ticket management
    *fetchSettingTicketList({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getSettingTicketList, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { settingTicketList: data } });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *fetchSettingTicketByID({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getSettingTicketById, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { viewingSettingTicket: data } });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *upsertSettingTicket({ payload }, { call }) {
      let response = {};
      try {
        response = yield call(upsertSettingTicket, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({ message });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *removeSettingTicket({ payload }, { call }) {
      let response = {};
      try {
        response = yield call(removeSettingTicket, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({ message });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *fetchListDomain(_, { call, put }) {
      try {
        const response = yield call(getDomains, {
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'saveOrigin',
          payload: { listDomain: data },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *updateListDomain({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(
          setDomains,
          { company: getCurrentCompany(), tenantId: getCurrentTenant() },
          payload,
        );
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'fetchListDomain',
        });
        notification.success({ message });
      } catch (error) {
        const { statusCode } = error;
        if (statusCode !== 400) dialog(error);
      }
      return response;
    },
    *removeListDomain({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(removeDomains, { tenantId: getCurrentTenant() }, payload);
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'fetchListDomain',
        });
        notification.success({ message });
      } catch (error) {
        const { statusCode } = error;
        if (statusCode !== 400) dialog(error);
      }
      return response;
    },
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    saveOrigin(state, action) {
      const { originData } = state;
      return {
        ...state,
        originData: {
          ...originData,
          ...action.payload,
        },
      };
    },
    saveTemp(state, action) {
      const { tempData } = state;
      return {
        ...state,
        tempData: {
          ...tempData,
          ...action.payload,
        },
      };
    },
  },
};
export default adminSetting;
