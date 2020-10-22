import React, { PureComponent } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import { formatMessage } from 'umi';
import { Affix } from 'antd';
import styles from './index.less';

class index extends PureComponent {
  render() {
    return (
      <PageContainer>
        <div className={styles.Permission}>
          <Affix offsetTop={40}>
            <div className={styles.headerText}>
              <span>{formatMessage({ id: 'pages_admin.setting.Permission' })}</span>
            </div>
          </Affix>
        </div>
      </PageContainer>
    );
  }
}

export default index;
