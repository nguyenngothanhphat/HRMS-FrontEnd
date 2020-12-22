import React, { PureComponent } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import { Affix } from 'antd';
import styles from './index.less';

class FAQs extends PureComponent {
  render() {
    return (
      <PageContainer>
        <div className={styles.root}>
          <Affix offsetTop={40}>
            <div className={styles.titlePage}>
              <p className={styles.titlePage__text}>FAQs</p>
            </div>
          </Affix>
        </div>
      </PageContainer>
    );
  }
}

export default FAQs;
