import React from 'react';
import { Button } from 'antd';

import styles from './index.less';

const SignUpButton = props => {
  const { title = '', btnBack = false } = props;
  return (
    <div className={styles.signup_button}>
      <Button {...props} className={`${btnBack ? styles.btn_back : styles.btn_continue}`}>
        {title}
      </Button>
    </div>
  );
};

export default SignUpButton;
