import { notification } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import { query } from '@/services/potential';
import { dialog } from '@/utils/utils';

export default {
  namespace: 'potential',

  state: {
    list: [],
  },

  effects: {
    *matching({ payload }, { call }) {
      try {
        const res = yield call(query, payload);
        const { statusCode } = res;
        if (statusCode !== 200) throw res;
        notification.success({
          message: formatMessage({ id: 'potential.match.success' }),
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
  },
};
