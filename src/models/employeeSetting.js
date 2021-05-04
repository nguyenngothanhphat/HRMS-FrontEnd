/* eslint-disable no-alert */
/* eslint-disable no-console */
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
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
  getLocationList,
  getDepartmentList,
  getTitleList,
  getEmployeeTypeList,
  uploadSignature,
  addCustomTemplate,
  removeTemplate,
  getListAutoField,
  addCustomEmail,
  getListCustomEmailOnboarding,
  getListCustomEmailOffboarding,
  getCustomEmailInfo,
  deleteCustomEmailItem,
  updateCustomEmail,
} from '../services/employeeSetting';

const employeeSetting = {
  namespace: 'employeeSetting',
  state: {
    triggerEventList: [],
    optionalQuestions: [],
    isAbleToSubmit: false,
    defaultTemplateListOnboarding: [],
    customTemplateListOnboarding: [],
    defaultTemplateListOffboarding: [],
    customTemplateListOffboarding: [],
    currentTemplate: {},
    tempSettings: [],
    newTemplate: {},
    newTemplateData: {
      settings: [],
      fullname: '',
      signature: '',
      designation: '',
    },
    locationList: [],
    departmentList: [],
    titleList: [],
    employeeTypeList: [],
    departmentListByCompanyId: [],
    listAutoField: [],
    dataSubmit: {},
    listCustomEmailOnboarding: [],
    listCustomEmailOffboarding: [],
    emailCustomData: {},
  },
  effects: {
    *fetchDefaultTemplateListOnboarding({ payload = {} }, { call, put }) {
      try {
        const response = yield call(getDefaultTemplateList, payload);
        const { statusCode, data } = response;
        console.log(response);
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: {
            // defaultTemplateListOnboarding: data.filter((value) =>
            //   value.type.includes('ON_BOARDING'),
            // ),
            defaultTemplateListOnboarding: data,
          },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchCustomTemplateListOnboarding({ payload = {} }, { call, put }) {
      try {
        const response = yield call(getCustomTemplateList, payload);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: {
            customTemplateListOnboarding: data,
            loadingCustomTemplateList: false,
          },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchDefaultTemplateListOffboarding({ payload = {} }, { call, put }) {
      try {
        const response = yield call(getDefaultTemplateList, payload);
        const { statusCode, data } = response;
        console.log(response);
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: {
            defaultTemplateListOffboarding: data.filter((value) =>
              value.type.includes('OFF_BOARDING'),
            ),
          },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchCustomTemplateListOffboarding({ payload = {} }, { call, put }) {
      try {
        const response = yield call(getCustomTemplateList, payload);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: {
            customTemplateListOffboarding: data.filter((value) =>
              value.type.includes('OFF_BOARDING'),
            ),
            loadingCustomTemplateList: false,
          },
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
        return statusCode;
      } catch (errors) {
        dialog(errors);
        return 0;
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
        return statusCode;
      } catch (errors) {
        dialog(errors);
        return 0;
      }
    },
    *fetchOptionalQuestions({ payload = {} }, { call, put }) {
      try {
        const response = yield call(getOptionalQuestions, payload);
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
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { triggerEventList: data } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchLocationList({ payload = {} }, { call, put }) {
      let response;
      try {
        response = yield call(getLocationList, payload);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { locationList: data } });
        return data;
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *fetchDepartmentList(_, { call, put }) {
      let response;
      try {
        response = yield call(getDepartmentList, {
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { departmentList: data } });
        return data;
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *fetchTitleList(_, { call, put }) {
      let response;
      try {
        response = yield call(getTitleList, {
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { titleList: data } });
        return data;
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *fetchEmployeeTypeList({ payload = {} }, { call, put }) {
      let response;
      try {
        response = yield call(getEmployeeTypeList, payload);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { employeeTypeList: data } });
        return data;
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *fetchDepartmentListByCompanyId({ payload = {} }, { call, put }) {
      let response;
      try {
        response = yield call(getDepartmentList, payload);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { departmentListByCompanyId: data },
        });
        return data;
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *fetchListAutoField(_, { call, put }) {
      let response;
      try {
        response = yield call(getListAutoField);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { listAutoField: data } });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *addCustomEmail({ payload = {} }, { call, put }) {
      let response;
      try {
        response = yield call(addCustomEmail, payload);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message: response.status,
          description: response.message,
        });
        yield put({
          type: 'save',
          payload: { dataSubmit: data },
        });
        return data;
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *fetchListCustomEmailOnboarding({ payload = {} }, { call, put }) {
      let response;
      try {
        response = yield call(getListCustomEmailOnboarding, payload);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { listCustomEmailOnboarding: data } });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },

    *fetchListCustomEmailOffboarding({ payload = {} }, { call, put }) {
      let response;
      try {
        response = yield call(getListCustomEmailOffboarding, payload);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { listCustomEmailOffboarding: data } });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },

    *fetchEmailCustomInfo({ payload = {} }, { call, put }) {
      let response;
      try {
        response = yield call(getCustomEmailInfo, payload);
        const { data: emailCustomData, statusCode } = response;
        yield put({ type: 'save', payload: { emailCustomData } });
        if (statusCode !== 200) throw response;
      } catch (error) {
        dialog(error.message);
      }
      return response;
    },
    *deleteCustomEmailItem({ payload = {} }, { call, put }) {
      let response;
      try {
        response = yield call(deleteCustomEmailItem, payload);
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'fetchListCustomEmailOnboarding',
          payload: { tenantId: payload.tenantId },
        });
        yield put({
          type: 'fetchListCustomEmailOffboarding',
          payload: { tenantId: payload.tenantId },
        });
        notification.success({
          message: response.status,
          description: response.message,
        });
      } catch (error) {
        dialog(error);
      }
      return response;
    },
    *updateCustomEmail({ payload = {} }, { call, put }) {
      try {
        const response = yield call(updateCustomEmail, payload);
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: {},
        });
        notification.success({
          message: response.status,
          description: response.message,
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
