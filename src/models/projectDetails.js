import { notification } from 'antd';
import {
  addDocument,
  addMilestone,
  addResourceType,
  getAuditTrailList,
  getDocumentList,
  getMilestoneList,
  getProjectByID,
  getResourceTypeList,
  updateProjectOverview,
} from '@/services/projectDetails';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import { dialog } from '@/utils/utils';

const tenantId = getCurrentTenant();
const company = getCurrentCompany();

const initialState = {
  projectDetail: {},
  milestoneList: [],
  resourceTypeList: [],
  documentList: [],
  auditTrailList: [],
};

const ProjectDetails = {
  namespace: 'projectDetails',
  state: initialState,
  effects: {
    *fetchProjectByIdEffect({ payload }, { call, put }) {
      const response = {};
      try {
        const res = yield call(getProjectByID, { ...payload, company, tenantId });
        const { statusCode, data = {} } = res;
        if (statusCode !== 200) throw res;

        yield put({
          type: 'save',
          payload: {
            projectDetail: data,
          },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *fetchDocumentListEffect({ payload }, { call, put }) {
      const response = {};
      try {
        const res = yield call(getDocumentList, { ...payload, company, tenantId });
        const { statusCode, data = [] } = res;
        if (statusCode !== 200) throw res;

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
      const response = {};
      try {
        const res = yield call(getMilestoneList, { ...payload, company, tenantId });
        const { statusCode, data = [] } = res;
        if (statusCode !== 200) throw res;

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
    *fetchResourceTypeList({ payload }, { call, put }) {
      const response = {};
      try {
        const res = yield call(getResourceTypeList, { ...payload, company, tenantId });
        const { statusCode, data = [] } = res;
        if (statusCode !== 200) throw res;

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
    *fetchAuditTrailList({ payload }, { call, put }) {
      const response = {};
      try {
        const res = yield call(getAuditTrailList, { ...payload, company, tenantId });
        const { statusCode, data = [] } = res;
        if (statusCode !== 200) throw res;

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

    *addDocumentEffect({ payload }, { call }) {
      const response = {};
      try {
        const res = yield call(addDocument, { ...payload, company, tenantId });
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
    *addResourceTypeEffect({ payload }, { call }) {
      const response = {};
      try {
        const res = yield call(addResourceType, { ...payload, company, tenantId });
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
    *addMilestoneEffect({ payload }, { call }) {
      const response = {};
      try {
        const res = yield call(addMilestone, { ...payload, company, tenantId });
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
    *updateProjectOverviewEffect({ payload }, { call }) {
      const response = {};
      try {
        const res = yield call(updateProjectOverview, { ...payload, company, tenantId });
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
    clearState() {
      return initialState;
    },
  },
};

export default ProjectDetails;
