import React from 'react';
import { ExclamationOutlined } from '@ant-design/icons';
// import { PageContainer } from '@ant-design/pro-layout';
import { Typography } from 'antd';
import styles from './index.less';

const Warning = ({ formatMessage = () => {} }) => {
  return (
    // <PageContainer>
    <div className={styles.Warning}>
      <ExclamationOutlined className={styles.icon} />
      <Typography.Text>
        {' '}
        {formatMessage({ id: 'component.eligibilityDocs.headerReminder' })}{' '}
      </Typography.Text>
    </div>
    // </PageContainer>
  );
};

export default Warning;
