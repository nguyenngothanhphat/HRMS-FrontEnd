import { notification } from 'antd';
import { uploadFile } from '@/services/upload';
import { dialog } from '@/utils/utils';

export default {
  namespace: 'upload',

  state: {
    urlImage: '',
  },

  effects: {
    *uploadFile({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(uploadFile, payload);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message: 'Upload Image Successfully',
        });
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
  },
};
