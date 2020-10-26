import { dialog } from '@/utils/utils';
import { getListRoles, getListTitle } from '../services/adminSetting';

const adminSetting = {
  namespace: 'adminSetting',
  state: {
    originData: {
      listTitle: [],
      listRoles: [],
    },
    tempData: {
      listTitle: [],
      formatData: [],
    },
  },
  effects: {
    *fetchListRoles(_, { call, put }) {
      try {
        const response = yield call(getListRoles);
        const { statusCode, data: listRoles = [] } = response;
        const formatData = listRoles.map((item) => {
          const { _id: RolesID, name: Rolesname } = item;
          return { RolesID, Rolesname };
        });
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { listRoles } });
        yield put({ type: 'saveTemp', payload: { formatData } });
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
        yield put({ type: 'saveTemp', payload: { listTitle } });
      } catch (errors) {
        dialog(errors);
      }
    },
  },
  reducers: {
    save(state, action) {
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
export default adminSetting;
