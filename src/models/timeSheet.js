import { message, notification } from 'antd';
import { dialog } from '@/utils/utils';
import {
  // fetch
  getManagerTimesheet,
  getMyTimesheet,
  // update/add/remove
  updateActivity,
  addActivity,
  removeActivity,
} from '@/services/timeSheet';

const TimeSheet = {
  namespace: 'timeSheet',
  state: {
    myTimesheet: [],
    managerTimesheet: [],
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
    *updateActivityEffect({ payload }, { call, put }) {
      let response = {};
      try {
        const updating = message.loading('Updating...', 0);
        response = yield call(updateActivity, payload);
        const { code, data = {}, msg = '' } = response;
        if (code !== 200) throw response;
        notification.success({ message: msg });
        yield put({
          type: 'onActivityUpdated',
          payload: {
            updatedActivity: data,
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
    *addActivityEffect({ payload }, { call, put }) {
      let response = {};
      try {
        const adding = message.loading('Adding...', 0);
        response = yield call(addActivity, payload);
        const { code, data = {}, msg = '' } = response;
        if (code !== 200) throw response;
        notification.success({ message: msg });

        yield put({
          type: 'onActivityAdded',
          payload: {
            addedActivity: data,
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
    *removeActivityEffect({ payload }, { call, put }) {
      let response = {};
      try {
        const removing = message.loading('Removing...', 0);
        response = yield call(removeActivity, payload);
        const { code, msg } = response;
        if (code !== 200) throw response;
        notification.success({ message: msg });

        yield put({
          type: 'onActivityRemoved',
          payload: {
            removedActivity: payload,
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
      const { updatedActivity = {} } = action.payload;
      let { myTimesheet } = state;
      myTimesheet = myTimesheet.map((item) =>
        item._id === updatedActivity._id ? updatedActivity : item,
      );
      return {
        ...state,
        myTimesheet,
      };
    },
    onActivityAdded(state, action) {
      const { addedActivity = {} } = action.payload;
      const { myTimesheet } = state;
      myTimesheet.push(addedActivity);
      return {
        ...state,
        myTimesheet: [...myTimesheet],
      };
    },

    onActivityRemoved(state, action) {
      const { removedActivity = {} } = action.payload;
      let { myTimesheet } = state;
      myTimesheet = myTimesheet.filter((item) => item._id !== removedActivity._id);
      return {
        ...state,
        myTimesheet: [...myTimesheet],
      };
    },
  },
};

export default TimeSheet;
