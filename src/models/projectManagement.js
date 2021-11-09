import { getProjectList } from '@/services/projectManagement';
import { getCurrentTenant } from '@/utils/authority';
import { dialog } from '@/utils/utils';

const tenantId = getCurrentTenant();

const initialState = {
  projectList: [],
};

const TimeSheet = {
  namespace: 'projectManagement',
  state: initialState,
  effects: {
    // fetch
    *fetchProjectListEffect({ payload }, { call, put }) {
      const response = {};
      try {
        const res = yield call(getProjectList, { ...payload, tenantId });
        const { statusCode, data = [] } = res;
        if (statusCode !== 200) throw res;

        yield put({
          type: 'save',
          payload: {
            projectList: data,
          },
        });
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
    clearImportModalData(state) {
      return {
        ...state,
        importingIds: [],
      };
    },

    clearState() {
      return initialState;
    },
  },
};

export default TimeSheet;
