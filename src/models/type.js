import { notification } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import queryType, { saveType } from '@/services/type';
import { dialog, getStatusFromLocation } from '@/utils/utils';

export default {
  namespace: 'type',

  state: {
    list: [],
  },

  effects: {
    *fetch({ payload: options = {} }, { call, put }) {
      try {
        const response = yield call(queryType, { method: 'list', ...options });
        const { data, statusCode } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { list: data },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *saveItem({ payload: item, defaultLocation, pathname }, { call, put }) {
      const data = { ...item, location: defaultLocation };
      try {
        const response = yield call(saveType, data);
        const { statusCode = 400 } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'fetch',
          payload: {
            status: pathname === '/admin/type/disabled' ? 'INACTIVE' : 'ACTIVE',
          },
        });
        notification.success({
          message: formatMessage({ id: 'type.submit.success' }),
        });
        return true;
      } catch (errors) {
        dialog(errors);
        return false;
      }
    },
    *remove({ payload: id }, { call, put }) {
      try {
        const response = yield call(queryType, { method: 'remove', id });
        const { statusCode = 400 } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message: formatMessage({ id: 'type.remove.success' }),
        });
        yield put({ type: 'fetch', payload: { status: getStatusFromLocation('/admin/type') } });
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
  },
};
