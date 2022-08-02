import { notification, message } from 'antd';
import { getCurrentCompany, getCurrentLocation, getCurrentTenant } from '@/utils/authority';
import { dialog } from '@/utils/utils';
import {
  getResources,
  // getDepartmentList,
  getProjectList,
  assignToProject,
  updateComment,
  getListEmployee,
  fetchResourceAvailableStatus,
  fetchDivisions,
  updateProjectDetail,
  fetchResourceStatus,
  fetchTitleList,
  fetchProjectListTable,
  addAndUpdateComments,
  exportProject,
  // utilization
  getResourceUtilizationChart,
  getUtilizationOverviewDivision,
  getUtilizationOverviewTitle,
  getResourceUtilization,
  getNewJoineesList,
  exportResource,
  getListSkill,
  updateManagerResource,
} from '@/services/resourceManagement';

import { getSelectedDivisions, getSelectedLocations, handlingResourceAvailableStatus } from '@/utils/resourceManagement';

const initialState = {
  resourceList: [],
  totalList: [],
  totalAll: [],
  listEmployee: [],
  listDepartment: [],
  projectList: [],
  resourceStatuses: [],
  statusProject: [],
  projectTable: [],

  // for utilization
  resourceUtilizationChartData: [],
  utilizationOverviewList: [],
  resourceUtilizationList: {},
  newJoineeList: [],
  selectedDivisions: getSelectedDivisions() || [],
  selectedLocations: getSelectedLocations() || [getCurrentLocation()], // empty for all
  currentPayload: {},
  filter: {},
};
const resourceManagement = {
  namespace: 'resourceManagement',
  state: initialState,
  effects: {
    *getProjectList({ payload }, { call, put }) {
      try {
        const response = yield call(getProjectList, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
          // projectId: 'Terra-1'
          // department: getDepartmentList()
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { projectList: data },
        });
      } catch (error) {
        dialog(error);
      }
    },
    *getResources({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getResources, {
          ...payload,
          tenantId: getCurrentTenant(),
          // company: getCurrentCompany(),
          company: [getCurrentCompany()],
        });
        const { statusCode, data, total } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { resourceList: data, total, currentPayload: payload },
        });
      } catch (error) {
        dialog(error);
      }
      return response;
    },
    *assignResourceToProject({ payload }, { call }) {
      let response = {};
      try {
        response = yield call(assignToProject, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
      } catch (error) {
        dialog(error);
      }
      return response;
    },
    *updateProject({ payload }, { call }) {
      try {
        const response = yield call(updateProjectDetail, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message: response.message || 'Update project details Successfully',
        });
      } catch (error) {
        dialog(error);
      }
    },
    *updateComment({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(updateComment, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message: response.message || 'Add comment Successfully',
        });
        yield put({
          type: 'save',
          payload: { postAssignStatus: data },
        });
      } catch (error) {
        dialog(error);
      }
      return response;
    },
    *fetchResourceAvailableStatus({ payload }, { call, put }) {
      try {
        const response = yield call(fetchResourceAvailableStatus, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { resourceStatuses: handlingResourceAvailableStatus(data) },
        });
      } catch (error) {
        dialog(error);
      }
    },
    *getListEmployee({ payload }, { call, put }) {
      try {
        const response = yield call(getListEmployee, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { employeeList: data },
        });
      } catch (error) {
        dialog(error);
      }
    },
    *fetchDivisions({ payload }, { call, put }) {
      try {
        const response = yield call(fetchDivisions, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { divisions: data },
        });
      } catch (error) {
        dialog(error);
      }
    },
    *fetchResourceStatus({ payload }, { call, put }) {
      try {
        const response = yield call(fetchResourceStatus, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { statusList: data },
        });
      } catch (error) {
        dialog(error);
      }
    },
    *fetchTitleList({ payload }, { call, put }) {
      try {
        const response = yield call(fetchTitleList, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { titleList: data },
        });
      } catch (error) {
        dialog(error);
      }
    },
    *fetchProjectList({ payload }, { call, put }) {
      let response = {};
      const payloadTemp = {
        ...payload,
        tenantId: getCurrentTenant(),
        company: getCurrentCompany(),
      };
      try {
        response = yield call(fetchProjectListTable, payloadTemp);
        const { statusCode, data = {} } = response;
        if (statusCode !== 200) throw response;
        const { items = [], totals = [] } = data;
        yield put({
          type: 'save',
          payload: { projectTable: items, statusProject: totals, payloadProject: payloadTemp },
        });
        const customerList = items.map((item) => {
          return {
            customerId: item.customerId || '',
            customerName: item.customerName || '',
          };
        });

        yield put({
          type: 'save',
          payload: { customerList },
        });
      } catch (error) {
        dialog(error);
      }
      return response;
    },
    // UTILIZATION
    *fetchResourceUtilizationChart({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getResourceUtilizationChart, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { resourceUtilizationChartData: data },
        });
      } catch (error) {
        dialog(error);
      }
    },
    *fetchUtilizationOverviewDivisionList({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getUtilizationOverviewDivision, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { utilizationOverviewList: data },
        });
      } catch (error) {
        dialog(error);
      }
      return response;
    },

    *fetchUtilizationOverviewTitleList({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getUtilizationOverviewTitle, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { utilizationOverviewList: data },
        });
      } catch (error) {
        dialog(error);
      }
      return response;
    },
    *addAndUpdateCommentsProject({ payload }, { call }) {
      let response = {};
      try {
        response = yield call(addAndUpdateComments, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message: response.message || 'Add comments Successfully',
        });
        return response;
      } catch (error) {
        dialog(error);
        return null;
      }
    },
    *fetchResourceUtilizationList({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getResourceUtilization, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { resourceUtilizationList: data },
        });
      } catch (error) {
        dialog(error);
      }
    },
    *exportReportProject({ payload }, { call }) {
      let response = '';
      const hide = message.loading('Exporting data project...', 0);
      try {
        response = yield call(exportProject, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
      } catch (error) {
        dialog(error);
      }
      hide();
      return response;
    },
    *fetchNewJoineeList({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getNewJoineesList, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { newJoineeList: data },
        });
      } catch (error) {
        dialog(error);
      }
      return response;
    },
    *exportResourceManagement({ payload }, { call }) {
      let response = '';
      const hide = message.loading('Exporting data resource...', 0);
      try {
        response = yield call(exportResource, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: [getCurrentCompany()],
        });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
      } catch (error) {
        dialog(error);
      }
      hide();
      return response;
    },
    *fetchListSkill(_, { call, put }) {
      try {
        const response = yield call(getListSkill);
        const { statusCode, data: listSkill = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { listSkill } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *updateManagerResource({ payload }, { call }) {
      let response = '';
      try {
        response = yield call(updateManagerResource, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message: response.message,
        });
      } catch (error) {
        dialog(error);
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

export default resourceManagement;
