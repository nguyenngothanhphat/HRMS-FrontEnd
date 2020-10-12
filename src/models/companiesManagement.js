import { dialog } from '@/utils/utils';
import {
  getActiveCompaniesList,
  getInActiveCompaniesList,
  getCompanyDetails,
} from '@/services/companiesManangement';

const companiesManagement = {
  namespace: 'companiesManagement',
  state: {
    currentStep: 0,
    isModified: false,
    activeCompaniesList: [],
    inActiveCompaniesList: [],
    originData: {
      companyDetails: {},
    },
    tempData: {
      companyDetails: {},
    },
  },
  effects: {
    *fetchCompanyDetails({ payload: { companyID = '' }, dataTempKept = {} }, { call, put }) {
      try {
        const response = yield call(getCompanyDetails, { companyID });
        const { statusCode, data: companyDetails = {} } = response;
        if (statusCode !== 200) throw response;
        const checkDataTempKept = JSON.stringify(dataTempKept) === JSON.stringify({});
        let companyDetailsTemp = { ...companyDetails };
        if (!checkDataTempKept) {
          companyDetailsTemp = { ...companyDetailsTemp, ...dataTempKept };
          const isModified = JSON.stringify(companyDetailsTemp) !== JSON.stringify(companyDetails);
          yield put({
            type: 'save',
            payload: { isModified },
          });
        }
        yield put({
          type: 'save',
          payload: { idCurrentCompany: companyID },
        });
        yield put({
          type: 'saveOrigin',
          payload: { companyDetails },
        });
        yield put({
          type: 'saveTemp',
          payload: { companyDetails: companyDetailsTemp },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
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
