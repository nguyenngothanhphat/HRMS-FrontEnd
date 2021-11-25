import { notification } from 'antd';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import { dialog } from '@/utils/utils';
import {
  getResources,
  // getDepartmentList,
  getProjectList,
  postAssignToProject,
  updateComment,
  getListEmployee,
  fetchResourceAvailableStatus,
  fetchDivisions,
  updateProjectDetail,
  fetchResourceStatus,
  fetchTitleList,
  // utilization
  getResourceUtilizationChart,
  getUtilizationOverviewDivision,
  getUtilizationOverviewTitle,
  getResourceUtilization,
  getNewJoineesList
} from '../services/resourceManagement';

import { handlingResourceAvailableStatus } from '@/utils/resourceManagement';

const resourceManagement = {
  namespace: 'resourceManagement',
  state: {
    resourceList: [],
    totalList: [],
    totalAll: [],
    listEmployee: [],
    listDepartment: [],
    projectList: [],
    resourceStatuses: [],
    resourceUtilizationChartData: [],
    utilizationOverviewList: [],
    resourceUtilizationList: {},
    newJoineeList: [],
  },
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
      try {
        const response = yield call(getResources, {
          ...payload,
          tenantId: getCurrentTenant(),
          // company: getCurrentCompany(),
          company: [getCurrentCompany()],
        });
        const { statusCode, data, total } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { resourceList: data, total },
        });
      } catch (error) {
        dialog(error);
      }
    },
    *fetchAssignToProject({ payload }, { call }) {
      try {
        const response = yield call(postAssignToProject, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
      } catch (error) {
        dialog(error);
      }
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
          message: 'Update project details Successfully',
        });
      } catch (error) {
        dialog(error);
      }
    },
    *updateComment({ payload }, { call, put }) {
      try {
        const response = yield call(updateComment, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message: 'Add assign to project Successfully',
        });
        yield put({
          type: 'save',
          payload: { postAssignStatus: data },
        });
      } catch (error) {
        dialog(error);
      }
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
        // notification.success({
        //   message: 'Add assign to project Successfully',
        // });
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
        // notification.success({
        //   message: 'Add assign to project Successfully',
        // });
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
        // notification.success({
        //   message: 'Add assign to project Successfully',
        // });
        const divisions = [];
        data.forEach((x) => {
          const { tagDivision } = x;
          divisions.push(...tagDivision);
        });
        yield put({
          type: 'save',
          payload: { divisions },
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
        // notification.success({
        //   message: 'Add assign to project Successfully',
        // });
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
        // notification.success({
        //   message: 'Add assign to project Successfully',
        // });
        yield put({
          type: 'save',
          payload: { titleList: data },
        });
      } catch (error) {
        dialog(error);
      }
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
      return response;
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
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};


export default resourceManagement;