import { dialog } from '@/utils/utils';
import { notification } from 'antd';
import {
  getDefaultTemplateList,
  getCustomTemplateList,
  getTemplateById,
  getOptionalQuestions,
  saveOptionalQuestions,
  updateOptionalQuestions,
  getTriggerEventList,
  uploadSignature,
  addCustomTemplate,
  removeTemplate,
} from '../services/employeeSetting';

const employeeSetting = {
  namespace: 'employeeSetting',
  state: {
    triggerEventList: [],
    optionalQuestions: [],
    isAbleToSubmit: false,
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
        if (data.length > 0) {
          yield put({
            type: 'saveTemplate',
            payload: { signature: data[0].id },
          });
        } else {
          yield put({
            type: 'saveTemplate',
            payload: { signature: '' },
          });
        }
      } catch (errors) {
        dialog(errors);
        alert(errors);
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
    *fetchOptionalQuestions(_, { call, put }) {
      try {
        const response = yield call(getOptionalQuestions);
        const { statusCode, data } = response;
        console.log(response);
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { optionalQuestions: data },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *updateOptionalQuestions({ payload = {} }, { call, put }) {
      try {
        const response = yield call(updateOptionalQuestions, payload);
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: {},
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *saveOptionalQuestions({ payload = {} }, { call, put }) {
      let response = {};
      try {
        response = yield call(saveOptionalQuestions, payload);
        const { statusCode } = response;
        console.log(response);
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: {},
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *fetchTriggerEventList(_, { call, put }) {
      try {
        const response = yield call(getTriggerEventList);
        const { statusCode, data } = response;
        console.log(response);
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { triggerEventList: data } });
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
