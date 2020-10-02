import React, { PureComponent } from 'react';
import { connect } from 'umi';
import OnboardingLayout from '@/components/OnboardingLayout';

class OnboardingOverview extends PureComponent {
  render() {
    const { menu = {} } = this.props;
    const { onboardingOverviewTab = {} } = menu;
    const { phaseList = [] } = onboardingOverviewTab;

    return (
      <div>
        <OnboardingLayout listMenu={phaseList} />
      </div>
    );
  }
}

// export default OnboardingOverview;
export default connect((state) => {
  const { onboard = {} } = state;
  const { menu = {} } = onboard;
  return {
    menu,
  };
})(OnboardingOverview);
