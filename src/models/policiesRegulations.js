import { notification } from 'antd';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import { dialog } from '@/utils/utils';
import {
  addCategory,
  getListCategory,
  updateCategory,
  deleteCategory,
  addPolicy,
  getListPolicy,
  updatePolicy,
  deletePolicy,
  searchNamePolicy,
  getLocationByCompany,
  uploadFile,
} from '../services/policiesRegulations';

const policiesRegulations = {
  namespace: 'policiesRegulations',
  state: {
    listCategory: [],
    listPolicy: [],
    listEmployee: [],
    countryList: [],
    tempData: {
      selectedCountry: '',
    },
  },
  effects: {
    *addCategory({ payload }, { call, put }) {
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
          type: 'fetchListCategory',
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
    *fetchListCategory({ payload }, { call, put }) {
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
    *updateCategory({ payload }, { call, put }) {
      let response;
      try {
        response = yield call(updateCategory, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        notification.success({ message: 'Update Category Successfully' });
        yield put({
          type: 'save',
          payload: {
            listCategory: data,
          },
        });
        yield put({
          type: 'fetchListCategory',
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
    *deleteCategory({ payload }, { call, put }) {
      let response;
      try {
        response = yield call(deleteCategory, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        notification.success({ message: 'Delete Category Successfully' });
        yield put({
          type: 'save',
          payload: {
            listCategory: data,
          },
        });
        yield put({
          type: 'fetchListCategory',
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
    *addPolicy({ payload }, { call, put }) {
      let response;
      try {
        response = yield call(addPolicy, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { listPolicy } = yield select((state) => state.employeeProfile);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;

        //  yield put({
        //    type: 'save',
        //    payload: {
        //      listPolicy: [...listPolicy,...data],
        //    },
        //  });
      } catch (error) {
        dialog(error);
      }
      return response;
    },
    *fetchListPolicy({ payload }, { call, put }) {
      let response;
      try {
        response = yield call(getListPolicy, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: {
            listPolicy: data,
          },
        });
      } catch (error) {
        dialog(error);
      }
      return response;
    },
    *updatePolicy({ payload }, { call, put }) {
      let response;
      try {
        response = yield call(updatePolicy, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        notification.success({ message: 'Update Policy Successfully' });
        yield put({
          type: 'save',
          payload: {
            listPolicy: data,
          },
        });
      } catch (error) {
        dialog(error);
      }
      return response;
    },
    *deletePolicy({ payload }, { call, put }) {
      let response;
      try {
        response = yield call(deletePolicy, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        notification.success({ message: 'Delete Policy Successfully' });
        yield put({
          type: 'save',
          payload: {
            listPolicy: data,
          },
        });
      } catch (error) {
        dialog(error);
      }
      return response;
    },
    *uploadFileAttachments({ payload }, { call }) {
      let response = {};
      try {
        response = yield call(uploadFile, payload);
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message: 'Upload File Successfully',
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *searchNamePolicy({ payload }, { call, put }) {
      try {
        const response = yield call(searchNamePolicy, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { listPolicy: data },
        });
      } catch (error) {
        dialog(error);
      }
    },

    *getCountryListByCompany({ payload = {} }, { call, put }) {
      let response = {};
      try {
        response = yield call(getLocationByCompany, payload);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { countryList: data },
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
export default policiesRegulations;
