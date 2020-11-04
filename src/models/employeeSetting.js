import { dialog } from '@/utils/utils';
import { notification } from 'antd';
import {
  getDefaultTemplateList,
  getCustomTemplateList,
  getTemplateById,
  uploadSignature,
  addCustomTemplate,
  removeTemplate,
} from '../services/employeeSetting';

const employeeSetting = {
  namespace: 'employeeSetting',
  state: {
    defaultTemplateList: [],
    customTemplateList: [],
    currentTemplate: {},
    tempSettings: [],
    newTemplate: {},
    newTemplateData: {
      settings: [],
      fullname: '',
      signature: '',
      designation: '',
    },
  },
  effects: {
    *fetchDefaultTemplateList(_, { call, put }) {
      try {
        const response = yield call(getDefaultTemplateList);
        const { statusCode, data } = response;
        console.log(response);
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { defaultTemplateList: data },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchCustomTemplateList(_, { call, put }) {
      try {
        const response = yield call(getCustomTemplateList);
        const { statusCode, data } = response;
        console.log(response);
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { customTemplateList: data, loadingCustomTemplateList: false },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchTemplateById({ payload = {} }, { call, put }) {
      try {
        const response = yield call(getTemplateById, payload);
        const { statusCode, data } = response;
        console.log(response);
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { currentTemplate: data } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *removeTemplateById({ payload = {} }, { call, put }) {
      try {
        const response = yield call(removeTemplate, payload);
        console.log(payload);
        const { statusCode, data } = response;
        console.log(response);
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { currentTemplate: data } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *uploadFile({ payload, isUploadSignature = false }, { call, put }) {
      let response = {};
      try {
        response = yield call(uploadSignature, payload);
        const { statusCode, data } = response;
        console.log('data', data);
        if (statusCode !== 200) throw response;
        if (!isUploadSignature) {
          notification.success({
            message: 'Upload Image Successfully',
          });
        }
        yield put({
          type: 'saveTemplate',
          payload: { signature: data[0].id },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *addCustomTemplate({ payload = {} }, { call, put }) {
      try {
        const response = yield call(addCustomTemplate, payload);
        const { statusCode, data } = response;
        console.log(response);
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { newTemplate: data } });
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
    saveTemplate(state, action) {
      const { newTemplateData } = state;

      return {
        ...state,
        newTemplateData: {
          ...newTemplateData,
          ...action.payload,
        },
      };
    },
    saveCurrentTemplate(state, action) {
      const { currentTemplate } = state;
      return {
        ...state,
        currentTemplate: {
          ...currentTemplate,
          ...action.payload,
        },
      };
    },
    saveEmployeeSetting(state, action) {
      const { newTemplateData } = state;
      return {
        ...state,
        newTemplateData: {
          ...newTemplateData,
          ...action.payload,
        },
      };
    },
  },
};
export default employeeSetting;
