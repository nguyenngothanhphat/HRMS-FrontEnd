import { notification } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import { fetch, uploadImage, submit, uploadAvatar } from '@/services/appearance';
import { suiteEdition } from '@/services/signup';
import { dialog } from '@/utils/utils';

export default {
  namespace: 'setting',

  state: {
    item: false,
    urlImage: undefined,
    locationLimit: false,
  },

  effects: {
    *fetch(_, { put, call }) {
      try {
        const response = yield call(fetch);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { item: data },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *update({ payload }, { put, call }) {
      try {
        const response = yield call(submit, payload);
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message: formatMessage({ id: 'setting.submit.success' }),
        });
        yield put({ type: 'fetch' });
      } catch (errors) {
        dialog(errors);
      }
    },
    *uploadAvatar({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(uploadAvatar, payload);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        // notification.success({
        //   message: formatMessage({ id: 'image.upload.success' }),
        // });
        yield put({
          type: 'save',
          payload: { urlImage: data[0].url },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *uploadImage({ payload }, { call }) {
      let response = {};
      try {
        response = yield call(uploadImage, payload);
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message: formatMessage({ id: 'image.upload.success' }),
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *getSuiteEdition({ payload }, { call, put }) {
      try {
        const response = yield call(suiteEdition, payload);
        const {
          statusCode,
          data: { locationLimit = 0 },
        } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { locationLimit },
        });
      } catch (err) {
        dialog(err);
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
  },
};
