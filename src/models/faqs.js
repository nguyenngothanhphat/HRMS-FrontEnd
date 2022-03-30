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
  getLocationListByParentCompany,
} from '../services/faqs';

const faqs = {
  namespace: 'faqs',
  state: {
    listCategory: [],
    listFAQ: [],
    countryList: [],
    selectedCountry: '',
  },
  effects: {
    *addFAQCategory({ payload }, { call, put }) {
      let response;
      try {
        response = yield call(addCategory, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        notification.success({ message: 'Add Category Successfully' });
        yield put({
          type: 'fetchListFAQCategory',
          payload: {
            tenantId: getCurrentTenant(),
            company: getCurrentCompany(),
          },
        });
      } catch (error) {
        dialog(error);
      }
      return response;
    },
    *fetchListFAQCategory({ payload }, { call, put }) {
      let response;
      try {
        response = yield call(getListCategory, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: {
            listCategory: data,
          },
        });
      } catch (error) {
        dialog(error);
      }
      return response;
    },
    *updateFAQCategory({ payload }, { call, put }) {
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
        yield put({
          type: 'fetchListFAQCategory',
          payload: {
            tenantId: getCurrentTenant(),
            company: getCurrentCompany(),
          },
        });
      } catch (error) {
        dialog(error);
      }
      return response;
    },
    *deleteFAQCategory({ payload }, { call, put }) {
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
        yield put({
          type: 'fetchListFAQCategory',
          payload: {
            tenantId: getCurrentTenant(),
            company: getCurrentCompany(),
          },
        });
      } catch (error) {
        dialog(error);
      }
      return response;
    },
    *addQuestion({ payload }, { call, put }) {
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
        yield put({
          type: 'fetchListFAQ',
          payload: {
            tenantId: getCurrentTenant(),
            company: getCurrentCompany(),
          },
        });
      } catch (error) {
        dialog(error);
      }
      return response;
    },
    *fetchListFAQ({ payload }, { call, put }) {
      let response;
      try {
        response = yield call(getListFAQ, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: {
            listFAQ: data,
          },
        });
      } catch (error) {
        dialog(error);
      }
      return response;
    },
    *updateQuestion({ payload }, { call, put }) {
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
        yield put({
          type: 'fetchListFAQ',
          payload: {
            tenantId: getCurrentTenant(),
            company: getCurrentCompany(),
          },
        });
      } catch (error) {
        dialog(error);
      }
      return response;
    },
    *deleteQuestion({ payload }, { call, put }) {
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
        yield put({
          type: 'fetchListFAQ',
          payload: {
            tenantId: getCurrentTenant(),
            company: getCurrentCompany(),
          },
        });
      } catch (error) {
        dialog(error);
      }
      return response;
    },
    *fetchListLocationEffect({ payload }, { call, put }) {
      let response;
      try {
        response = yield call(getLocationListByParentCompany, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { countryList: data },
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
export default faqs;
