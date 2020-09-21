import React, { Component } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import { Tabs } from 'antd';
import PendingEligibilityChecks from '../../pages/EmployeeOnboarding/components/OnboardingOverview/components/PendingEligibilityChecks';

class OnboardingLayout extends Component {
  render() {
    return (
      <div>
        <PendingEligibilityChecks />
      </div>
    );
  }
}

export default OnboardingLayout;
