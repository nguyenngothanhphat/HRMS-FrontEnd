import React, { Component, Fragment } from 'react';
import { connect } from 'umi';
import OnboardingLayout from '@/components/OnboardingLayout';
import OnboardingEmpty from './components/OnboardingEmpty';

@connect(({ onboard: { menu = {} } = {} }) => ({
  menu,
}))
class OnboardingOverview extends Component {
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
    const { menu: { onboardingOverviewTab: { listMenu = [] } = {} } = {} } = this.props;
    const checkEmpty = listMenu.map((item) => item.quantity).reduce((a, b) => a + b, 0);
    return (
      <Fragment>
        {checkEmpty === 0 ? <OnboardingEmpty /> : <OnboardingLayout listMenu={listMenu} />}
      </Fragment>
    );
  }
}

export default OnboardingOverview;
