import React, { CSSProperties } from 'react';
import { Layout } from 'antd';
import { connect } from 'umi';

import { ConfigProviderWarp } from '@ant-design/pro-provider';

import './WrapContent.less';

const WrapContent: React.FC<{
  isChildrenLayout?: boolean;
  className?: string;
  style?: CSSProperties;
  location?: any;
  contentHeight?: number | string;
  expandMenuSidebar: boolean;
}> = (props) => {
  const { style, className, children, expandMenuSidebar } = props;
  const classNames = expandMenuSidebar ? 'wrapContentExpand' : 'wrapContentCollapsed';
  return (
    <ConfigProviderWarp>
      <Layout.Content
        className={`${className} ${classNames}`}
        style={{...style}}
      >
        {children}
      </Layout.Content>
    </ConfigProviderWarp>
  );
};

export default connect(({ global: { expandMenuSidebar = true } = {} }) => ({
  expandMenuSidebar
}))(WrapContent);
