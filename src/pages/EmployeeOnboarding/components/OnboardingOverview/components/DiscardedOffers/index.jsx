import React, { PureComponent } from 'react';
import { Tabs } from 'antd';
import { connect } from 'umi';

// import SentFinalOffers from './components/SentFinalOffers/index';
// import AcceptedFinalOffers from './components/AcceptedFinalOffers/index';
// import RenegotitateFinalOffers from './components/RenegotiateFinalOffers/index';
import ProvisionalOffers from './components/ProvisionalOffers/index';
import FinalOffers from './components/FinalOffers/index';

import styles from './index.less';

const { TabPane } = Tabs;

class DiscardedOffers extends PureComponent {
  render() {
    const { discardedOffers = {} } = this.props;
    const { provisionalOffers = [], finalOffers = [] } = discardedOffers;

    return (
      <div className={styles.DiscardedOffers}>
        <div className={styles.tabs}>
          <Tabs defaultActiveKey="1">
            <TabPane
              // tab={formatMessage({ id: 'component.onboardingOverview.sentEligibilityForms' })}
              tab="provisional offers"
              key="1"
            >
              {/* <SentFinalOffers list={sentFinalOffers} /> */}
              <ProvisionalOffers list={provisionalOffers} />
            </TabPane>

            <TabPane
              // tab={formatMessage({ id: 'component.onboardingOverview.receivedSubmittedDocuments' })}
              tab="final offers"
              key="2"
            >
              <FinalOffers list={finalOffers} />
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
  const { discardedOffers = {} } = onboardingOverview;

  return {
    discardedOffers,
  };
})(DiscardedOffers);
