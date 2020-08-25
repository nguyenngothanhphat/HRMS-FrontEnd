import { queryGroup, submitGroup } from '@/services/group';
import { dialog } from '@/utils/utils';

export default {
  namespace: 'tag',

  state: {
    listGroup: [],
  },

  effects: {
    *fetchGroup(_, { call, put }) {
      try {
        const response = yield call(queryGroup);
        const { data, statusCode } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: {
            listGroup: data,
          },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *createGroup(
      {
        payload: { groupName },
      },
      { put, call }
    ) {
      let group;
      try {
        const response = yield call(submitGroup, { groupName });
        const { data, statusCode } = response;
        if (statusCode !== 200) throw response;
        group = data;
        yield put({
          type: 'fetchGroup',
        });
      } catch (errors) {
        dialog(errors);
      }
      return group;
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
