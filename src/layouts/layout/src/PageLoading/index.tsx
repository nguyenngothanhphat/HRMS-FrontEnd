import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const PageLoading: React.FC<{
  tip?: string;
}> = ({ tip }) => (
  <div style={{ paddingTop: 100, textAlign: 'center' }}>
    <Spin size="large" tip={tip} indicator={<LoadingOutlined style={{ fontSize: 32 }} spin />} />
  </div>
);

export default PageLoading;
