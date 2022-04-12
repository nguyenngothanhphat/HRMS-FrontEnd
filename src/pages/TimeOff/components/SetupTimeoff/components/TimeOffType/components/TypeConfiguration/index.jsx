import React from 'react';
import { Affix } from 'antd';
import { connect } from 'umi';
import styles from './index.less';
import { PageContainer } from '@/layouts/layout/src';

const TypeConfiguration = (props) => {
  const {
    dispatch,
    match: { params: { reId = '', tabName = '' } = {} } = {},
    permissions = {},
  } = props;

  return (
    <PageContainer>
      <div className={styles.TypeConfiguration}>
        <Affix offsetTop={42}>
          <div className={styles.titlePage}>
            <p className={styles.titlePage__text}>Setup Timeoff policy</p>
          </div>
        </Affix>
      </div>
    </PageContainer>
  );
};

export default connect(({ user: { permissions = {} } }) => ({
  permissions,
}))(TypeConfiguration);
