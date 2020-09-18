import React, { PureComponent } from 'react';
import { Button } from 'antd';
import { Link } from 'umi';

import styles from './index.less';

class OnboardingOverview extends PureComponent {
  render() {
    return (
      <div>
        <p>Onboarding overview</p>
        <Link to="/employee-onboarding/add">
          <Button className={styles.addMember} type="primary">
            Add Team Member
          </Button>
        </Link>
        <Link
          to="/employee-onboarding/review/16003134"
          style={{ marginTop: '1rem', display: 'block' }}
        >
          Link review member by rookieId =16003134
        </Link>
      </div>
    );
  }
}

export default OnboardingOverview;
