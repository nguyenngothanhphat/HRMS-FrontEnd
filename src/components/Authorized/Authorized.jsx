import { Result } from 'antd';
import React from 'react';
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
  return <>{dom}</>;
};

export default Authorized;
