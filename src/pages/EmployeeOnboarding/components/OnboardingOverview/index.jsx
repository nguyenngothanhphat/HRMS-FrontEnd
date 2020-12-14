import React, { Component } from 'react';
import { connect } from 'umi';
import { Spin } from 'antd';
import OnboardingLayout from '@/components/OnboardingLayout';
import OnboardingEmpty from './components/OnboardingEmpty';
import styles from './index.less';

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
      type: 'onboard/fetchAllOnboardList',
      payload: {},
    });
  }

  render() {
    const {
      menu: { onboardingOverviewTab: { listMenu = [] } = {} } = {},
      loading = true,
    } = this.props;
    const checkEmpty = !loading && listMenu.map((item) => item.quantity).reduce((a, b) => a + b, 0);
    // if (!checkEmpty)
    //   return (
    //     <div className={styles.loading}>
    //       <Spin size="large" />
    //     </div>
    //   );
    return checkEmpty === 0 ? <OnboardingEmpty /> : <OnboardingLayout listMenu={listMenu} />;
  }
}

export default OnboardingOverview;
