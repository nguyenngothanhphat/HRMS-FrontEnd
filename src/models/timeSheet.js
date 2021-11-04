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
  removeActivity,
  updateActivity,
} from '@/services/timeSheet';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import { convertMsToTime, isTheSameDay } from '@/utils/timeSheet';
import { dialog } from '@/utils/utils';

const tenantId = getCurrentTenant();

const initialState = {
  myTimesheet: [],
  managerTimesheet: [],
  // myTotalHours: '',
  managerTotalHours: 0,
  employeeList: [],
  // complex view
  myTimesheetByDay: [],
  myTimesheetByWeek: [],
  myTimesheetByMonth: [],
  // store payload for refreshing
  viewingPayload: {},
  // for importing
  timesheetDataImporting: [],
  importingIds: [],
};

const TimeSheet = {
  namespace: 'timeSheet',
  state: initialState,
  effects: {
    // fetch
    *fetchMyTimesheetEffect({ payload }, { call, put }) {
      const response = {};
      try {
        const res = yield call(getMyTimesheet, { ...payload, tenantId });
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
        const res = yield call(getManagerTimesheet, { ...payload, tenantId });
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
        const res = yield call(getMyTimesheetByType, { ...payloadTemp, tenantId });
        const { code, data = [] } = res;
        if (code !== 200) throw res;
        const { viewType } = payloadTemp;
        let stateVar = 'myTimesheetByDay';

        switch (viewType) {
          case 'D':
            break;
          case 'W':
            stateVar = 'myTimesheetByWeek';
            break;
          case 'M':
            stateVar = 'myTimesheetByMonth';
            break;
          default:
            break;
        }

        yield put({
          type: 'save',
          payload: {
            viewingPayload: payloadTemp,
            [stateVar]: data,
          },
        });
      } catch (errors) {
        dialog(errors);
        return [];
      }
      return response;
    },

    // update/edit
    *updateActivityEffect({ payload, date }, { call, put }) {
      let response = {};
      try {
        const updating = date ? message.loading('Updating...', 0) : () => {}; // only loading in simple view
        response = yield call(updateActivity, { ...payload, tenantId });
        updating();
        const { code, msg = '', data = {}, errors = [] } = response;
        if (code !== 200) {
          notification.error({ message: errors[0].msg });
          return [];
        }
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
        const { code, data = {}, msg = '', errors = [] } = response;
        adding();
        if (code !== 200) {
          notification.error({ message: errors[0].msg });
          return [];
        }
        notification.success({ message: msg });

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
    *addMultipleActivityEffect({ payload }, { call }) {
      let response = {};
      try {
        response = yield call(addMultipleActivity, payload);
        const { code, msg = '', errors = [] } = response;
        if (code !== 200) {
          notification.error({ message: errors[0].msg });
          return [];
        }
        notification.success({ message: msg });
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
        response = yield call(removeActivity, { ...payload, tenantId });
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
        const res = yield call(getImportData, { ...payload, tenantId });
        const { code, data = [] } = res;
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
        response = yield call(importTimesheet, { ...payload, tenantId });
        const { code, msg = '', data = {}, errors = [] } = response;
        if (code !== 200) {
          notification.error({ message: errors[0].msg });
          return [];
        }
        notification.success({ message: msg });

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
