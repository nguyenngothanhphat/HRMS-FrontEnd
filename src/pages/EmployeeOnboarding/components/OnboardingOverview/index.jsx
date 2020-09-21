import React, { PureComponent } from 'react';
import { Button } from 'antd';
import { Link } from 'umi';
import OnboardingLayout from '@/components/OnboardingLayout';

class OnboardingOverview extends PureComponent {
  render() {
    return (
      <div>
        <p>Onboarding overview</p>
        <Link to="/employee-onboarding/add">
          <Button type="primary">Add Team Member</Button>
        </Link>
        <Link
          to="/employee-onboarding/review/16003134"
          style={{ marginTop: '1rem', display: 'block' }}
        >
          Link review member by rookieId =16003134
        </Link>
        <OnboardingLayout />
      </div>
    );
  }
}

export default OnboardingOverview;
