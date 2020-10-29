import { notification } from 'antd';
import { uploadFile } from '@/services/upload';
import { dialog } from '@/utils/utils';
import employeeSetting from './employeeSetting';

export default {
  namespace: 'upload',

  state: {
    urlImage: '',
    employeeInformationURL: '',
    passPortURL: '',
    passPortIDURL: '',
    visa0URL: '',
    visa0IDURL: '',
    visa1URL: '',
    visa1IDURL: '',
  },

  effects: {
    *uploadFile({ payload, isUploadAvatar = false }, { call, put }) {
      let response = {};
      try {
        response = yield call(uploadFile, payload);
        const { statusCode, data } = response;
        console.log('data', data);
        if (statusCode !== 200) throw response;
        if (!isUploadAvatar) {
          notification.success({
            message: 'Upload Image Successfully',
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
    *uploadFileCard({ payload, name, isUploadAvatar = false }, { call, put }) {
      let response = {};
      try {
        response = yield call(uploadFile, payload);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        if (!isUploadAvatar) {
          notification.success({
            message: 'Upload Image Successfully',
          });
        }
        switch (name) {
          case 'adhaarCard':
            yield put({
              type: 'save',
              payload: { employeeInformationURL: data[0].url },
            });
            break;
          case 'passport':
            yield put({
              type: 'save',
              payload: { passPortURL: data[0].url, passPortIDURL: data[0].id },
            });
            break;
          case 'visa0':
            yield put({
              type: 'save',
              payload: { visa0URL: data[0].url, visa0IDURL: data[0].id },
            });
            break;
          case 'visa1':
            yield put({
              type: 'save',
              payload: { visa1URL: data[0].url, visa1IDURL: data[0].id },
            });
            break;

          default:
            break;
        }
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
    cancelUpload(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
