import React from 'react';
import { Spin } from 'antd';

// loading components from code split
// https://umijs.org/plugin/umi-plugin-react.html#dynamicimport
export default ({ children, className, loading = true, iconSize = 'large', style }) => {
  let content = (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: '100%',
        ...style,
      }}
    >
      <Spin size={iconSize} />
    </div>
  );
  if (!loading && children) {
    content = <div className={className}>{children}</div>;
  }

  return content;
};
