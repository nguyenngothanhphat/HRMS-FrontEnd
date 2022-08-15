/* eslint-disable compat/compat */
/* eslint-disable no-undef */
import { List, notification } from 'antd';
import { debounce } from 'lodash';
import moment from 'moment';
import pathRegexp from 'path-to-regexp';
import { parse } from 'querystring';
import React from 'react';
import { formatMessage } from 'umi';
import { UPLOAD } from '@/constants/upload';
import { getCompanyOfUser, getCurrentCompany } from './authority';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg =
  /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
export const isUrl = (path) => reg.test(path);
export const isAntDesignPro = () => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }

  return window.location.hostname === 'preview.pro.ant.design';
}; // 给官方演示站点用，用于关闭真实开发环境不需要使用的特性

export const isAntDesignProOrDev = () => {
  const { NODE_ENV } = process.env;

  if (NODE_ENV === 'development') {
    return true;
  }

  return isAntDesignPro();
};
export const getPageQuery = () => parse(window.location.href.split('?')[1]);
/**
 * props.route.routes
 * @param router [{}]
 * @param pathname string
 */

export const getAuthorityFromRouter = (router = [], pathname) => {
  const authority = router.find(
    ({ routes, path = '/', target = '_self' }) =>
      (path && target !== '_blank' && pathRegexp(path).exec(pathname)) ||
      (routes && getAuthorityFromRouter(routes, pathname)),
  );
  if (authority) return authority;
  return undefined;
};
export const getRouteAuthority = (path, routeData) => {
  let authorities;
  routeData.forEach((route) => {
    // match prefix
    if (pathRegexp(`${route.path}/(.*)`).test(`${path}/`)) {
      if (route.authority) {
        authorities = route.authority;
      } // exact match

      if (route.path === path) {
        authorities = route.authority || authorities;
      } // get children authority recursively

      if (route.routes) {
        authorities = getRouteAuthority(path, route.routes) || authorities;
      }
    }
  });
  return authorities;
};

export function dialog(response) {
  if (!response || response.statusCode === 505) return;
  const { message, data = {} } = response;
  let messageArray = [];
  if (Array.isArray(data)) {
    messageArray = data.map(({ id, defaultMessage, values }) =>
      formatMessage({ id, defaultMessage }, values),
    );
  }
  if (messageArray.length === 0) {
    messageArray = [message || 'Unknown error'];
  }
  notification.error({
    message: 'Process fail',
    description: (
      <List
        size="small"
        dataSource={messageArray}
        renderItem={(msg) => (
          <List.Item key={msg} style={{ padding: '0', color: '#000' }}>
            {msg}
          </List.Item>
        )}
      />
    ),
  });
}

export const filteredArr = (data) => {
  return data.reduce((precur, current) => {
    const x = precur.find((item) => item.label === current.label);
    if (!x) {
      return precur.concat([current]);
    }
    return precur;
  }, []);
};

export const formatAdditionalQuestion = (questionArr) => {
  if (!questionArr) {
    return [];
  }
  const finalArr = questionArr.map((item) => {
    const { question = '', answer = '', type = '', defaultAnswer = [], description = '' } = item;
    const itemData = {
      type,
      name: question.replace(/ /g, ''), // Discard white spaces
      question,
      defaultAnswer,
      answer,
      description,
    };
    return { ...itemData };
    // finalArr.push({...itemData});
    // return null;
  });
  return finalArr;
};

export const diffTime = (start, end, type) =>
  moment(start, 'HH:mm').diff(moment(end, 'HH:mm'), type);

export const goToTop = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth',
  });
};

export const removeEmptyFields = (obj) => {
  return Object.entries(obj).reduce(
    // eslint-disable-next-line no-return-assign
    (a, [k, v]) =>
      v == null || v.length === 0 || !v
        ? a
        : // eslint-disable-next-line no-param-reassign
          ((a[k] = v), a),
    {},
  );
};

export const addZeroToNumber = (number) => {
  if (number < 10 && number > 0) return `0${number}`.slice(-2);
  return number || 0;
};

export const getCountryId = (locationObj) => {
  const type = typeof locationObj?.headQuarterAddress?.country;
  switch (type) {
    case 'string':
      return locationObj?.headQuarterAddress?.country;
    case 'object':
      return locationObj?.headQuarterAddress?.country?._id;
    default:
      return '';
  }
};

export const getCurrentCompanyObj = () => {
  const companyOfUser = getCompanyOfUser() || [];
  const currentCompanyId = getCurrentCompany();
  return companyOfUser.find((item) => item._id === currentCompanyId);
};

export const getCompanyName = () => {
  return getCurrentCompanyObj()?.name || '';
};

export const singularify = (str, count) => {
  if (count > 1) return `${str}s`;
  return str;
};

export const sortAlphabet = (array, ...sortKeys) => {
  return array.sort((a, b) => {
    let valA = a;
    let valB = b;

    sortKeys.forEach((item) => {
      valA = (valA[item] || valA).toString();
      valB = (valB[item] || valB).toString();
    });

    valA = valA.toString().toLowerCase();
    valB = valB.toString().toLowerCase();

    if (valA < valB) {
      return -1;
    }
    if (valA > valB) {
      return 1;
    }
    return 0;
  });
};

export const splitArrayItem = (arr = []) => (arr.length ? arr.toString().split(',') : []);

export const getEmployeeUrl = (userId) => {
  return `/directory/employee-profile/${userId}`;
};

export const debounceFetchData = debounce((callback) => callback(), 500);

export const getYoutubeIdFromUrl = (url = '') => {
  let videoId = url.split('v=')[1];
  const ampersandPosition = videoId.indexOf('&');
  if (ampersandPosition !== -1) {
    videoId = videoId.substring(0, ampersandPosition);
  }
  return videoId;
};
