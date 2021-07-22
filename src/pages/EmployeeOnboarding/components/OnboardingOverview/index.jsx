import React, { Component } from 'react';
import { connect } from 'umi';
import OnboardingLayout from '@/components/OnboardingLayout';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import OnboardingEmpty from './components/OnboardingEmpty';

@connect(({ onboard: { menu = {} } = {}, loading }) => ({
  menu,
  loading: loading.effects['onboard/fetchOnboardList'],
}))
class OnboardingOverview extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    if (!dispatch) {
      return;
    }
    dispatch({
      type: 'onboard/fetchOnboardList',
      payload: {
        processStatus: 'DRAFT',
      },
    });
    dispatch({
      type: 'onboard/fetchTotalNumberOfOnboardingListEffect',
      payload: {
        tenantId: getCurrentTenant(),
        company: getCurrentCompany(),
      },
    });
  }

  render() {
    const {
      menu: { onboardingOverviewTab: { listMenu = [] } = {} } = {},
      // loading = true,
      type = '',
    } = this.props;
    // const checkEmpty = !loading && listMenu.map((item) => item.quantity).reduce((a, b) => a + b, 0);\
    const checkEmpty = false;

    return checkEmpty === 0 ? (
      <OnboardingEmpty />
    ) : (
      <OnboardingLayout listMenu={listMenu} tabName={type} />
    );
  }
}

export default OnboardingOverview;
