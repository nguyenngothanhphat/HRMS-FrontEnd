import { dialog } from '@/utils/utils';
import {
  getCompaniesList,
  getCompanyDetails,
  updateCompany,
  getLocationsList,
  addLocation,
  updateLocation,
} from '@/services/companiesManangement';
import { notification } from 'antd';

const companiesManagement = {
  namespace: 'companiesManagement',
  state: {
    currentStep: 0,
    isModified: false,
    companiesList: [],
    locations: [],
    locationsOfDetail: [],
    locationsList: [],
    originData: {
      companyDetails: {},
    },
    tempData: {
      companyDetails: {},
    },
    idCurrentCompany: '',
  },
  effects: {
    *fetchCompanyDetails({ payload: { id = '' }, dataTempKept = {} }, { call, put }) {
      try {
        const response = yield call(getCompanyDetails, { id });
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
          payload: { idCurrentCompany: id },
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

    *fetchCompaniesList(_, { call, put }) {
      try {
        const response = yield call(getCompaniesList);
        const { statusCode, data: companiesList = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { companiesList } });
      } catch (errors) {
        dialog(errors);
      }
    },

    *fetchLocationsList({ payload: { company = '' } }, { call, put }) {
      try {
        const response = yield call(getLocationsList, { company });
        const { statusCode, data: locationsList = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { locationsList } });
      } catch (errors) {
        dialog(errors);
      }
    },

    *updateCompany({ payload = {}, dataTempKept = {} }, { put, call, select }) {
      let resp = '';
      try {
        console.log('payload', payload);
        const response = yield call(updateCompany, payload);
        const { idCurrentCompany } = yield select((state) => state.employeeProfile);
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        yield put({
          type: 'fetchCompanyDetails',
          payload: { id: payload.id },
          dataTempKept,
        });
        yield put({
          type: 'save',
          payload: { idCurrentCompany },
        });
        // if (isUpdateAvatar) {
        //   yield put({
        //     type: 'user/fetchCurrent',
        //   });
        // }
        resp = response;
      } catch (errors) {
        dialog(errors);
      }
      return resp;
    },

    *addLocation({ payload = {} }, { call, put }) {
      let resp = '';
      try {
        const response = yield call(addLocation, payload);
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        yield put({
          type: 'fetchLocationsList',
          payload: { company: payload.company },
        });
        resp = response;
      } catch (errors) {
        dialog(errors);
      }
      return resp;
    },

    *updateLocation({ payload = {} }, { call, put }) {
      try {
        const response = yield call(updateLocation, payload);
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        yield put({
          type: 'fetchLocationsList',
          payload: { company: payload.company },
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
