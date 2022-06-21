import React from 'react';
import { Button } from 'antd';
import styles from './index.less';

const DocumentButton = ({ children, primary = true }) => {
  const mode = primary ? styles.documentButtonPrimary : styles.documentButton;
  return <Button className={[mode]}>{children}</Button>;
};

export default DocumentButton;
