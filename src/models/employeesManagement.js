import { dialog } from '@/utils/utils';
import { getEmployeesList } from '../services/employeesManangement';

const employeesManangement = {
  namespace: 'employeesManangement',
  state: {
    activeEmployeesList: [],
    inActiveEmployeesList: [],
  },
  effects: {
    *fetchActiveEmployeesList({ payload: { status = 'ACTIVE' } = {} }, { call, put }) {
      try {
        const response = yield call(getEmployeesList, {
          status,
        });
        const { statusCode, data: activeEmployeesList = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { activeEmployeesList } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchInActiveEmployeesList({ payload: { status = 'INACTIVE' } = {} }, { call, put }) {
      try {
        const response = yield call(getEmployeesList, {
          status,
        });
        const { statusCode, data: inActiveEmployeesList = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { inActiveEmployeesList } });
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
export default employeesManangement;
