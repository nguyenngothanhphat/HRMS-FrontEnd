import { notification, message } from 'antd';
import { getAdhaarcardAdd } from '@/services/employeeProfiles';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import { dialog } from '@/utils/utils';
import {
    addTicket,
    getResources,
    getDepartmentList,
    getOffToTalList,
    getProjectList,
    postAssignToProject,
} from '../services/resourceManagement';

const resourceManagement = {
    namespace: 'resourceManagement',
    state: {
        resourceList: [],
        totalList: [],
        totalAll: [],
        listEmployee: [],
        listDepartment: [],
        projectList: [],
    },
    effects: {
        * addTicket({ payload }, { call, put }) {
            try {
                const response = yield call(addTicket, {
                    ...payload,
                    tenantId: getCurrentTenant(),
                    company: getCurrentCompany(),
                    // department: getDepartmentList()
                });
                const {
                    statusCode,
                    data: {},
                } = response;
            } catch (error) {
                dialog(error);
            }
        },
        * getProjectList({ payload }, { call, put }) {
            console.log('get projects');
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
        * getResources({ payload }, { call, put }) {
            try {
                const response = yield call(getResources, {
                    ...payload,
                    tenantId: getCurrentTenant(),
                    // company: getCurrentCompany(),
                    company: [getCurrentCompany()],
                    department: getDepartmentList(),
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
        * fetchAssignToProject({ payload }, { call, put }) {
            try {
                const response = yield call(postAssignToProject, {
                    ...payload,
                    tenantId: getCurrentTenant(),
                    company: getCurrentCompany(),
                });
                const { statusCode, data } = response;
                if (statusCode !== 200) throw response;
                notification.success({
                    message: 'Add assign to project Successfully',
                });
                // yield put({
                //   type: 'save',
                //   payload: { postAssignStatus: data },
                // });
            } catch (error) {
                dialog(error);
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
    },
};
export default resourceManagement;