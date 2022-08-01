import { Result } from 'antd';
import React, { useEffect } from 'react';
import { history } from 'umi';
import check from './CheckPermissions';

const Authorized = (props) => {
  const {
    children,
    authority,
    noMatch = (
      <Result
        status="403"
        title="403"
        subTitle="Sorry, you are not authorized to access this page."
      />
    ),
  } = props;
  const childrenRender = typeof children === 'undefined' ? null : children;
  const dom = check(authority, childrenRender, noMatch);
  const signInRole = localStorage.getItem('antd-pro-authority');
  const params = window.location.pathname;
  useEffect(() => {
    if (signInRole?.includes('owner') && params === '/home') {
      history.push('/admin-app');
    }
  }, [JSON.stringify(signInRole)]);
  return <>{dom}</>;
};

export default Authorized;
