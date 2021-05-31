import { getCurrentTenant } from '@/utils/authority';
import { dialog } from '@/utils/utils';
import getListOffBoarding from '../services/offBoardingManagement';

const offBoardingManagement = {
  namespace: 'offBoardingManagement',
  state: {
    listOffBoarding: [],
  },
  effects: {
    *fetchListOffBoarding({ payload }, { call, put }) {
      try {
        const response = yield call(getListOffBoarding, {
          ...payload,
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data: listOffBoarding = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { listOffBoarding },
        });
      } catch (errors) {
        dialog(errors);
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
export default offBoardingManagement;
