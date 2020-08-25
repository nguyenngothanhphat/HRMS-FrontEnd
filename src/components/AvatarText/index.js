import React from 'react';
import { Avatar } from 'antd';
import styles from './index.less';

const AvatarText = ({ src, text, className, border = true }) => {
  return (
    <div className={className}>
      <Avatar
        shape={border ? 'circle' : 'square'}
        className={`${styles.avatar} ${border && styles.border}`}
        src={src}
      />
      {text}
    </div>
  );
};

export default AvatarText;
