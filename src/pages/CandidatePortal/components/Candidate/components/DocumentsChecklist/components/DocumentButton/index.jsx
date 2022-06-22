import React from 'react';
import { Button } from 'antd';
import styles from './index.less';

const DocumentButton = ({ children, onClick, primary = true }) => {
  const mode = primary ? styles.documentButtonPrimary : styles.documentButton;
  return (
    <Button onClick={onClick} className={[mode]}>
      {children}
    </Button>
  );
};

export default DocumentButton;
