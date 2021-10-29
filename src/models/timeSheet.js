import { message, notification } from 'antd';
import {
  // fetch
  getManagerTimesheet,
  getMyTimesheet,
  removeActivity,
  // update/add/remove
  addActivity,
  updateActivity,
  getEmployeeList,

  // complex view
  getMyTimesheetByType,
} from '@/services/timeSheet';
import { dialog } from '@/utils/utils';
import { convertMsToTime } from '@/utils/timeSheet';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';

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
        const updating = message.loading('Updating...', 0);
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
