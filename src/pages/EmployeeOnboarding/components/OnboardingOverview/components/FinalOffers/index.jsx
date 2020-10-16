import React, { PureComponent } from 'react';
import { Tabs } from 'antd';
import { connect } from 'umi';

import SentFinalOffers from './components/SentFinalOffers/index';
import AcceptedFinalOffers from './components/AcceptedFinalOffers/index';
import RenegotitateFinalOffers from './components/RenegotiateFinalOffers/index';

import styles from './index.less';

const { TabPane } = Tabs;

class FinalOffers extends PureComponent {
  render() {
    const { finalOffers = {} } = this.props;
    const {
      sentFinalOffers = [],
      acceptedFinalOffers = [],
      renegotiateFinalOffers = [],
    } = finalOffers;

    return (
      <div className={styles.FinalOffers}>
        <div className={styles.tabs}>
          <Tabs defaultActiveKey="1">
            <TabPane
              // tab={formatMessage({ id: 'component.onboardingOverview.sentEligibilityForms' })}
              tab="sent final offers"
              key="1"
            >
              <SentFinalOffers list={sentFinalOffers} />
            </TabPane>

            <TabPane
              // tab={formatMessage({ id: 'component.onboardingOverview.receivedSubmittedDocuments' })}
              tab="accepted final offers"
              key="2"
            >
              <AcceptedFinalOffers list={acceptedFinalOffers} />
            </TabPane>

            <TabPane
              // tab={formatMessage({ id: 'component.onboardingOverview.receivedSubmittedDocuments' })}
              tab="re-negotiate final offers"
              key="3"
            >
              <RenegotitateFinalOffers list={renegotiateFinalOffers} />
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

// export default FinalOffers;
export default connect((state) => {
  const { onboard = {} } = state;
  const { onboardingOverview = {} } = onboard;
  const { finalOffers = {} } = onboardingOverview;

  return {
    finalOffers,
  };
})(FinalOffers);
