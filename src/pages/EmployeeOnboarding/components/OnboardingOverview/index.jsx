import React, { PureComponent } from 'react';
import { connect } from 'umi';
import OnboardingLayout from '@/components/OnboardingLayout';

// import { PROCESS_STATUS } from './components/utils';

class OnboardingOverview extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    if (!dispatch) {
      return;
    }
    dispatch({
      type: 'onboard/fetchAllOnboardList',
      payload: {},
    });
  }

  render() {
    const { menu = {} } = this.props;
    const { onboardingOverviewTab = {} } = menu;
    const { listMenu = [] } = onboardingOverviewTab;

    return (
      <div>
        <OnboardingLayout listMenu={listMenu} />
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
