import { message, notification } from 'antd';
import {
  // update/add/remove
  addActivity,
  addMultipleActivity,
  getEmployeeList,
  getImportData,
  // fetch
  getManagerTimesheet,
  getMyTimesheet,
  // complex view
  getMyTimesheetByType,
  importTimesheet,
  duplicateTimesheet,
  exportTimeSheet,
  removeActivity,
  updateActivity,
  // complex view manager
  getManagerTimesheetOfTeamView,
  getManagerTimesheetOfProjectView,
  getProjectList,
  // complex view hr & finance
  getHRTimesheet,
  getFinanceTimesheet,
  sendMailInCompleteTimeSheet,
  // export manager report (my project)
  exportProject,
  exportTeam,
  // fetch filter
  getDesignationList,
  getDepartmentList,
  getProjectTypeList,
  getDivisionList,
  // common
  getEmployeeScheduleByLocation,
  // my request
  getMyRequest,
  resubmitMyRequest,
  getHolidaysByDate,
  getProjectsByEmployee,
  getLocationsOfCountries,
} from '@/services/timeSheet';
import { getCountry, getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import { convertMsToTime, isTheSameDay, pushSuccess } from '@/utils/timeSheet';
import { dialog } from '@/utils/utils';
import { STATUS_OF_REPORT } from '@/constants/dashboard';

const tenantId = getCurrentTenant();

const pushError = (errors) => {
  for (let i = 0; i < errors.length; i += 1) {
    notification.error({
      message: errors[i].msg,
    });
  }
};

const initialState = {
  myTimesheet: [],
  managerTimesheet: [],
  myRequest: [],
  // myTotalHours: '',
  managerTotalHours: 0,
  employeeList: [],
  // complex view
  myTimesheetByDay: [],
  myTimesheetByWeek: [],
  myTimesheetByMonth: [],
  timeoffList: [],
  detailTimesheet: [],
  currentTask: {},
  // store payload for refreshing
  viewingPayload: {},
  // for importing
  timesheetDataImporting: {},
  importingIds: [],
  // manager complex view
  managerTeamViewList: [],
  managerTeamViewPagination: {},
  managerProjectViewList: [],
  managerProjectViewPagination: {},
  projectList: [],
  // hr & finance complex view
  hrViewList: [],
  financeViewList: [],
  financeViewListTotal: 0,
  payloadExport: {},
  // filter
  employeeNameList: [],
  filterFinance: {},
  filterHrView: {},
  filterManagerReport: {},
  designationList: [],
  departmentList: [],
  projectTypeList: [],
  divisionList: [],

  // common
  selectedDivisions: [],
  selectedLocations: [],
  isLocationLoaded: false,
  isIncompleteTimesheet: false,
  employeeSchedule: {},
  myProjects: [],
  locationsOfCountries: [],
};

const TimeSheet = {
  namespace: 'timeSheet',
  state: initialState,
  effects: {
    // fetch
    *fetchMyTimesheetEffect({ payload }, { call, put }) {
      const response = {};
      try {
        const res = yield call(getMyTimesheet, {}, { ...payload, tenantId });
        const { code, data = [] } = res;
        if (code !== 200) throw res;

        yield put({
          type: 'save',
          payload: {
            myTimesheet: data,
          },
        });
      } catch (errors) {
        dialog(errors);
        return [];
      }
      return response;
    },
    *fetchManagerTimesheetEffect({ payload }, { call, put }) {
      const response = {};
      try {
        const res = yield call(getManagerTimesheet, {}, { ...payload, tenantId });
        const { code, data = [], additionInfo = {} } = res;
        if (code !== 200) throw res;

        const { workingHours = 0 } = additionInfo || {};
        yield put({
          type: 'save',
          payload: {
            managerTimesheet: data,
            // convert hour to milisecond
            managerTotalHours: convertMsToTime(workingHours * 3600 * 1000) || 0,
          },
        });
      } catch (errors) {
        dialog(errors);
        return [];
      }
      return response;
    },
    // complex view fetch
    *fetchMyTimesheetByTypeEffect({ payload, isRefreshing }, { call, put, select }) {
      const response = {};
      try {
        let payloadTemp = payload;
        if (isRefreshing) {
          const { viewingPayload } = yield select((state) => state.timeSheet);
          payloadTemp = viewingPayload;
        }
        const { _id: countryId = '' } = getCountry();
        const res = yield call(
          getMyTimesheetByType,
          {
            cancelToken: payloadTemp.cancelToken,
          },
          { ...payloadTemp, tenantId, country: countryId },
        );
        if (res) {
          const { code, data } = res;
          if (code !== 200) throw res;
          const { holidays = [] } = data;
          const { viewType } = payloadTemp;
          let stateVar = 'myTimesheetByDay';
          let dataTemp = null;
          let timeoffList = [];
          switch (viewType) {
            case 'D':
              dataTemp = data;
              break;
            case 'W':
              dataTemp = data?.projects;
              stateVar = 'myTimesheetByWeek';
              timeoffList = data?.timeoff;
              break;
            case 'M':
              dataTemp = data;
              timeoffList = data?.timeoff;
              stateVar = 'myTimesheetByMonth';
              break;
            default:
              break;
          }

          yield put({
            type: 'save',
            payload: {
              viewingPayload: payloadTemp,
              [stateVar]: dataTemp,
              timeoffList,
              holidays,
            },
          });
        }
      } catch (errors) {
        dialog(errors);
        return [];
      }
      return response;
    },

    *fetchMyTimesheetByDay({ payload, isRefreshing }, { call, select }) {
      let response = {};
      try {
        let payloadTemp = payload;
        if (isRefreshing) {
          const { viewingPayload } = yield select((state) => state.timeSheet);
          payloadTemp = viewingPayload;
        }
        response = yield call(getMyTimesheetByType, {}, { ...payloadTemp, tenantId });
        const { code } = response;
        if (code !== 200) throw response;
      } catch (errors) {
        dialog(errors);
        return [];
      }
      return response;
    },

    *fetchHolidaysByDate({ payload }, { call }) {
      try {
        const payloadTemp = payload;
        const { _id: countryId = '' } = getCountry();

        const res = yield call(
          getHolidaysByDate,
          {
            cancelToken: payloadTemp.cancelToken,
          },
          { ...payloadTemp, country: countryId },
        );
        if (res) {
          const { code, data = [] } = res;
          if (code !== 200) throw res;
          return data;
        }
        return [];
      } catch (errors) {
        dialog(errors);
        return [];
      }
    },

    // update/edit
    *updateActivityEffect({ payload, date }, { call, put }) {
      let response = {};
      try {
        const updating = date ? message.loading('Updating...', 0) : () => {}; // only loading in simple view
        const params = {
          companyId: payload.companyId,
          id: payload.id,
        };
        response = yield call(updateActivity, { ...payload, tenantId }, params);
        updating();
        const { code, msg = '', data = [], errors = [] } = response;
        if (code !== 200) {
          const errorMessage = `${errors.length && errors[0]?.msg} ${
            data.length && data[0]?.taskName
          }`;
          pushError([{ msg: errorMessage }]);
          return [];
        }
        yield put({
          type: 'savePayload',
          payload: {
            currentTask: payload,
          },
        });
        notification.success({ message: msg });
        if (date) {
          // for refresh immediately - no need to call API to refresh list
          yield put({
            type: 'onActivityUpdated',
            payload: {
              updatedActivity: data,
              date,
            },
          });
        }
      } catch (errors) {
        dialog(errors);
        return [];
      }
      return response;
    },

    // add
    *addActivityEffect({ payload, date }, { call, put }) {
      let response = {};
      try {
        const adding = date ? message.loading('Adding...', 0) : () => {}; // only loading in simple view
        response = yield call(addActivity, { ...payload, tenantId });
        const { code, data = {}, errors = [] } = response;
        const { errorList = [] } = data;
        const { data: currentTaskData } = payload;
        adding();
        if (code !== 200) {
          pushError(errors);
          return [];
        }
        pushSuccess(errorList, 'added', 'Create timesheet successfully');

        yield put({
          type: 'savePayload',
          payload: {
            currentTask: currentTaskData && currentTaskData[0],
          },
        });
        if (date) {
          // for refresh immediately - no need to call API to refresh list
          yield put({
            type: 'onActivityAdded',
            payload: {
              addedActivity: data,
              date,
            },
          });
        }
      } catch (errors) {
        dialog(errors);
        return [];
      }
      return response;
    },

    // add
    *addMultipleActivityEffect({ payload }, { call, put }) {
      let response = {};
      try {
        const params = {
          companyId: payload.companyId,
          employeeId: payload.employeeId,
          fromDate: payload.fromDate,
          toDate: payload.toDate,
        };
        response = yield call(addMultipleActivity, payload.data, params);
        const { code, data = {}, errors = [] } = response;
        const { errorList = [] } = data;
        const { data: currentTaskData } = payload;
        if (code !== 200) {
          pushError(errors);
          return [];
        }
        yield put({
          type: 'savePayload',
          payload: {
            currentTask: currentTaskData.length && currentTaskData[0],
          },
        });
        pushSuccess(errorList, 'added', 'Create timesheet successfully');
      } catch (errors) {
        dialog(errors);
        return [];
      }
      return response;
    },

    // remove
    *removeActivityEffect({ payload, date }, { call, put }) {
      let response = {};
      try {
        const removing = message.loading('Removing...', 0);
        response = yield call(removeActivity, {}, { ...payload, tenantId });
        removing();
        const { code, msg } = response;
        if (code !== 200) throw response;
        notification.success({ message: msg });

        if (date) {
          // for refresh immediately - no need to call API to refresh list
          yield put({
            type: 'onActivityRemoved',
            payload: {
              removedActivity: payload,
              date,
            },
          });
        }
      } catch (errors) {
        dialog(errors);
        return [];
      }
      return response;
    },
    // import
    *fetchImportData({ payload }, { call, put }) {
      const response = {};
      try {
        const res = yield call(getImportData, {}, { ...payload, tenantId });
        const { code, data = {} } = res;
        if (code !== 200) throw res;

        yield put({
          type: 'save',
          payload: {
            timesheetDataImporting: data,
          },
        });
      } catch (errors) {
        dialog(errors);
        return [];
      }
      return response;
    },

    *importTimesheet({ payload }, { call, put }) {
      let response = {};
      try {
        const { params, data: payloadData } = payload;
        response = yield call(importTimesheet, payloadData, params);
        const { code, data = {}, msg = '' } = response;
        const { error = [] } = data;
        if (code !== 200) {
          notification.error({
            message: msg,
          });
          return [];
        }
        pushSuccess(error, 'imported', 'Import timesheet successfully');

        yield put({
          type: 'save',
          payload: {},
        });
      } catch (errors) {
        dialog(errors);
        return [];
      }
      return response;
    },

    *duplicateTimesheet({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(
          duplicateTimesheet,
          { id: payload.id, dateTimes: payload.dateTimes },
          { ...payload, tenantId },
        );
        const { code, data = {}, msg = '' } = response;
        const { error = [] } = data;

        if (code !== 200) {
          notification.error({
            message: msg,
          });
          return [];
        }
        pushSuccess(error, 'imported', 'Import timesheet successfully');

        yield put({
          type: 'save',
          payload: {},
        });
      } catch (errors) {
        dialog(errors);
        return [];
      }
      return response;
    },

    // EXPORT TIMESHEET
    *exportTimeSheet(_, { call }) {
      let response = '';
      const hide = message.loading('Exporting data...', 0);
      try {
        response = yield call(exportTimeSheet, {
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

    // others
    *fetchEmployeeList({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getEmployeeList, {
          ...payload,
          tenantId,
          company: getCurrentCompany(),
        });
        const { statusCode, data = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { employeeList: data } });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },

    // MANAGER COMPLEX VIEW
    *fetchManagerTimesheetOfTeamViewEffect({ payload }, { call, put }) {
      const response = {};
      try {
        const res = yield call(
          getManagerTimesheetOfTeamView,
          {
            cancelToken: payload.cancelToken,
          },
          { ...payload, tenantId },
        );
        if (res) {
          const { code, data = [], pagination = {} } = res;
          if (code !== 200) throw res;

          yield put({
            type: 'save',
            payload: {
              managerTeamViewList: data,
              managerTeamViewPagination: pagination,
            },
          });
        }
      } catch (errors) {
        dialog(errors);
        return [];
      }
      return response;
    },
    *fetchManagerTimesheetOfProjectViewEffect({ payload }, { call, put }) {
      const response = {};
      try {
        const res = yield call(
          getManagerTimesheetOfProjectView,
          {
            cancelToken: payload.cancelToken,
          },
          { ...payload, tenantId },
        );
        if (res) {
          const { code, data = [], pagination = {} } = res;
          if (code !== 200) throw res;

          yield put({
            type: 'save',
            payload: {
              managerProjectViewList: data,
              managerProjectViewPagination: pagination,
            },
          });
        }
      } catch (errors) {
        dialog(errors);
        return [];
      }
      return response;
    },
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
          },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },

    // HR & FINANCE COMPLEX VIEW
    *fetchHRTimesheetEffect({ payload }, { call, put }) {
      const response = {};
      try {
        const res = yield call(
          getHRTimesheet,
          {
            cancelToken: payload.cancelToken,
          },
          { ...payload, tenantId },
        );
        if (res) {
          const { code, data = [] } = res;
          if (code !== 200) throw res;

          yield put({
            type: 'save',
            payload: {
              hrViewList: data,
            },
          });
        }
      } catch (errors) {
        dialog(errors);
        return [];
      }
      return response;
    },

    *fetchDivisionListEffect({ payload }, { call, put }) {
      try {
        const response = yield call(getDivisionList, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { divisionList: data },
        });
      } catch (error) {
        dialog(error);
      }
    },

    *fetchFinanceTimesheetEffect({ payload }, { call, put }) {
      const response = {};
      try {
        const res = yield call(getFinanceTimesheet, {}, { ...payload, tenantId });
        const { code, data = [], pagination = {} } = res;
        if (code !== 200) throw res;

        yield put({
          type: 'save',
          payload: {
            financeViewList: data,
            financeViewListTotal: pagination?.rowCount || 0,
          },
        });
      } catch (errors) {
        dialog(errors);
        return [];
      }
      return response;
    },

    *exportReportProject({ payload }, { call }) {
      let response = '';
      const hide = message.loading('Exporting data...', 0);
      try {
        response = yield call(
          exportProject,
          {},
          {
            ...payload,
            tenantId: getCurrentTenant(),
          },
        );
        const { code } = response;
        if (code !== 200) throw response;
      } catch (error) {
        dialog(error);
      }
      hide();
      return response;
    },

    *exportReportTeam({ payload }, { call }) {
      let response = '';
      const hide = message.loading('Exporting data...', 0);
      try {
        response = yield call(
          exportTeam,
          {},
          {
            ...payload,
            tenantId: getCurrentTenant(),
          },
        );
        const { code } = response;
        if (code !== 200) throw response;
      } catch (error) {
        dialog(error);
      }
      hide();
      return response;
    },
    *fetchEmployeeNameListEffect({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getEmployeeList, {
          company: getCurrentCompany(),
          ...payload,
          tenantId: getCurrentTenant(),
          status: ['ACTIVE'],
        });
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;

        yield put({
          type: 'save',
          payload: {
            employeeNameList: data,
          },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *fetchDesignationListEffect({ payload = {} }, { call, put }) {
      try {
        const response = yield call(getDesignationList, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data: designationList = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { designationList } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchDepartmentListEffect({ payload = {} }, { call, put }) {
      try {
        const response = yield call(getDepartmentList, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data: departmentList = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { departmentList } });
      } catch (errors) {
        dialog(errors);
      }
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
    *getEmployeeScheduleByLocation({ payload = {} }, { call, put }) {
      let response;
      try {
        response = yield call(getEmployeeScheduleByLocation, {
          ...payload,
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data: employeeSchedule = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { employeeSchedule },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *fetchMyRequest({ payload = {} }, { call, put }) {
      let response;
      try {
        response = yield call(getMyRequest, {
          ...payload,
          roles: ['EMPLOYEE'],
          tenantId: getCurrentTenant(),
          companyId: getCurrentCompany(),
          types: ['timesheet'],
        });
        const { code, data: { reports: myRequest = [] } = {} } = response;
        if (code !== 200) throw response;
        yield put({
          type: 'save',
          payload: { myRequest },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *resubmitMyRequest({ payload = {} }, { call, put }) {
      let response;
      try {
        response = yield call(resubmitMyRequest, {
          ...payload,
          tenantId: getCurrentTenant(),
          companyId: getCurrentCompany(),
          status: STATUS_OF_REPORT.RE_SUBMIT,
        });
        const { code, msg, myRequest } = response;
        if (code !== 200) throw response;
        notification.success({ message: msg });
        yield put({
          type: 'save',
          payload: { ...myRequest },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *sendMailInCompleteTimeSheet({ payload = {} }, { call }) {
      let response;
      try {
        response = yield call(sendMailInCompleteTimeSheet, {
          ...payload,
          tenantId: getCurrentTenant(),
          companyId: getCurrentCompany(),
        });
        const { code, msg } = response;
        if (code !== 200) throw response;
        notification.success({ message: msg });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *fetchMyProjects({ payload = {} }, { call, put }) {
      try {
        const response = yield call(getProjectsByEmployee, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data: projectsList = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { myProjects: projectsList },
        });
      } catch (errors) {
        dialog(errors);
      }
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

        yield put({
          type: 'save',
          payload: { locationsOfCountries: data },
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
    clearFilter(state) {
      return {
        ...state,
        filterFinance: {},
        filterHrView: {},
        filterManagerReport: {},
      };
    },
    clearImportModalData(state) {
      return {
        ...state,
        importingIds: [],
      };
    },
    savePayload(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    saveImportingIds(state, action) {
      const { importingIds } = state;
      const { selectedIds = [], date = '' } = action.payload;
      const tempImportingIds = JSON.parse(JSON.stringify(importingIds));
      const index = tempImportingIds.findIndex((w) => isTheSameDay(w.date, date));

      if (index > -1) {
        tempImportingIds[index].selectedIds = [...selectedIds];
        // if there is no ids, remove the object with date
        if (selectedIds.length === 0) {
          tempImportingIds.splice(index, 1);
        }
      } else {
        tempImportingIds.push({
          date,
          selectedIds,
        });
      }

      return {
        ...state,
        importingIds: [...tempImportingIds],
      };
    },
    clearState() {
      return initialState;
    },
    onActivityUpdated(state, action) {
      const { updatedActivity = {}, date = '' } = action.payload;
      const {
        startTime = '',
        endTime = '',
        taskName = '',
        nightShift = false,
        notes = '',
        duration = '',
      } = updatedActivity || {};
      let { myTimesheet } = state;
      myTimesheet = myTimesheet.map((item) => {
        if (item.date === date) {
          const timesheetTemp = item.timesheet.map((val) => {
            if (val.id === updatedActivity.id) {
              return {
                ...val,
                startTime,
                endTime,
                taskName,
                nightShift: !!(nightShift === 1 || nightShift),
                notes,
                duration,
              };
            }
            return val;
          });
          return {
            ...item,
            timesheet: timesheetTemp,
          };
        }
        return item;
      });

      return {
        ...state,
        myTimesheet: [...myTimesheet],
      };
    },
    onActivityAdded(state, action) {
      const { addedActivity = {}, date = '' } = action.payload;
      let { myTimesheet } = state;
      const newItem = { ...addedActivity, totalHours: convertMsToTime(addedActivity.duration) };
      const findDateExist = myTimesheet.find((t) => t.date === date);
      if (myTimesheet.length === 0) {
        myTimesheet = [
          {
            date,
            timesheet: [newItem],
          },
        ];
      } else if (findDateExist) {
        myTimesheet = myTimesheet.map((item) => {
          if (item.date === date && findDateExist) {
            const timesheetTemp = JSON.parse(JSON.stringify(item.timesheet));
            timesheetTemp.push(newItem);
            return {
              ...item,
              timesheet: timesheetTemp,
            };
          }
          return item;
        });
      } else {
        myTimesheet.push({
          date,
          timesheet: [newItem],
        });
      }
      return {
        ...state,
        myTimesheet: [...myTimesheet],
      };
    },

    onActivityRemoved(state, action) {
      const { removedActivity = {}, date = '' } = action.payload;
      let { myTimesheet } = state;
      myTimesheet = myTimesheet.map((item) => {
        if (item.date === date) {
          const timesheetTemp = item.timesheet.filter((val) => val.id !== removedActivity.id);
          return {
            ...item,
            timesheet: timesheetTemp,
          };
        }
        return item;
      });

      // if there no timesheet after remove, clear myTimesheet state
      if (myTimesheet.length === 1) {
        if (myTimesheet[0].timesheet.length === 0) {
          return {
            ...state,
            myTimesheet: [],
          };
        }
      }
      return {
        ...state,
        myTimesheet: [...myTimesheet],
      };
    },
  },
};

export default TimeSheet;
