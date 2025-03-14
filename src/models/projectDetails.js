import { notification } from 'antd';
import {
  // documents
  addDocument,
  removeDocument,
  getDocumentTypeList,
  getDocumentList,
  // milestone
  addMilestone,
  removeMilestone,
  getMilestoneList,
  updateMilestone,
  // resource type + resource
  addResourceType,
  addResource,
  editResourceType,
  deleteResourceType,
  assignResources,
  getResourceList,
  getResourceTypeList,
  getResourceOfProject,
  updateResourceOfProject,
  removeResourceOfProject,
  getBillingStatusList,
  // audit trail
  getAuditTrailList,
  // overview
  getProjectByID,
  updateProjectOverview,
  getProjectHistoryList,
  addProjectHistory,
  // other
  getProjectTagList,
  getTechnologyList,
  getSkillList,
  getTitleList,
  getDivisionList,
} from '@/services/projectDetails';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import { dialog } from '@/utils/utils';

const initialState = {
  projectId: '',
  projectDetail: {},
  projectHistoryList: [],
  milestoneList: [],
  resourceTypeList: [],
  resourceList: [],
  resourceListTotal: 0,
  documentList: [],
  auditTrailList: [],
  titleList: [],
  technologyList: [],
  skillList: [],
  divisionList: [],
  projectTagList: [],
  billingStatusList: [],
  documentTypeList: [],
  projectResourceList: [],
  projectResourceListTotal: 0,
  employeeList: [],
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
    *fetchProjectHistoryListEffect({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getProjectHistoryList, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data = {} } = response;
        if (statusCode !== 200) throw response;

        yield put({
          type: 'save',
          payload: {
            projectHistoryList: data,
          },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *addProjectHistoryEffect({ payload }, { call }) {
      let response = {};
      try {
        response = yield call(addProjectHistory, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
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
    *fetchBillingStatusListEffect({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getBillingStatusList, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;

        yield put({
          type: 'save',
          payload: {
            billingStatusList: data,
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
    *fetchResourceListEffect({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getResourceList, {
          ...payload,
          company: [getCurrentCompany()],
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data = [], total = 0 } = response;
        if (statusCode !== 200) throw response;

        yield put({
          type: 'save',
          payload: {
            resourceList: data,
            resourceListTotal: total,
          },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *fetchResourceOfProjectEffect({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getResourceOfProject, {
          ...payload,
          company: [getCurrentCompany()],
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data = [], total = 0 } = response;
        if (statusCode !== 200) throw response;

        yield put({
          type: 'save',
          payload: {
            projectResourceList: data,
            projectResourceListTotal: total,
          },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *updateResourceOfProjectEffect({ payload }, { call }) {
      let response = {};
      try {
        response = yield call(updateResourceOfProject, {
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
    *removeResourceOfProjectEffect({ payload }, { call }) {
      let response = {};
      try {
        response = yield call(removeResourceOfProject, {
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
    *addResourceEffect({ payload }, { call }) {
      let response = {};
      try {
        response = yield call(addResource, {
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
    *editResourceTypeEffect({ payload }, { call }) {
      let response = {};
      try {
        response = yield call(editResourceType, {
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
    *deleteResourceTypeEffect({ payload }, { call }) {
      let response = {};
      try {
        response = yield call(deleteResourceType, {
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
    *assignResourcesEffect({ payload }, { call }) {
      let response = {};
      try {
        response = yield call(assignResources, payload);
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
    *updateMilestoneEffect({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(updateMilestone, {
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
          type: 'updateMilestone',
          payload,
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *removeMilestoneEffect({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(removeMilestone, {
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
          type: 'fetchMilestoneListEffect',
          payload: {
            projectId: payload.projectId,
          },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *updateProjectOverviewEffect({ payload }, { call }) {
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
    updateMilestone(state, action) {
      const { milestoneList = {} } = state;
      let tempMilestoneList = JSON.parse(JSON.stringify(milestoneList));
      tempMilestoneList = tempMilestoneList.map((ml) => {
        if (ml.id === action.payload.milestoneId) {
          return {
            ...ml,
            ...action.payload,
          };
        }
        return ml;
      });
      return {
        ...state,
        milestoneList: [...tempMilestoneList],
      };
    },
  },
};

export default ProjectDetails;
