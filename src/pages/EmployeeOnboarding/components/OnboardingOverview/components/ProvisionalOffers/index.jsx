import React, { PureComponent } from 'react';
import { Tabs } from 'antd';
import { connect } from 'umi';
import SentProvisionalOffers from './components/SentProvisionalOffers/index';
import AcceptedProvisionalOffers from './components/AcceptedProvisionalOffers/index';
import RenegotiateProvisionalOffers from './components/RenegotiateProvisionalOffers/index';

import styles from './index.less';

class ProvisionalOffers extends PureComponent {
  render() {
    const { TabPane } = Tabs;
    const { provisionalOffers = {} } = this.props;
    const {
      sentProvisionalOffers = [],
      // receivedProvisionalOffers = [],
      acceptedProvisionalOffers = [],
      renegotiateProvisionalOffers = [],
    } = provisionalOffers;

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
              tab="accepted provisional offers"
              key="2"
            >
              <AcceptedProvisionalOffers list={acceptedProvisionalOffers} />
            </TabPane>

            <TabPane
              // tab={formatMessage({ id: 'component.onboardingOverview.receivedSubmittedDocuments' })}
              tab="renegotiate provisional offers"
              key="3"
            >
              <RenegotiateProvisionalOffers list={renegotiateProvisionalOffers} />
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
