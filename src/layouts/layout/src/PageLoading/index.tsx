/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 28 }} spin />;

const PageLoading: React.FC<{
  tip?: string;
}> = ({ tip }) => (
  <div style={{ paddingTop: 300, paddingBottom: 100, textAlign: 'center' }}>
    <Spin size="large" tip={tip} indicator={antIcon} />
    <span style={{
      fontSize: 13,
      marginTop: '1.4rem',
      display: 'block',
      fontWeight: 700,
      letterSpacing: 1.5,
      opacity: 0.8
    }}
    >LOADING, PLEASE WAIT...
    </span>
  </div>
);

export default PageLoading;
