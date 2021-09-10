import { getCurrentTenant } from '@/utils/authority';
import { Skeleton } from 'antd';
import React, { PureComponent } from 'react';
import { formatMessage, connect } from 'umi';
import NonExtempNoticeForm from './components/NonExtempNoticeForm';
import styles from './index.less';

@connect(({ loading }) => ({
  loadingFetchListInsurances: loading.effects['onboardingSettings/fetchListInsurances'],
}))
class NonExtempNotice extends PureComponent {
  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'onboardingSettings/fetchListInsurances',
      payload: {
        tenantId: getCurrentTenant(),
      },
    });
  };

  render() {
    const { loadingFetchListInsurances = false } = this.props;
    return (
      <div className={styles.NonExtempNotice}>
        <div className={styles.NonExtempNotice_title}>
          {formatMessage({ id: 'component.nonExtempNotice.title' })}
        </div>
        {loadingFetchListInsurances ? <Skeleton /> : <NonExtempNoticeForm />}
      </div>
    );
  }
}

export default NonExtempNotice;
