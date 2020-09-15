import { dialog } from '@/utils/utils';
import getGeneralInfo from '@/services/employeeProfiles';

const employeeProfile = {
  namespace: 'employeeProfile',
  state: {
    employeeById: {},
  },
  effects: {
    *fetchGeneralInfo({ payload: { id = '' } }, { call, put }) {
      try {
        console.log(id);
        const response = yield call(getGeneralInfo, { id });
        console.log(response);
        const { statusCode, data: generalData = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'saveGeneral', payload: { generalData } });
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
