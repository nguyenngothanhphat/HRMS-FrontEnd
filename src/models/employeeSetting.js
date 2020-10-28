import { dialog } from '@/utils/utils';
import { getDefaultTemplateList, getTemplateById } from '../services/employeeSetting';

const employeeSetting = {
  namespace: 'employeeSetting',
  state: {
    defaultTemplateList: [],
    currentTemplate: {},
    tempSettings: [],
    newTemplateData: {
      title: '',
      htmlContent: '',
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
        yield put({ type: 'save', payload: { defaultTemplateList: data } });
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
export default employeeSetting;
