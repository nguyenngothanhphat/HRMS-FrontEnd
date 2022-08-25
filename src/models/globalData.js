import { getEmployeeList } from '@/services/globalData';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import { dialog } from '@/utils/utils';

const globalData = {
  namespace: 'globalData',
  state: {},
  effects: {
    *fetchEmployeeListEffect({ payload }, { call }) {
      // this is being used for debounce selector (@/components/DebounceSelect)
      let response = {};
      try {
        response = yield call(getEmployeeList, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
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
  },
};
export default globalData;
