import { dialog } from '@/utils/utils';
import { notification } from 'antd';
import {
  getEmployeesList,
  getCompanyList,
  getLocationList,
  getDepartmentList,
  getJobTitleList,
  getReportingManagerList,
  addEmployee,
} from '../services/employeesManagement';

const employeesManagement = {
  namespace: 'employeesManagement',
  state: {
    activeEmployeesList: [],
    inActiveEmployeesList: [],
    companyList: [],
    locationList: [],
    departmentList: [],
    jobTitleList: [],
    reportingManagerList: [],
  },
  effects: {
    *fetchActiveEmployeesList({ payload: { status = 'ACTIVE' } = {} }, { call, put }) {
      try {
        const response = yield call(getEmployeesList, {
          status,
        });
        const { statusCode, data: activeEmployeesList = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { activeEmployeesList } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchInActiveEmployeesList({ payload: { status = 'INACTIVE' } = {} }, { call, put }) {
      try {
        const response = yield call(getEmployeesList, {
          status,
        });
        const { statusCode, data: inActiveEmployeesList = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { inActiveEmployeesList } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchCompanyList(_, { call, put }) {
      try {
        const response = yield call(getCompanyList);
        const { statusCode, data: companyList = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { companyList } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchLocationList({ payload: { company = '' } }, { call, put }) {
      try {
        const response = yield call(getLocationList, company);
        const { statusCode, data: locationList = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { locationList } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchDepartmentList({ payload: { company = '' } }, { call, put }) {
      try {
        const response = yield call(getDepartmentList, company);
        const { statusCode, data: departmentList = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { departmentList } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchJobTitleList({ payload: { company = '' } }, { call, put }) {
      try {
        const response = yield call(getJobTitleList, company);
        const { statusCode, data: jobTitleList = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { jobTitleList } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchReportingManagerList({ payload = {} }, { call, put }) {
      console.log(payload);
      try {
        const response = yield call(getReportingManagerList, payload);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { managerList: data } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *addEmployee({ payload }, { call }) {
      try {
        const response = yield call(addEmployee, payload);
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
      } catch (errors) {
        dialog(errors);
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
export default employeesManagement;
