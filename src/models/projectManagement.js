import { notification } from 'antd';
import {
  getProjectList,
  generateProjectId,
  getCustomerList,
  getProjectTypeList,
  getProjectStatusList,
  getTagList,
  getDepartmentList,
  getEmployeeList,
  addProject,
} from '@/services/projectManagement';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import { dialog } from '@/utils/utils';

const tenantId = getCurrentTenant();
const company = getCurrentCompany();

const initialState = {
  projectList: [],
  newProjectId: '',
  customerList: [],
  projectTypeList: [],
  projectStatusList: [],
  tagList: [],
  departmentList: [],
  employeeList: [],
};

const ProjectManagement = {
  namespace: 'projectManagement',
  state: initialState,
  effects: {
    // fetch
    *fetchProjectListEffect({ payload }, { call, put }) {
      const response = {};
      try {
        const res = yield call(getProjectList, { ...payload, company, tenantId });
        const { statusCode, data = [] } = res;
        if (statusCode !== 200) throw res;

        yield put({
          type: 'save',
          payload: {
            projectList: data,
          },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },

    *generateProjectIdEffect({ payload }, { call, put }) {
      const response = {};
      try {
        const res = yield call(generateProjectId, { ...payload, company, tenantId });
        const { statusCode, data = '' } = res;
        if (statusCode !== 200) throw res;

        yield put({
          type: 'save',
          payload: {
            newProjectId: data,
          },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },

    *fetchCustomerListEffect({ payload }, { call, put }) {
      const response = {};
      try {
        const res = yield call(getCustomerList, { ...payload, company, tenantId });
        const { statusCode, data = [] } = res;
        if (statusCode !== 200) throw res;

        yield put({
          type: 'save',
          payload: {
            customerList: data,
          },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },

    *fetchProjectTypeListEffect({ payload }, { call, put }) {
      const response = {};
      try {
        const res = yield call(getProjectTypeList, { ...payload, company, tenantId });
        const { statusCode, data = [] } = res;
        if (statusCode !== 200) throw res;

        yield put({
          type: 'save',
          payload: {
            projectTypeList: data,
          },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },

    *fetchProjectStatusListEffect({ payload }, { call, put }) {
      const response = {};
      try {
        const res = yield call(getProjectStatusList, { ...payload, company, tenantId });
        const { statusCode, data = [] } = res;
        if (statusCode !== 200) throw res;

        yield put({
          type: 'save',
          payload: {
            projectStatusList: data,
          },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *fetchTagListEffect({ payload }, { call, put }) {
      const response = {};
      try {
        const res = yield call(getTagList, { ...payload, company, tenantId });
        const { statusCode, data = [] } = res;
        if (statusCode !== 200) throw res;

        yield put({
          type: 'save',
          payload: {
            tagList: data,
          },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },

    *fetchDepartmentListEffect({ payload }, { call, put }) {
      const response = {};
      try {
        const res = yield call(getDepartmentList, { ...payload, company, tenantId });
        const { statusCode, data = [] } = res;
        if (statusCode !== 200) throw res;

        yield put({
          type: 'save',
          payload: {
            departmentList: data,
          },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },

    *fetchEmployeeListEffect({ payload }, { call, put }) {
      const response = {};
      try {
        const res = yield call(getEmployeeList, { ...payload, company, tenantId });
        const { statusCode, data = [] } = res;
        if (statusCode !== 200) throw res;

        yield put({
          type: 'save',
          payload: {
            employeeList: data,
          },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },

    // add
    *addProjectEffect({ payload }, { call }) {
      const response = {};
      try {
        const res = yield call(addProject, { ...payload, company, tenantId });
        const { statusCode, message } = res;
        if (statusCode !== 200) throw res;
        notification.success({
          message,
        });
      } catch (errors) {
        dialog(errors);
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
    clearImportModalData(state) {
      return {
        ...state,
        importingIds: [],
      };
    },

    clearState() {
      return initialState;
    },
  },
};

export default ProjectManagement;
