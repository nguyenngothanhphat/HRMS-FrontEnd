import { notification } from 'antd';
import {
  addDocument,
  removeDocument,
  getDocumentTypeList,
  addMilestone,
  addResourceType,
  getTechnologyList,
  getTitleList,
  getDepartmentList,
  getAuditTrailList,
  getDocumentList,
  getMilestoneList,
  getProjectByID,
  getResourceTypeList,
  updateProjectOverview,
  getProjectTagList,
} from '@/services/projectDetails';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import { dialog } from '@/utils/utils';

const initialState = {
  projectId: '',
  projectDetail: {},
  milestoneList: [],
  resourceTypeList: [],
  documentList: [],
  auditTrailList: [],
  titleList: [],
  technologyList: [],
  departmentList: [],
  projectTagList: [],
};

const ProjectDetails = {
  namespace: 'projectDetails',
  state: initialState,
  effects: {
    *fetchProjectByIdEffect({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getProjectByID, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data = {} } = response;
        if (statusCode !== 200) throw response;

        yield put({
          type: 'save',
          payload: {
            projectDetail: data,
            projectId: data?.projectId,
          },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *fetchProjectTagListEffect({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getProjectTagList, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data = {} } = response;
        if (statusCode !== 200) throw response;

        yield put({
          type: 'save',
          payload: {
            projectTagList: data,
          },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },

    *fetchDocumentListEffect({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getDocumentList, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;

        yield put({
          type: 'save',
          payload: {
            documentList: data,
          },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *fetchMilestoneListEffect({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getMilestoneList, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;

        yield put({
          type: 'save',
          payload: {
            milestoneList: data,
          },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *fetchResourceTypeListEffect({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getResourceTypeList, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;

        yield put({
          type: 'save',
          payload: {
            resourceTypeList: data,
          },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *fetchTechnologyListEffect({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getTechnologyList, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;

        yield put({
          type: 'save',
          payload: {
            technologyList: data,
          },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *fetchTitleListEffect({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getTitleList, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;

        yield put({
          type: 'save',
          payload: {
            titleList: data,
          },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *fetchDepartmentListEffect({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getDepartmentList, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;

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
    *fetchAuditTrailListEffect({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getAuditTrailList, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;

        yield put({
          type: 'save',
          payload: {
            auditTrailList: data,
          },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },

    *fetchDocumentTypeListEffect({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getDocumentTypeList, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: {
            documentTypeList: data,
          },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },

    *addDocumentEffect({ payload }, { call }) {
      let response = {};
      try {
        response = yield call(addDocument, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
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
    *removeDocumentEffect({ payload }, { call }) {
      let response = {};
      try {
        response = yield call(removeDocument, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
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
    *addResourceTypeEffect({ payload }, { call }) {
      let response = {};
      try {
        response = yield call(addResourceType, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
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
    *addMilestoneEffect({ payload }, { call }) {
      let response = {};
      try {
        response = yield call(addMilestone, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
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
    *updateProjectOverviewEffect({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(updateProjectOverview, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        yield put({
          type: 'updateOverview',
          payload,
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
    updateOverview(state, action) {
      const { projectDetail = {} } = state;
      return {
        ...state,
        projectDetail: { ...projectDetail, ...action.payload },
      };
    },
    clearState() {
      return initialState;
    },
  },
};

export default ProjectDetails;
