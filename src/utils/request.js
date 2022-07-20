import { notification } from 'antd';
import axios from 'axios';
import { getDvaApp } from 'umi';
import { proxy, API_KEYS } from '../../config/proxy';
import { getToken } from './token';

const codeMessage = {
  200: 'The server successfully returned the requested data.',
  201: 'New or modified data is successful.',
  202: 'A request has entered the background queue (asynchronous task).',
  204: 'Delete data successfully.',
  400: 'The request was sent with an error.The server did not perform any operations to create or modify data.',
  401: 'The user does not have permission (token, username, password is incorrect).',
  403: 'User is authorized, but access is forbidden.',
  404: 'The request made is for a record that does not exist and the server is not operating.',
  406: 'The format of the request is not available.',
  410: 'The requested resource is permanently deleted and will not be obtained again.',
  422: 'When creating an object, a validation error occurred.',
  500: 'The server has an error, please check the server.',
  502: 'Gateway error.',
  503: 'The service is unavailable, the server is temporarily overloaded or maintained.',
  504: 'The gateway timed out.',
};

const errorHandler = (error) => {
  const { response } = error;
  const { status, statusText, config: { url } = {} } = response || {};
  if (status === 401) {
    getDvaApp()._store.dispatch({
      type: 'login/logout',
    });
    return { statusCode: 401 };
  }

  if (status) {
    const errorText = codeMessage[status] || statusText;
    notification.error({
      message: `Request error ${status}: ${url}`,
      description: errorText,
    });
  } else if (!response) {
    notification.error({
      description: 'Your network is abnormal and cannot connect to the server',
      message: 'Network anomaly',
    });
  }

  return { statusCode: response?.status, message: response?.statusText };
};

const request = async (url, options = {}, noAuth, apiKey = API_KEYS.BASE_API) => {
  const { method = 'POST', data = {}, params = {} } = options;
  const { cancel: { cancelNamespace, cancelType = '' } = {} } = data;
  const token = getToken();

  const { CancelToken } = axios;
  const source = CancelToken.source();

  if (cancelNamespace)
    getDvaApp()._store.dispatch({
      type: `${cancelNamespace}/saveRequest`,
      payload: { [cancelType]: source },
    });

  const headers = {
    'Content-Type': 'application/json;charset=UTF-8',
    'Access-Control-Allow-Origin': '*',
    Authorization: !noAuth ? `Bearer ${token}` : '',
  };
  const instance = axios.create({
    baseURL: proxy[apiKey],
    headers,
    params,
    cancelToken: source.token,
  });

  instance.interceptors.response.use(
    (config) => config,
    (error) => {
      // eslint-disable-next-line compat/compat
      return Promise.reject(error);
    },
  );
  try {
    const updateData = { ...data };
    delete updateData.cancel;
    const res = await instance[method.toLowerCase()](url, updateData);
    return res.data;
  } catch (e) {
    const isCancel = axios.isCancel(e);
    return isCancel ? null : errorHandler(e);
  }
};

export default request;
