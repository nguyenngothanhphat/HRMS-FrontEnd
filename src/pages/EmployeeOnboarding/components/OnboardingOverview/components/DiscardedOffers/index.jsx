import React, { PureComponent } from 'react';
import { Tabs } from 'antd';
import { connect } from 'umi';

// import SentFinalOffers from './components/SentFinalOffers/index';
// import AcceptedFinalOffers from './components/AcceptedFinalOffers/index';
// import RenegotitateFinalOffers from './components/RenegotiateFinalOffers/index';
import { PROCESS_STATUS } from '@/models/onboard';
import ProvisionalOffers from './components/ProvisionalOffers/index';
import FinalOffers from './components/FinalOffers/index';
import AllTab from './components/AllTab';

import styles from './index.less';

const { TabPane } = Tabs;

class DiscardedOffers extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    const { PROVISIONAL_OFFERS, FINAL_OFFERS } = PROCESS_STATUS;

    if (dispatch) {
      this.fetchBackgroundCheckAll([PROVISIONAL_OFFERS, FINAL_OFFERS]);
    }
  }

  fetchBackgroundCheckAll = (status) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'onboard/fetchOnboardListAll',
      payload: {
        processStatus: status,
      },
    });
  };

  fetchBackgroundCheck = (status) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'onboard/fetchOnboardList',
      payload: {
        processStatus: status,
      },
    });
  };

  onChangeTab = (key) => {
    const { PROVISIONAL_OFFERS, FINAL_OFFERS } = PROCESS_STATUS;
    if (key === '1') {
      this.fetchBackgroundCheckAll([PROVISIONAL_OFFERS, FINAL_OFFERS]);
    } else if (key === '2') {
      this.fetchBackgroundCheck(PROVISIONAL_OFFERS);
    } else {
      this.fetchBackgroundCheck(FINAL_OFFERS);
    }
  };

  render() {
    const { discardedOffers = {}, dataAll, loadingAll } = this.props;
    const { provisionalOffers = [], finalOffers = [] } = discardedOffers;

    return (
      <div className={styles.DiscardedOffers}>
        <div className={styles.tabs}>
          <Tabs defaultActiveKey="1" onChange={this.onChangeTab}>
            <TabPane
              // tab={formatMessage({ id: 'component.onboardingOverview.sentEligibilityForms' })}
              tab="all"
              key="1"
            >
              <AllTab list={dataAll} loading={loadingAll} />
            </TabPane>
            <TabPane
              // tab={formatMessage({ id: 'component.onboardingOverview.sentEligibilityForms' })}
              tab="provisional offers"
              key="2"
            >
              {/* <SentFinalOffers list={sentFinalOffers} /> */}
              <ProvisionalOffers list={provisionalOffers} />
            </TabPane>

            <TabPane
              // tab={formatMessage({ id: 'component.onboardingOverview.receivedSubmittedDocuments' })}
              tab="final offers"
              key="3"
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
  const { onboard = {}, loading } = state;
  const { onboardingOverview = {} } = onboard;
  const { discardedOffers = {}, dataAll = [] } = onboardingOverview;

  return {
    discardedOffers,
    dataAll,
    loadingAll: loading.effects['onboard/fetchOnboardListAll'],
  };
})(DiscardedOffers);
