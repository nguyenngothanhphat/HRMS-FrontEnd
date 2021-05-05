import React, { PureComponent } from 'react';
import { Tabs } from 'antd';
import { connect } from 'umi';

import { PROCESS_STATUS } from '@/models/onboard';
import SentFinalOffers from './components/SentFinalOffers/index';
import AcceptedFinalOffers from './components/AcceptedFinalOffers/index';
import RenegotitateFinalOffers from './components/RenegotiateFinalOffers/index';

import styles from './index.less';

const { TabPane } = Tabs;

class FinalOffers extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    const { PENDING } = PROCESS_STATUS;

    if (dispatch) {
      this.fetchFinalOffer(PENDING);
    }
  }

  fetchFinalOffer = (status) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'onboard/fetchOnboardList',
      payload: {
        processStatus: status,
      },
    });
  };

  onChangeTab = (key) => {
    const { PENDING, ELIGIBLE_CANDIDATES, INELIGIBLE_CANDIDATES } = PROCESS_STATUS;
    if (key === '1') {
      this.fetchFinalOffer(PENDING);
    } else if (key === '2') {
      this.fetchFinalOffer(ELIGIBLE_CANDIDATES);
    } else {
      this.fetchFinalOffer(INELIGIBLE_CANDIDATES);
    }
  };

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
          <Tabs defaultActiveKey="1" onChange={this.onChangeTab}>
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
