import { getAuditTrail } from '@/services/projectDetails';
import { getCurrentTenant } from '@/utils/authority';
import { dialog } from '@/utils/utils';

const tenantId = getCurrentTenant();

const initialState = {
  auditTrailList: [],
};

const ProjectDetails = {
  namespace: 'projectDetails',
  state: initialState,
  effects: {
    // fetch
    *fetchAuditTrailListEffect({ payload }, { call, put }) {
      const response = {};
      try {
        const res = yield call(getAuditTrail, { ...payload, tenantId });
        const { statusCode, data = [] } = res;
        if (statusCode !== 200) throw res;

        yield put({
          type: 'save',
          payload: {
            auditTrailList: data,
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
    clearState() {
      return initialState;
    },
  },
};

export default ProjectDetails;
