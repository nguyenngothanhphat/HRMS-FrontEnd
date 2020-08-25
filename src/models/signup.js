import router from 'umi/router';
import { formatMessage } from 'umi-plugin-react/locale';
import { notification } from 'antd';
import AccountSignup, {
  validAdmin,
  validCompany,
  validLocation,
  signupAdmin,
} from '@/services/signup';
import { dialog } from '@/utils/utils';

export default {
  namespace: 'signup',

  state: {
    message: undefined,
    statusCode: 200,
    validAdmin: false,
    validCompany: false,
    validLocation: false,
    signupSuccessful: false,
    signupData: {},
  },

  effects: {
    *signup({ payload }, { call, put }) {
      try {
        const response = yield call(AccountSignup, payload);
        const { statusCode } = response;
        yield put({
          type: 'save',
          payload: response,
        });
        if (statusCode !== 200) throw response;
        notification.success({
          message: formatMessage({ id: 'user.sigin.success' }),
        });
        yield call(router.push, '/login');
      } catch (errors) {
        dialog(errors);
      }
    },
    *validAdmin({ payload }, { call, put }) {
      try {
        const response = yield call(validAdmin, payload);
        const { statusCode, message } = response;
        if (statusCode !== 200) {
          yield put({
            type: 'save',
            payload: { validAdmin: false },
          });
          throw response;
        }
        notification.success({
          message,
        });
        yield put({
          type: 'save',
          payload: { validAdmin: true },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *validCompany({ payload }, { call, put }) {
      try {
        const response = yield call(validCompany, payload);
        const { statusCode, message } = response;
        if (statusCode !== 200) {
          yield put({
            type: 'save',
            payload: { validCompany: false },
          });
          throw response;
        }
        notification.success({
          message,
        });
        yield put({
          type: 'save',
          payload: { validCompany: true },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *validLocation({ payload }, { call, put }) {
      try {
        const response = yield call(validLocation, payload);
        const { statusCode, message } = response;
        if (statusCode !== 200) {
          yield put({
            type: 'save',
            payload: { validLocation: false },
          });
          throw response;
        }
        notification.success({
          message,
        });
        yield put({
          type: 'save',
          payload: { validLocation: true, signupSuccessful: false },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *onSignupAdmin({ payload }, { call, put }) {
      try {
        const response = yield call(signupAdmin, payload);
        const { statusCode, message, data } = response;
        if (statusCode !== 200) {
          yield put({
            type: 'save',
            payload: { validAdmin: false, validCompany: false, signupSuccessful: false },
          });
          throw response;
        }
        notification.success({
          message,
        });
        yield put({
          type: 'save',
          payload: {
            signupSuccessful: true,
            signupData: data,
          },
        });
      } catch (err) {
        dialog(err);
      }
    },
    *resetData(_, { put }) {
      try {
        yield put({
          type: 'save',
          payload: {
            validAdmin: false,
            validCompany: false,
            validLocation: false,
            signupSuccessful: false,
            signupData: {},
          },
        });
      } catch (err) {
        dialog(err);
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
