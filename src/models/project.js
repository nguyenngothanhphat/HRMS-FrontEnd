import { queryProject } from '@/services/project';

export default {
  namespace: 'project',

  state: {
    listProject: [],
    itemProject: {},
  },

  effects: {
    *fetch({ payload, item }, { call, put }) {
      try {
        const response = yield call(queryProject, payload);
        const { statusCode, data } = response;
        const listProject = data.sort((a, b) => {
          const nameA = a.name.toLowerCase();
          const nameB = b.name.toLowerCase();
          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
          return 0;
        });
        let [itemProject] = listProject;
        if (item) {
          itemProject = item;
        }
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { listProject, itemProject } });
      } catch (errors) {
        // dialog(errors);
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
