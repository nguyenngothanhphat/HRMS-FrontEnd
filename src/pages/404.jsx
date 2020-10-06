import { Button, Result } from 'antd';
import React from 'react';
import { history, formatMessage } from 'umi';

const NoFoundPage = () => (
  <Result
    status="404"
    title={formatMessage({ id: 'pages.404.title' })}
    subTitle={formatMessage({ id: 'pages.404.subTitle' })}
    extra={
      <Button type="primary" onClick={() => history.push('/')}>
        {formatMessage({ id: 'pages.404.backHome' })}
      </Button>
    }
  />
);

export default NoFoundPage;
