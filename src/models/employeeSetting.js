/* eslint-disable no-alert */
/* eslint-disable no-console */
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import { dialog } from '@/utils/utils';
import { notification } from 'antd';
import { history } from 'umi';
import {
  getDefaultTemplateList,
  getCustomTemplateList,
  getTemplateById,
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
  // form off boarding
  getFormOffBoardingList,
  getFormOffBoardingById,
  updateFormOffBoarding,
  addFormOffBoarding,
  removeFormOffBoardingById,

  // optional on boarding question
  getListOptionalOnboardQuestions,
  removeOptionalOnboardQuestions,
  updateOptionalOnboardQuestions,
  addOptionalOnboardQuestions,
} from '../services/employeeSetting';

const employeeSetting = {
  namespace: 'employeeSetting',
  state: {
    triggerEventList: [],
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
    listDefaultCustomEmailOnboarding: [],
    listCustomEmailOffboarding: [],
    emailCustomData: {},
    // form off boarding
    formOffBoardingList: [],
    currentFormOffBoarding: {
      settings: [],
    },
    // optional on boarding question
    optionalOnboardQuestionList: [],
  },
  effects: {
    // =================== optional on boarding question
    *fetchListOptionalOnboardQuestions({ payload = {} }, { call, put }) {
      try {
        const response = yield call(getListOptionalOnboardQuestions, payload);
        const { statusCode, data: optionalOnboardQuestionList = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: { optionalOnboardQuestionList },
        });
        return optionalOnboardQuestionList;
      } catch (errors) {
        // dialog(errors);
        return {};
      }
    },

    *updateOptionalOnboardQuestions({ payload = {} }, { call, put }) {
      try {
        const response = yield call(updateOptionalOnboardQuestions, {
          tenantId: getCurrentTenant(),
          id: payload._id,
          ...payload,
        });
        const { statusCode, data: optionalOnboardQuestion = {} } = response;

        if (statusCode !== 200) throw response;
        notification.success({
          message: `Update the question successfully!`,
          duration: 3,
        });
        yield put({
          type: 'updateQuestion',
          payload: optionalOnboardQuestion,
        });
        return response;
      } catch (errors) {
        // dialog(errors);
        return {};
      }
    },

    *addOptionalOnboardQuestions({ payload = {} }, { call, put }) {
      try {
        const response = yield call(addOptionalOnboardQuestions, {
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
          ...payload,
        });
        const { statusCode, data: optionalOnboardQuestion = {} } = response;

        if (statusCode !== 200) throw response;
        notification.success({
          message: `Add the question successfully!`,
          duration: 3,
        });
        yield put({
          type: 'saveQuestion',
          payload: optionalOnboardQuestion,
        });
        return response;
      } catch (errors) {
        // dialog(errors);
        return {};
      }
    },

    *removeOptionalOnboardQuestions({ payload = {} }, { call, put }) {
      try {
        const response = yield call(removeOptionalOnboardQuestions, {
          tenantId: getCurrentTenant(),
          id: payload._id,
          ...payload,
        });
        const { statusCode, data: optionalOnboardQuestion = {} } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message: `Remove the question successfully!`,
          duration: 3,
        });
        yield put({
          type: 'removeQuestion',
          payload: optionalOnboardQuestion,
        });
        return response;
      } catch (errors) {
        // dialog(errors);
        return {};
      }
    },

    // ===================  Form off boarding
    *fetchFormOffBoardingList({ payload = {} }, { call, put }) {
      try {
        const response = yield call(getFormOffBoardingList, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: {
            formOffBoardingList: data,
          },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *getFormOffBoardingById({ payload = {} }, { call, put }) {
      try {
        const response = yield call(getFormOffBoardingById, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: {
            currentFormOffBoarding: {
              ...data[0],
              department: data[0]?.department?._id,
              departmentName: data[0]?.department?.name,
            },
          },
        });

        return statusCode;
      } catch (errors) {
        dialog(errors);
        return 0;
      }
    },
    *removeFormOffBoardingById({ payload = {} }, { call, put }) {
      try {
        const response = yield call(removeFormOffBoardingById, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message: 'Remove form successfully',
        });

        yield put({ type: 'saveRemoveFormOffBoardingById', payload: data });
        return statusCode;
      } catch (errors) {
        dialog(errors);
        return 0;
      }
    },

    *addFormOffBoarding({ payload = {} }, { call, put }) {
      try {
        const response = yield call(addFormOffBoarding, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { currentFormOffBoarding: data } });
        notification.success({
          message: 'Add new custom form successfully',
        });
        history.push(`/offboarding/forms/${data._id}/view`);
        return statusCode;
      } catch (errors) {
        dialog(errors);
        return 0;
      }
    },

    *updateFormOffBoarding({ payload = {} }, { call, put }) {
      try {
        const response = yield call(updateFormOffBoarding, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { currentFormOffBoarding: data } });
        notification.success({
          message: 'Update form successfully',
        });
        history.push(`/offboarding/forms/${data._id}/view`);
        return statusCode;
      } catch (errors) {
        dialog(errors);
        return 0;
      }
    },

    *fetchDefaultTemplateListOnboarding({ payload = {} }, { call, put }) {
      try {
        const response = yield call(getDefaultTemplateList, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
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
        const response = yield call(getCustomTemplateList, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
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
        const response = yield call(getDefaultTemplateList, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
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
        const response = yield call(getCustomTemplateList, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
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
        const response = yield call(getTemplateById, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
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
        const response = yield call(removeTemplate, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        console.log({ ...payload, company: getCurrentCompany(), tenantId: getCurrentTenant() });
        const { statusCode, data } = response;
        console.log(response);
        if (statusCode !== 200) throw response;
        notification.success({
          message: 'Remove template successfully',
        });
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
        response = yield call(uploadSignature, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
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
        const response = yield call(addCustomTemplate, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
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
    *fetchTriggerEventList({ payload }, { call, put }) {
      try {
        const response = yield call(getTriggerEventList, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
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
        response = yield call(getLocationList, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
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
        response = yield call(getEmployeeTypeList, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
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
        response = yield call(getDepartmentList, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
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
        response = yield call(addCustomEmail, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
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
        response = yield call(getListCustomEmailOnboarding, {
          ...payload,
          type: 'ON-BOARDING',
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { listCustomEmailOnboarding: data } });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    // *fetchListDefaultCustomEmailByCompany({ payload = {} }, { call, put }) {
    //   let response;
    //   try {
    //     response = yield call(getListDefaultCustomEmailByCompany, {...payload, company: getCurrentCompany(), tenantId: getCurrentTenant()});
    //     const { statusCode, data } = response;
    //     if (statusCode !== 200) throw response;
    //     yield put({ type: 'save', payload: { listDefaultCustomEmailOnboarding: data } });
    //   } catch (errors) {
    //     dialog(errors);
    //   }
    //   return response;
    // },
    *fetchListCustomEmailOffboarding({ payload = {} }, { call, put }) {
      let response;
      try {
        response = yield call(getListCustomEmailOffboarding, {
          ...payload,
          type: 'OFF-BOARDING',
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
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
        response = yield call(getCustomEmailInfo, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
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
        response = yield call(deleteCustomEmailItem, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'fetchListCustomEmailOnboarding',
          payload: { default: false },
        });
        yield put({
          type: 'fetchListCustomEmailOffboarding',
          payload: { default: false },
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
        const response = yield call(updateCustomEmail, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
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

    // ========== optional on boarding question
    saveQuestion(state, action) {
      return {
        ...state,
        optionalOnboardQuestionList: [action.payload, ...state.optionalOnboardQuestionList],
      };
    },

    removeQuestion(state, action) {
      const { optionalOnboardQuestionList } = state;
      const indexOfQuestion = optionalOnboardQuestionList.findIndex(
        (item) => item._id === action.payload._id,
      );

      if (indexOfQuestion > -1) {
        return {
          ...state,
          optionalOnboardQuestionList: [
            ...optionalOnboardQuestionList.slice(0, indexOfQuestion),
            ...optionalOnboardQuestionList.slice(indexOfQuestion + 1),
          ],
        };
      }
      return state;
    },

    updateQuestion(state, action) {
      const { optionalOnboardQuestionList } = state;
      const indexOfQuestion = optionalOnboardQuestionList.findIndex(
        (item) => item._id === action.payload._id,
      );

      if (indexOfQuestion > -1) {
        return {
          ...state,
          optionalOnboardQuestionList: [
            ...optionalOnboardQuestionList.slice(0, indexOfQuestion),
            action.payload,
            ...optionalOnboardQuestionList.slice(indexOfQuestion + 1),
          ],
        };
      }
      return state;
    },
    // remove form item by id
    saveRemoveFormOffBoardingById(state, action) {
      const { _id } = action.payload;
      const { formOffBoardingList } = state;
      const indexOfForm = formOffBoardingList.findIndex((item) => item._id === _id);

      return {
        ...state,
        formOffBoardingList: [
          ...formOffBoardingList.slice(0, indexOfForm),
          ...formOffBoardingList.slice(indexOfForm + 1),
        ],
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
