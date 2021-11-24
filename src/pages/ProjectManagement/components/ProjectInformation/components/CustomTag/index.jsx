import React from 'react';
import styles from './index.less';

const CustomTag = (props) => {
  const { children = 'children', color = '' } = props;

  const generateBackgroundColor = () => {
    return `${color}1A`; // hex with alpha 20%
  };

  return (
    <div className={styles.CustomTag} style={{ color, backgroundColor: generateBackgroundColor() }}>
      {children}
    </div>
  );
};
export default CustomTag;
