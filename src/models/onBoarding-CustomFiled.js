import { dialog } from '@/utils/utils';
import { notification } from 'antd';
import { addNewSection, getSection, addNewFieldSection } from '../services/onBoarding-CustomFiled';

const custormField = {
  namespace: 'custormField',
  state: {
    section: [{}],
  },
  effects: {
    *fetchSection(_, { call, put }) {
      try {
        const response = yield call(getSection);
        const { statusCode, data: section = [] } = response;
        if (statusCode !== 200) throw response;
        // notification.success({
        //   message,
        // });
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { section } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *addSection({ payload: { name = '', filters = [], settings = {} } = {} }, { call, put }) {
      let getMesg = '';
      try {
        const response = yield call(addNewSection, { name, filters, settings });
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        if (statusCode !== 200) throw response;
        yield put({ type: 'fetchSection' });
        getMesg = message;
      } catch (errors) {
        dialog(errors);
      }
      return getMesg;
    },
    *addSectionField(
      {
        payload: {
          section = '',
          prompt = '',
          helpText = '',
          helpMedia = '',
          filters = [],
          settings = {},
        } = {},
      },
      { call },
    ) {
      try {
        const response = yield call(addNewFieldSection, {
          section,
          prompt,
          helpText,
          helpMedia,
          filters,
          settings,
        });
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        if (statusCode !== 200) throw response;
        // yield put({ type: 'fetchSection' });
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
export default custormField;
