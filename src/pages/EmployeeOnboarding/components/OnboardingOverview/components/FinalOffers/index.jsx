import React, { Component } from 'react';
import { Tabs } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { connect, formatMessage } from 'umi';

import OnboardTable from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/OnboardTable';
import SentFinalOffers from './components/SentFinalOffers';
import AcceptedFinalOffers from './components/AcceptedFinalOffers';

import { rookieList } from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/utils';

import styles from './index.less';

const { TabPane } = Tabs;

class FinalOffers extends Component {
  render() {
    const { finalOffers = {} } = this.props;
    const { sentFinalOffers = [], acceptedFinalOffers = [] } = finalOffers;

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
