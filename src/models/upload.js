import { notification } from 'antd';
import { uploadFile } from '@/services/upload';
import { dialog } from '@/utils/utils';

export default {
  namespace: 'upload',

  state: {
    urlImage: '',
    employeeInformationURL: '',
    passPortURL: '',
    visa0URL: '',
    visa1URL: '',
  },

  effects: {
    *uploadFile({ payload, isUploadAvatar = false }, { call, put }) {
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
        console.log(name);
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
              payload: { passPortURL: data[0].url },
            });
            break;
          case 'visa0':
            yield put({
              type: 'save',
              payload: { visa0URL: data[0].url },
            });
            break;
          case 'visa1':
            yield put({
              type: 'save',
              payload: { visa1URL: data[0].url },
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
