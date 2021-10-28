import React, { useEffect } from 'react';
import { connect } from 'umi';
import { Button } from 'antd';
import logoGoogle from '@/assets/logo_google.png';
import styles from './index.less';

const GoogleSync = (props) => {
  const { dispatch, urlGoogle = '' } = props;
  useEffect(() => {
    dispatch({ type: 'login/getURLGoogle' });
  }, []);

  return (
    <div className={styles.GoogleSync}>
      <a href={urlGoogle}>
        <Button type="primary" className={styles.button}>
          <img src={logoGoogle} alt="logo" />
          <span>Sync with your Google Account</span>
        </Button>
      </a>
    </div>
  );
};

export default connect(({ login: { urlGoogle = '' } = {} }) => ({ urlGoogle }))(GoogleSync);
