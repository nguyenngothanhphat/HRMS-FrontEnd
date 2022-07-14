import { notification } from 'antd';
import { uploadFile } from '@/services/upload';
import { dialog } from '@/utils/utils';
// import employeeSetting from './employeeSetting';

export default {
  namespace: 'upload',

  state: {
    urlImage: '',
    employeeInformationURL: '',
    passPortURL: '',
    passPortIDURL: '',
    passport0URL: '',
    visa0URL: '',
    visa0IDURL: '',
    passport1URL: '',
    visa1URL: '',
    visa1IDURL: '',
    loadingPassPort: false,
    loadingVisa: false,
    loadingVisaTest: [],
    loadingPassportTest: [],
  },

  effects: {
    *uploadFile({ payload, name, index, showNotification = true }, { call, put }) {
      let response = {};
      switch (name) {
        case 'passport':
          yield put({
            type: 'save',
            payload: { loadingPassPort: true },
          });
          yield put({
            type: 'saveLoadingPassport',
            payload: index,
          });
          break;
        case 'visa':
          yield put({
            type: 'saveLoadingVisa',
            payload: index,
          });
          break;

        default:
          break;
      }
      try {
        response = yield call(uploadFile, payload);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        if (showNotification) {
          notification.success({
            message: 'Upload File Successfully',
          });
        }
        yield put({
          type: 'save',
          payload: { urlImage: data[0].url },
        });
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
    saveLoadingPassport(state, action) {
      const { loadingPassportTest } = state;
      const getValuesLoading = [...loadingPassportTest];
      const index = action.payload;
      getValuesLoading.splice(index, 1, true);
      return {
        ...state,
        loadingPassportTest: getValuesLoading,
      };
    },
    saveLoadingVisa(state, action) {
      const { loadingVisaTest } = state;
      const getValuesLoading = [...loadingVisaTest];
      const index = action.payload;
      getValuesLoading.splice(index, 1, true);
      return {
        ...state,
        loadingVisaTest: getValuesLoading,
      };
    },
    cancelUpload(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
