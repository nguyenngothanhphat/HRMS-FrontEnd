import { notification } from 'antd';
import moment from 'moment';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import { exportCSV } from '@/utils/timeOffManagement';
import { dialog, exportRawDataToCSV } from '@/utils/utils';
import {
  getListEmployees,
  getListTimeOff,
  getLocationsOfCountries,
  getTimeOffTypeList,
  getMissingLeaveDates,
} from '../services/timeOffManagement';

const timeOffManagement = {
  namespace: 'timeOffManagement',
  state: {
    listTimeOff: [],
    listTotal: 0,
    listEmployees: [],
    selectedLocations: [],
    locationsOfCountries: [],
    typeList: [],
    missingLeaveDates: [],
  },
  effects: {
    *getListEmployeesEffect({ payload = {} }, { call, put }) {
      try {
        const response = yield call(getListEmployees, payload);
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { listEmployees: data } });
      } catch (error) {
        dialog(error);
      }
    },

    *getListTimeOffEffect({ payload = {} }, { call, put }) {
      try {
        const response = yield call(getListTimeOff, { ...payload, company: getCurrentCompany() });
        const { statusCode, data: listTimeOff = [], total = 0 } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { listTimeOff, listTotal: total },
        });
      } catch (errors) {
        dialog(errors);
      }
    },

    *getTimeOffTypeListEffect({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getTimeOffTypeList, payload);
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { typeList: data },
        });
      } catch (error) {
        dialog(error);
      }
      return response;
    },

    *getLocationsOfCountriesEffect({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getLocationsOfCountries, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;

        let allDataTemp = [];
        data.forEach((item) => {
          const { data: d = [] } = item;
          allDataTemp = [...allDataTemp, ...d.map((x) => x._id)];
        });

        yield put({
          type: 'save',
          payload: { locationsOfCountries: data, selectedLocations: allDataTemp },
        });
      } catch (error) {
        dialog(error);
      }
      return response;
    },

    *exportCSVEffect({ payload }, { call, select }) {
      let response = {};
      try {
        const { listTotal = 0, selectedLocations = [] } = yield select(
          (state) => state.timeOffManagement,
        );
        response = yield call(getListTimeOff, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
          limit: listTotal,
          page: 1,
          selectedLocations,
        });
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;
        exportCSV(data);
      } catch (error) {
        dialog(error);
      }
      return response;
    },

    *getMissingLeaveDatesEffect({ payload }, { call, select }) {
      let response = {};
      try {
        const { listTotal = 0, selectedLocations = [] } = yield select(
          (state) => state.timeOffManagement,
        );
        response = yield call(getMissingLeaveDates, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
          limit: listTotal,
          page: 1,
          selectedLocations,
        });
        if (response) {
          exportRawDataToCSV(
            response,
            `Time-Off-Missing-Leave-Dates-Report-${moment().format('YYYY-MM-DD')}`,
          );
        } else {
          notification.error('Something failed. Please try again.');
        }
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
export default timeOffManagement;
