import { fetch, add, deleteField } from '@/services/customField';
import { dialog } from '@/utils/utils';

export default {
  namespace: 'customField',

  state: {
    listCustomField: [],
  },

  effects: {
    *fetch(_, { put, call }) {
      try {
        const response = yield call(fetch);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: {
            listCustomField: data,
          },
        });
      } catch (error) {
        dialog(error);
      }
    },
    *add({ payload }, { put, call }) {
      let addCustomField;
      try {
        const response = yield call(add, payload);
        const { data, statusCode } = response;
        if (statusCode !== 200) throw response;
        addCustomField = data;
        yield put({
          type: 'fetch',
        });
      } catch (errors) {
        dialog(errors);
      }
      return addCustomField;
    },
    *deleteCustomField(payload, { put, call }) {
      let deleteCustomField;
      try {
        const response = yield call(deleteField, payload);
        const { data, statusCode } = response;
        if (statusCode !== 200) throw response;
        deleteCustomField = data;
        yield put({
          type: 'fetch',
        });
      } catch (errors) {
        dialog(errors);
      }
      return deleteCustomField;
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
