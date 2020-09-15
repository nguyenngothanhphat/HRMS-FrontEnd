import { dialog } from '@/utils/utils';
import { getGeneralInfo, getCompensation } from '@/services/employeeProfiles';

const employeeProfile = {
  namespace: 'employeeProfile',
  state: {
    employeeById: {},
  },
  effects: {
    *fetchGeneralInfo({ payload: { employee = '' } }, { call, put }) {
      try {
        const response = yield call(getGeneralInfo, { employee });
        const { statusCode, data: generalData = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'saveGeneral', payload: { generalData } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchCompensation({ payload: { employee = '' } }, { call, put }) {
      try {
        const response = yield call(getCompensation, { employee });
        const { statusCode, data: compensationData = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'saveGeneral', payload: { compensationData } });
      } catch (errors) {
        dialog(errors);
      }
    },
  },
  reducers: {
    saveGeneral(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
export default employeeProfile;
