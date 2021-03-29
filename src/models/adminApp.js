import { dialog } from '@/utils/utils';
import { getPermissionList, addNewAdmin } from '../services/adminApp';

const country = {
  namespace: 'adminApp',
  state: {
    permissionList: [],
    newAdmin: {}
  },
  effects: {
    *fetchPermissionList({payload = {}}, { call, put }) {
      try {
        const response = yield call(getPermissionList, payload);
        const { statusCode, data: permissionList = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { permissionList } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *addNewAdmin({payload = {}}, { call, put }) {
        try {
          const response = yield call(addNewAdmin, payload);
          const { statusCode, data: newAdmin = {} } = response;
          if (statusCode !== 200) throw response;
          yield put({ type: 'save', payload: { newAdmin } });
          return response
        } catch (errors) {
          dialog(errors);
          return {}
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
export default country;
