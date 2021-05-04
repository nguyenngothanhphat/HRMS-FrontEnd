import React, { PureComponent } from 'react';
import { Tabs, Spin } from 'antd';
import { connect } from 'umi';
import { PROCESS_STATUS } from '@/models/onboard';
import SentProvisionalOffers from './components/SentProvisionalOffers/index';
import AcceptedProvisionalOffers from './components/AcceptedProvisionalOffers/index';
import RenegotiateProvisionalOffers from './components/RenegotiateProvisionalOffers/index';

import styles from './index.less';

class ProvisionalOffers extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    const { SENT_PROVISIONAL_OFFERS } = PROCESS_STATUS;

    if (dispatch) {
      this.fetchProvisionalOffer(SENT_PROVISIONAL_OFFERS);
    }
  }

  fetchProvisionalOffer = (status) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'onboard/fetchOnboardList',
      payload: {
        processStatus: status,
      },
    });
  };

  onChangeTab = (key) => {
    const {
      SENT_PROVISIONAL_OFFERS,
      ACCEPTED_PROVISIONAL_OFFERS,
      RENEGOTIATE_PROVISIONAL_OFFERS,
    } = PROCESS_STATUS;
    if (key === '1') {
      this.fetchProvisionalOffer(SENT_PROVISIONAL_OFFERS);
    } else if (key === '2') {
      this.fetchProvisionalOffer(ACCEPTED_PROVISIONAL_OFFERS);
    } else {
      this.fetchProvisionalOffer(RENEGOTIATE_PROVISIONAL_OFFERS);
    }
  };

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
          <Tabs defaultActiveKey="1" onChange={this.onChangeTab}>
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
