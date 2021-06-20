import { dialog } from '@/utils/utils';
import {
  getCompaniesList,
  getCompanyDetails,
  updateCompany,
  getLocationsList,
  addLocation,
  addCompanyTenant,
  addMultiLocation,
  updateLocation,
  upsertLocationsList,
  removeLocation,
  getLocationsListTenant,
} from '@/services/companiesManangement';
// import { history } from 'umi';
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
      companyDetails: {
        company: {},
      },
    },
    tempData: {
      companyDetails: {
        company: {},
      },
    },
    idCurrentCompany: '',
    tenantCurrentCompany: '',
    isOpenEditWorkLocation: false,
    selectedNewCompanyTab: 1,
    logoCompany: '',
  },
  effects: {
    *fetchCompanyDetails({ payload = {}, dataTempKept = {} }, { call, put }) {
      try {
        const response = yield call(getCompanyDetails, payload);
        const { statusCode, data: company = {} } = response;
        if (statusCode !== 200) throw response;
        const companyDetails = { company };
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
          payload: { idCurrentCompany: payload.id },
        });
        yield put({
          type: 'saveOrigin',
          payload: { companyDetails },
        });
        yield put({
          type: 'saveTemp',
          payload: { companyDetails: companyDetailsTemp },
        });
        return response;
      } catch (errors) {
        dialog(errors);
        return {};
      }
    },

    *fetchCompaniesList({ payload }, { call, put }) {
      try {
        const response = yield call(getCompaniesList, payload);
        const { statusCode, data = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { companiesList: data.listCompany || [] } });
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

    *fetchLocationsListTenant({ payload: { company = '' } }, { call, put }) {
      try {
        const response = yield call(getLocationsListTenant, { company });
        const { statusCode, data: locationsList = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { locationsList } });
      } catch (errors) {
        dialog(errors);
      }
    },

    *updateCompany(
      { payload = {}, dataTempKept = {}, isAccountSetup = false },
      { put, call, select },
    ) {
      let resp = '';
      try {
        const response = yield call(updateCompany, payload);
        const { idCurrentCompany } = yield select((state) => state.employeeProfile);
        const { statusCode, data: { logoUrl = '' } = {} } = response;
        if (statusCode !== 200) throw response;
        // notification.success({
        //   message,
        // });
        if (!isAccountSetup) {
          yield put({
            type: 'fetchCompanyDetails',
            payload: { id: payload.id, tenantId: payload.tenantId },
            dataTempKept,
          });
          yield put({
            type: 'save',
            payload: { idCurrentCompany },
          });
          yield put({
            type: 'save',
            payload: { logoCompany: logoUrl },
          });
        } else {
          // yield put({
          //   type: 'user/fetchCurrent',
          // });
        }
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

    *addMultiLocation({ payload = {} }, { call }) {
      let resp = '';
      try {
        const response = yield call(addMultiLocation, payload);
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        // yield put({
        //   type: 'fetchLocationsList',
        //   payload: { company: payload.company },
        // });
        resp = response;
      } catch (errors) {
        dialog(errors);
      }
      return resp;
    },

    *addCompanyTenant({ payload = {} }, { call, put }) {
      let response = '';
      try {
        response = yield call(addCompanyTenant, payload);
        const { statusCode, data = {} } = response;
        if (statusCode !== 200) throw response;
        // notification.success({
        //   message: 'New company created.',
        // });

        // yield put({
        //   type: 'fetchLocationsList',
        //   payload: { company: payload },
        // });
        yield put({
          type: 'saveOrigin',
          payload: {
            companyDetails: {
              company: data?.company,
            },
          },
        });
        // history.push('/control-panel');
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *addCompanyReducer({ payload = {} }, { put }) {
      try {
        yield put({
          type: 'saveOrigin',
          payload: { companyDetails: payload },
        });
        yield put({
          type: 'save',
          payload: {
            selectedNewCompanyTab: 2,
          },
        });
      } catch (error) {
        dialog(error);
      }
    },

    *updateLocation({ payload = {} }, { call, put }) {
      let resp = '';
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
        resp = response;
      } catch (errors) {
        dialog(errors);
      }
      return resp;
    },
    *upsertLocationsList({ payload: { locations = [], company = '' } = {} }, { call, put }) {
      try {
        const response = yield call(upsertLocationsList, { locations });
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        yield put({ type: 'fetchLocationsList', payload: { company } });
        yield put({
          type: 'user/fetchCurrent',
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *removeLocation({ payload: { id = '', company = '' } = {} }, { call, put }) {
      try {
        const response = yield call(removeLocation, { id });
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        yield put({ type: 'fetchLocationsList', payload: { company } });
        yield put({
          type: 'user/fetchCurrent',
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
    clearCompanyDetails(state) {
      return {
        ...state,
        originData: {
          companyDetails: {},
        },
        tempData: {
          companyDetails: {},
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

    saveCompanyDetails(state, action) {
      const {
        originData: {
          companyDetails: { company },
        },
        originData = {},
      } = state;
      return {
        ...state,
        originData: {
          ...originData,
          companyDetails: {
            ...originData.companyDetails,
            company: {
              ...company,
              ...action.payload,
            },
          },
        },
      };
    },
  },
};
export default companiesManagement;
