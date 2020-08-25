import React from 'react';
import nzh from 'nzh/cn';
import { parse } from 'qs';
import Payment from 'payment';
import { List, notification } from 'antd';
import pathToRegexp from 'path-to-regexp';
import moment from 'moment';
import { formatMessage } from 'umi-plugin-react/locale';

export const DEACTIVE_REIMBURSEMENT_STATUS = ['DELETED', 'DRAFT'];

export const PENDING_REIMBURSEMENT_STATUS = ['PENDING', 'MANAGER', 'DEP', 'LEAD', 'WORK'];

export const CLOSED_REIMBURSEMENT_STATUS = ['COMPLETE', 'REJECT'];

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach(node => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

export function digitUppercase(n) {
  return nzh.toMoney(n);
}

function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  }
  if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    // 是否包含
    const isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(
    routePath => routePath.indexOf(path) === 0 && routePath !== path
  );
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map(item => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
    };
  });
  return renderRoutes;
}

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

/* eslint no-useless-escape:0 */
const reg = /((^(https?:(?:\/\/)?|\/)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path) {
  return reg.test(path);
}

export function ObjectToArray(obj) {
  return Object.keys(obj).map(key => obj[key]);
}

export function dialog(response) {
  if (!response || response.statusCode === 505) return;
  const { message, data = {} } = response;
  let messageArray = [];
  if (Array.isArray(data)) {
    messageArray = data.map(({ id, defaultMessage, values }) =>
      formatMessage({ id, defaultMessage }, values)
    );
  }
  if (messageArray.length === 0) {
    messageArray = [message || 'Unknow error'];
  }

  notification.error({
    message: 'Process fail',
    description: (
      <List
        size="small"
        dataSource={messageArray}
        renderItem={msg => <List.Item key={msg}>{msg}</List.Item>}
      />
    ),
  });
}

export function dialogLogin(response) {
  if (!response || response.statusCode === 505) return;
  const { message, data = {} } = response;
  let messageArray = [];
  if (Array.isArray(data)) {
    messageArray = data.map(({ id, defaultMessage, values }) =>
      formatMessage({ id, defaultMessage }, values)
    );
  }
  if (messageArray.length === 0) {
    messageArray = [message || 'Unknow error'];
  }

  notification.error({
    message: 'Authentication Fail',
    description: (
      <List
        size="small"
        dataSource={messageArray}
        renderItem={msg => <List.Item key={msg}>{msg}</List.Item>}
      />
    ),
  });
}

function clearNumber(value = '') {
  return value.replace(/\D+/g, '');
}

export function formatCreditCardNumber(value) {
  if (!value) {
    return value;
  }

  const issuer = Payment.fns.cardType(value);
  const clearValue = clearNumber(value);
  let nextValue;

  switch (issuer) {
    case 'amex':
      nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(4, 10)} ${clearValue.slice(
        10,
        15
      )}`;
      break;
    case 'dinersclub':
      nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(4, 10)} ${clearValue.slice(
        10,
        14
      )}`;
      break;
    default:
      nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(4, 8)} ${clearValue.slice(
        8,
        12
      )} ${clearValue.slice(12, 19)}`;
      break;
  }

  return nextValue.trim();
}

export function roundNumber(expression, numberDigitAfterPoint) {
  return typeof expression === 'number'
    ? Math.round(expression * 10 ** numberDigitAfterPoint) / 10 ** numberDigitAfterPoint
    : '';
}

export function getStatusFromLocation(path) {
  const regexp = pathToRegexp(`${path}/:status`);
  const {
    location: { pathname },
  } = window;
  let [, status] = regexp.exec(pathname) || ['', 'active'];
  const parseObj = {
    active: 'ACTIVE',
    disabled: 'INACTIVE',
  };
  status = parseObj[status];
  return status;
}

export function getCategory(category = '') {
  if (['travel', 'non-travel'].indexOf(category) > -1) {
    return formatMessage({ id: `category.${category}` });
  }
  return '';
}

export function capitalizeFirstLetter(text) {
  if (text) {
    return text.toLowerCase().replace(/^\w/, c => c.toUpperCase());
  }
  return '';
}

export function deduplicate(arr) {
  const set = new Set(arr);
  return [...set];
}

export const getMonth = (input, type = 'default') => {
  const month = input.getMonth();
  let output;
  switch (month) {
    case 0:
      output = type === 'default' ? 'JAN' : '01';
      break;
    case 1:
      output = type === 'default' ? 'FEB' : '02';
      break;
    case 2:
      output = type === 'default' ? 'MAR' : '03';
      break;
    case 3:
      output = type === 'default' ? 'APR' : '04';
      break;
    case 4:
      output = type === 'default' ? 'MAY' : '05';
      break;
    case 5:
      output = type === 'default' ? 'JUN' : '06';
      break;
    case 6:
      output = type === 'default' ? 'JUL' : '07';
      break;
    case 7:
      output = type === 'default' ? 'AUG' : '08';
      break;
    case 8:
      output = type === 'default' ? 'SEP' : '09';
      break;
    case 9:
      output = type === 'default' ? 'OCT' : '10';
      break;
    case 10:
      output = type === 'default' ? 'NOV' : '11';
      break;
    case 11:
      output = type === 'default' ? 'DEC' : '12';
      break;
    default:
      break;
  }
  return output;
};

export const generateCsvData = record => {
  const result = [];
  result.push(['Date', 'Number', 'Report Name', 'Owner', 'Completed On', 'Status', 'Amount']);
  result.push([
    moment(record.updatedAt).format('MMM D, YYYY'),
    record.code,
    record.title,
    record.user ? record.user.fullName : '',
    record.status === 'COMPLETE' ? moment(record.updatedAt).format('MMM D, YYYY') : '',
    record.status,
    `${record.currency}${record.amount}`,
  ]);
  return result;
};

export const isEmail = (email = null) => {
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(email);
};

export const isPhone = (phone = null) => {
  const regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return regex.test(phone);
};

export const isWeb = (add = null) => {
  const regex = /^(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&=]*)$/;
  return regex.test(add);
};

export const isAddress = (add = null) => {
  const regex = /^[a-zA-Z0-9\s,'-]*$/;
  return regex.test(add);
};

export const formatNumber = num => {
  if (num > 1000000000) {
    const billion = num / 1000000000;
    return { precision: 3, suffix: 'B', value: billion };
  }
  if (num > 1000000) {
    const million = num / 1000000;
    return { precision: 3, suffix: 'M', value: million };
  }
  return { precision: 2, suffix: '', value: num };
};
