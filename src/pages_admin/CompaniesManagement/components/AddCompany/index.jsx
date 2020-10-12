import React, { PureComponent } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import { Affix } from 'antd';
import { formatMessage } from 'umi';
import styles from './index.less';

class AddCompany extends PureComponent {
  render() {
    return (
      <PageContainer>
        <div className={styles.addCompany}>
          <Affix offsetTop={40}>
            <div className={styles.titlePage}>
              <p className={styles.titlePage_text}>
                {formatMessage({ id: 'pages_admin.company.addCompany' })}
              </p>
            </div>
          </Affix>
          {/* Components */}
        </div>
      </PageContainer>
    );
  }
}

export default AddCompany;
