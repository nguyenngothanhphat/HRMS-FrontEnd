import { message, notification } from 'antd';
import {
  // fetch
  getManagerTimesheet,
  getMyTimesheet,
  removeActivity,
  // update/add/remove
  addActivity,
  updateActivity,
} from '@/services/timeSheet';
import { dialog } from '@/utils/utils';
import { convertMsToTime } from '@/utils/timeSheet';

const TimeSheet = {
  namespace: 'timeSheet',
  state: {
    myTimesheet: [],
    managerTimesheet: [],
    myTotalHours: '',
  },
  effects: {
    // fetch
    *fetchMyTimesheetEffect({ payload }, { call, put }) {
      const response = {};
      try {
        const res = yield call(getMyTimesheet, payload);
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
        const res = yield call(getManagerTimesheet, payload);
        const { code, data = [] } = res;
        if (code !== 200) throw res;

        yield put({
          type: 'save',
          payload: {
            managerTimesheet: data,
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
        response = yield call(updateActivity, payload);
        const { code, msg = '', data = {} } = response;
        if (code !== 200) throw response;
        notification.success({ message: msg });

        // for refresh immediately - no need to call API to refresh list
        yield put({
          type: 'onActivityUpdated',
          payload: {
            updatedActivity: data,
            date,
          },
        });
        updating();
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
        const adding = message.loading('Adding...', 0);
        response = yield call(addActivity, payload);
        const { code, data = {}, msg = '' } = response;
        if (code !== 200) throw response;
        notification.success({ message: msg });

        // for refresh immediately - no need to call API to refresh list
        yield put({
          type: 'onActivityAdded',
          payload: {
            addedActivity: data,
            date,
          },
        });
        adding();
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
        response = yield call(removeActivity, payload);
        const { code, msg } = response;
        if (code !== 200) throw response;
        notification.success({ message: msg });

        // for refresh immediately - no need to call API to refresh list
        yield put({
          type: 'onActivityRemoved',
          payload: {
            removedActivity: payload,
            date,
          },
        });
        removing();
      } catch (errors) {
        dialog(errors);
        return [];
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
                nightShift,
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

      if (myTimesheet.length === 0) {
        myTimesheet = [
          {
            date,
            timesheet: [newItem],
          },
        ];
      } else {
        myTimesheet = myTimesheet.map((item) => {
          if (item.date === date) {
            const timesheetTemp = JSON.parse(JSON.stringify(item.timesheet));
            timesheetTemp.push(newItem);
            return {
              ...item,
              timesheet: timesheetTemp,
            };
          }
          return item;
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
