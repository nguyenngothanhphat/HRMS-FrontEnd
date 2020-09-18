import { dialog } from '@/utils/utils';
import { getGeneralInfo, getCompensation, getListSkill } from '@/services/employeeProfiles';

const employeeProfile = {
  namespace: 'employeeProfile',
  state: {
    isModified: false,
    listSkill: [],
    originData: {
      generalData: {},
      compensationData: {},
    },
    tempData: {
      generalData: {},
      compensationData: {},
    },
  },
  effects: {
    *fetchGeneralInfo({ payload: { employee = '' } }, { call, put }) {
      try {
        const response = yield call(getGeneralInfo, { employee });
        const { statusCode, data: generalData = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'saveOrigin',
          payload: { generalData },
        });
        yield put({
          type: 'saveTemp',
          payload: { generalData },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchCompensation({ payload: { employee = '' } }, { call, put }) {
      try {
        const response = yield call(getCompensation, { employee });
        const { statusCode, data: compensationData = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'saveOrigin',
          payload: { compensationData },
        });
        yield put({
          type: 'saveTemp',
          payload: { compensationData },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchListSkill(_, { call, put }) {
      try {
        const response = yield call(getListSkill);
        const { statusCode, data: listSkill = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { listSkill } });
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
    saveOrigin(state, action) {
      const { originData } = state;
      return {
        ...state,
        originData: {
          ...originData,
          ...action.payload,
        },
      };
    },
    saveTemp(state, action) {
      const { tempData } = state;
      return {
        ...state,
        tempData: {
          ...tempData,
          ...action.payload,
        },
      };
    },
  },
};
export default employeeProfile;
