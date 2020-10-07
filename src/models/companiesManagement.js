import { dialog } from '@/utils/utils';
import { getActiveCompaniesList, getInActiveCompaniesList } from '@/services/companiesManangement';

const companiesManagement = {
  namespace: 'companiesManagement',
  state: {
    isModified: false,
    activeCompaniesList: [],
    inActiveCompaniesList: [],
    company: {
      name: '',
      dba: '',
      ein: '',
      employeeNumber: '',
      website: '',
    },
    headQuarterAddress: {
      address: '',
      country: '',
      state: '',
      zipCode: '',
    },
    legalAddress: {
      address: '',
      country: '',
      state: '',
      zipCode: '',
    },
    locations: [],
    user: {
      firstName: '',
      email: '',
    },
  },
  effects: {
    *fetchActiveCompaniesList(_, { call, put }) {
      try {
        const response = yield call(getActiveCompaniesList);
        const { statusCode, data: activeCompaniesList = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { activeCompaniesList } });
      } catch (errors) {
        dialog(errors);
      }
    },

    *fetchInActiveCompaniesList(_, { call, put }) {
      try {
        const response = yield call(getInActiveCompaniesList);
        const { statusCode, data: inActiveCompaniesList = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { inActiveCompaniesList } });
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
    saveHeadQuarterAddress(state, action) {
      const { headQuarterAddress } = state;
      return {
        ...state,
        headQuarterAddress: {
          ...headQuarterAddress,
          ...action.payload,
        },
      };
    },
    saveLegalAddress(state, action) {
      const { legalAddress } = state;
      return {
        ...state,
        legalAddress: {
          ...legalAddress,
          ...action.payload,
        },
      };
    },
  },
};
export default companiesManagement;
