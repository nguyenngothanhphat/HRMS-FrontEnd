/* eslint-disable compat/compat */
/* eslint-disable no-undef */
import React from 'react';
import { parse } from 'querystring';
import pathRegexp from 'path-to-regexp';
import { List, notification } from 'antd';
import moment from 'moment';
import { formatMessage } from 'umi';

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
    messageArray = [message || 'Unknow error'];
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

const formatHour = {
  '8:00(am) - 9:00(am)': 900,
  '9:00(am) - 10:00(am)': 1000,
  '10:00(am) - 11:00(am)': 1100,
  '11:00(am) - 12:00(am)': 1200,
  '1:00(pm) - 2:00(pm)': 1400,
  '2:00(pm) - 3:00(pm)': 1500,
  '3:00(pm) - 4:00(pm)': 1600,
  '4:00(pm) - 5:00(pm)': 1700,
};

export const checkTime = (date, time) => {
  const now = `${moment().format('YYYY-MM-DD')}T00:00:00.000Z`;
  const formatNow = moment(now);
  const dateTime = moment(date);
  const hourNow = moment().format('Hmm');
  const timeMeeting = formatHour[time];
  let check = false;
  if (date !== now && formatNow > dateTime) {
    check = true;
  } else if (date === now) {
    check = parseInt(hourNow, 10) > timeMeeting;
  }
  return check;
};

export const removeEmptyFields = (obj) => {
  return Object.entries(obj).reduce(
    // eslint-disable-next-line no-return-assign
    (a, [k, v]) =>
      v == null || v === '' || v.length === 0
        ? a
        : // eslint-disable-next-line no-param-reassign
          ((a[k] = v), a),
    {},
  );
};
