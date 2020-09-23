import React, { Component } from 'react';
import { Tabs } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { connect, formatMessage } from 'umi';

import OnboardTable from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/OnboardTable';
import SentProvisionalOffers from './components/SentProvisionalOffers';
import ReceivedProvisionalOffers from './components/ReceivedProvisionalOffers';

import styles from './index.less';

class ProvisionalOffers extends Component {
  constructor() {
    super();
  }

  render() {
    const { TabPane } = Tabs;
    const { provisionalOffers = {} } = this.props;
    const { sentProvisionalOffers = [], receivedProvisionalOffers = [] } = provisionalOffers;
    console.log(provisionalOffers);
    console.log(sentProvisionalOffers);
    console.log(receivedProvisionalOffers);

    return (
      <div className={styles.PendingEligibilityChecks}>
        <div className={styles.tabs}>
          <Tabs defaultActiveKey="1">
            <TabPane
              // tab={formatMessage({ id: 'component.onboardingOverview.sentEligibilityForms' })}
              tab="sent provisional offers"
              key="1"
            >
              {/* <OnboardTable list={rookieList} /> */}
              <SentProvisionalOffers list={sentProvisionalOffers} />
            </TabPane>
            <TabPane
              // tab={formatMessage({ id: 'component.onboardingOverview.receivedSubmittedDocuments' })}
              tab="received provisional offers"
              key="2"
            >
              <ReceivedProvisionalOffers list={receivedProvisionalOffers} />
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

// export default ProvisionalOffers;
export default connect((state) => {
  const { onboard = {} } = state;
  const { onboardingOverview = {} } = onboard;
  const { provisionalOffers = {} } = onboardingOverview;

  return {
    provisionalOffers,
  };
})(ProvisionalOffers);
