import React, { PureComponent } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import { Button } from 'antd';
import { Link } from 'umi';
import styles from './index.less';

export default class EmployeeOnboarding extends PureComponent {
  render() {
    return (
      <PageContainer>
        <div className={styles.containerEmployeeOnboarding}>
          <Link to="/employee-onboarding/add">
            <Button type="primary">Add Team Member</Button>
          </Link>
          <Link
            to="/employee-onboarding/review/16003134"
            style={{ marginTop: '1rem', display: 'block' }}
          >
            Link review member by rookieId =16003134
          </Link>
        </div>
      </PageContainer>
    );
  }
}
