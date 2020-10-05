/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { notification } from 'antd';
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
/**
 * 异常处理程序
 */

const errorHandler = (error) => {
  const { response } = error;

  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;
    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  } else if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }

  return { statusCode: response.status, message: response.message };
};

/**
 * 配置request请求时的默认参数
 */
const request = (url, options = {}, noAuth) => {
  let headers = options.headers || {};
  if (!noAuth) {
    const token = getToken();
    headers = {
      Authorization: `Bearer ${token}`,
      ...headers,
    };
  }
  return extend({
    errorHandler, // 默认错误处理
    credentials: 'include', // 默认请求是否带上cookie
    headers,
  })(url, options);
};

export default request;
