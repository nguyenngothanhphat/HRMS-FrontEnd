import { dialog } from '@/utils/utils';
import {
  getGeneralInfo,
  getCompensation,
  getListSkill,
  updateGeneralInfo,
  getListTitle,
  addCertification,
  updateCertification,
  getEmploymentInfo,
} from '@/services/employeeProfiles';
import { notification } from 'antd';

const employeeProfile = {
  namespace: 'employeeProfile',
  state: {
    isModified: false,
    idCurrentEmployee: '',
    listSkill: [],
    listTitle: [],
    originData: {
      generalData: {},
      compensationData: {},
      employmentData: {},
    },
    tempData: {
      generalData: {},
      compensationData: {},
    },
  },
  effects: {
    *fetchGeneralInfo({ payload: { employee = '' }, dataTempKept = {} }, { call, put }) {
      try {
        const response = yield call(getGeneralInfo, { employee });
        const { statusCode, data: generalData = {} } = response;
        if (statusCode !== 200) throw response;
        const checkDataTempKept = JSON.stringify(dataTempKept) === JSON.stringify({});
        let generalDataTemp = { ...generalData };
        if (!checkDataTempKept) {
          generalDataTemp = { ...generalDataTemp, ...dataTempKept };
          delete generalDataTemp.updatedAt;
          delete generalData.updatedAt;
          const isModified = JSON.stringify(generalDataTemp) !== JSON.stringify(generalData);
          yield put({
            type: 'save',
            payload: { isModified },
          });
        }
        yield put({
          type: 'save',
          payload: { idCurrentEmployee: employee },
        });
        yield put({
          type: 'saveOrigin',
          payload: { generalData },
        });
        yield put({
          type: 'saveTemp',
          payload: { generalData: generalDataTemp },
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
    *updateGeneralInfo({ payload = {}, dataTempKept = {} }, { put, call, select }) {
      try {
        const response = yield call(updateGeneralInfo, payload);
        const { idCurrentEmployee } = yield select((state) => state.employeeProfile);
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        yield put({
          type: 'fetchGeneralInfo',
          payload: { employee: idCurrentEmployee },
          dataTempKept,
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchListTitle(_, { call, put }) {
      try {
        const response = yield call(getListTitle);
        const { statusCode, data: listTitle = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { listTitle } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *addCertification({ payload }, { call }) {
      try {
        const response = yield call(addCertification, payload);
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
      } catch (errors) {
        dialog(errors);
      }
    },
    *updateCertification({ payload }, { call }) {
      try {
        const response = yield call(updateCertification, payload);
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchEmploymentInfo({ payload: id = '' }, { call, put }) {
      try {
        const response = yield call(getEmploymentInfo, { id });
        const { data, statusCode } = response;
        yield put({ type: 'saveOrigin', payload: { employmentData: data } });
        if (statusCode !== 200) throw response;
      } catch (error) {
        dialog(error.message);
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
