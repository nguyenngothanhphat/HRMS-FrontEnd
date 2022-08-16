import { notification, message } from 'antd';
import { uniq } from 'lodash';
import {
  getProjectList,
  // getProjectNameList,
  getStatusSummary,
  generateProjectId,
  getCustomerList,
  getProjectTypeList,
  getProjectStatusList,
  getTagList,
  getDivisionList,
  getEmployeeList,
  addProject,
  updateProject,
  deleteProject,
  getCustomerInfo,
  getSkillList,
  getListProjectToExport,
} from '@/services/projectManagement';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import { dialog } from '@/utils/utils';

const initialState = {
  currentUserRole: [],
  projectList: [],
  projectNameList: [],
  projectListPayload: {}, // for refresh data
  statusSummary: [],
  newProjectId: '',
  customerList: [],
  projectTypeList: [],
  projectStatusList: [],
  tagList: [],
  skillList: [],
  divisionList: [],
  employeeList: [],
  customerInfo: {},
};

const ProjectManagement = {
  namespace: 'projectManagement',
  state: initialState,
  effects: {
    // fetch
    *fetchProjectListEffect({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getProjectList, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;

        yield put({
          type: 'save',
          payload: {
            projectList: data,
            projectListPayload: payload,
          },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *fetchProjectNameListEffect({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getProjectList, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;

        yield put({
          type: 'save',
          payload: {
            projectNameList: uniq(data.map((x) => x.projectName)),
          },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },

    *refreshProjectList(_, { select, put }) {
      try {
        const { projectListPayload = {} } = yield select((state) => state.projectManagement);
        yield put({
          type: 'fetchProjectListEffect',
          payload: projectListPayload,
        });
        yield put({
          type: 'fetchStatusSummaryEffect',
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchStatusSummaryEffect({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getStatusSummary, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data = {} } = response;
        if (statusCode !== 200) throw response;

        yield put({
          type: 'save',
          payload: {
            statusSummary: data?.statuses || [],
          },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *generateProjectIdEffect({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(generateProjectId, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data = '' } = response;
        if (statusCode !== 200) throw response;

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
      let response = {};
      try {
        response = yield call(getCustomerList, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;

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
      let response = {};
      try {
        response = yield call(getProjectTypeList, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;

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
      let response = {};
      try {
        response = yield call(getProjectStatusList, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;

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
    *fetchSkillListEffect(_, { call, put }) {
      try {
        const response = yield call(getSkillList);
        const { statusCode, data: skillList = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { skillList } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchTagListEffect({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getTagList, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;

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

    *fetchDivisionListEffect({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getDivisionList, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;

        if (data.length > 0) {
          yield put({
            type: 'save',
            payload: {
              divisionList: data,
            },
          });
        }
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },

    *fetchEmployeeListEffect({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getEmployeeList, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;

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
      let response = {};
      try {
        response = yield call(addProject, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        // eslint-disable-next-line no-shadow
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
    *updateProjectEffect({ payload }, { call }) {
      let response = {};
      try {
        response = yield call(updateProject, {
          ...payload,
          // company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        // eslint-disable-next-line no-shadow
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
    *deleteProjectEffect({ payload }, { call }) {
      let response = {};
      try {
        response = yield call(deleteProject, {
          ...payload,
          tenantId: getCurrentTenant(),
        });
        // eslint-disable-next-line no-shadow
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
    *fetchCustomerInfo({ payload }, { call, put }) {
      try {
        const response = yield call(getCustomerInfo, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { customerInfo: data } });
      } catch (error) {
        dialog(error);
      }
    },
    *fetchProjectToExport({ payload }, { call }) {
      let response = {};
      const hide = message.loading('Exporting data projects...', 0);
      try {
        response = yield call(getListProjectToExport, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
      } catch (error) {
        dialog(error);
        return null;
      }
      hide();
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
