import React, { CSSProperties } from 'react';
import { Layout } from 'antd';
import { ConfigProviderWarp } from '@ant-design/pro-provider';

const WrapContent: React.FC<{
  isChildrenLayout?: boolean;
  className?: string;
  style?: CSSProperties;
  location?: any;
  contentHeight?: number | string;
}> = (props) => {
  const { style, className, children } = props;
  return (
    <ConfigProviderWarp>
      <Layout.Content className={className} style={{ ...style, paddingLeft: '104px' }}>
        {children}
      </Layout.Content>
    </ConfigProviderWarp>
  );
};

export default WrapContent;
