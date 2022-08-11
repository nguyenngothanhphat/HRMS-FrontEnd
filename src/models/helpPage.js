import { notification } from 'antd';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import { dialog } from '@/utils/utils';
import {
  addCategory,
  getListCategory,
  updateCategory,
  deleteCategory,
  addQuestion,
  getListFAQ,
  updateQuestion,
  deleteQuestion,
  getListCreator,
} from '../services/helpPage';
import { HELP_TYPE } from '@/utils/helpPage';

const helpPage = {
  namespace: 'helpPage',
  state: {
    helpType: HELP_TYPE.FAQ,
    categoryList: [],
    helpData: [],
    countryList: [],
    selectedCountry: '',
    totalHelpData: 0,
    totalCategory: 0,
    listCreator: [],
  },
  effects: {
    *addHelpCategory({ payload }, { call }) {
      let response;
      try {
        response = yield call(addCategory, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({ message });
      } catch (error) {
        dialog(error);
      }
      return response;
    },
    *fetchHelpCategoryList({ payload }, { call, put }) {
      let response;
      try {
        response = yield call(getListCategory, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data, total } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: {
            categoryList: data,
            totalCategory: total,
          },
        });
      } catch (error) {
        dialog(error);
      }
      return response;
    },

    *updateHelpCategory({ payload }, { call }) {
      let response;
      try {
        response = yield call(updateCategory, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        notification.success({ message: 'Update Category Successfully' });
      } catch (error) {
        dialog(error);
      }
      return response;
    },
    *deleteHelpCategory({ payload }, { call }) {
      let response;
      try {
        response = yield call(deleteCategory, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        notification.success({ message: 'Delete Category Successfully' });
      } catch (error) {
        dialog(error);
      }
      return response;
    },
    *addQuestion({ payload }, { call }) {
      let response;
      try {
        response = yield call(addQuestion, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        notification.success({ message: 'Add question Successfully' });
      } catch (error) {
        dialog(error);
      }
      return response;
    },
    *fetchHelpData({ payload }, { call, put }) {
      let response;
      try {
        response = yield call(getListFAQ, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data, total } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: {
            helpData: data,
            totalHelpData: total || 0,
          },
        });
      } catch (error) {
        dialog(error);
      }
      return response;
    },
    *updateQuestion({ payload }, { call }) {
      let response;
      try {
        response = yield call(updateQuestion, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        notification.success({ message: 'Update FAQ Successfully' });
      } catch (error) {
        dialog(error);
      }
      return response;
    },
    *deleteQuestion({ payload }, { call }) {
      let response;
      try {
        response = yield call(deleteQuestion, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        notification.success({ message: 'Delete question Successfully' });
      } catch (error) {
        dialog(error);
      }
      return response;
    },
    *fetchListCreator(_, { call, put }) {
      let response;
      try {
        response = yield call(getListCreator, {
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { listCreator: data },
        });
      } catch (error) {
        dialog(error);
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
    saveOrigin(state, action) {
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
export default helpPage;
