import React, { PureComponent } from 'react';
import { Tabs } from 'antd';
import { connect } from 'umi';

import { PROCESS_STATUS } from '@/models/onboard';
import SentFinalOffers from './components/SentFinalOffers/index';
import AcceptedFinalOffers from './components/AcceptedFinalOffers/index';
import RenegotitateFinalOffers from './components/RenegotiateFinalOffers/index';
import AllTab from './components/AllTab';

import styles from './index.less';

const { TabPane } = Tabs;

class FinalOffers extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tabId: 1,
      pageSelected: 1,
      size: 10,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { SENT_FINAL_OFFERS, ACCEPTED_FINAL_OFFERS, RENEGOTIATE_FINAL_OFFERS } = PROCESS_STATUS;

    if (dispatch) {
      this.fetchFinalOfferAll([SENT_FINAL_OFFERS, ACCEPTED_FINAL_OFFERS, RENEGOTIATE_FINAL_OFFERS]);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { tabId, pageSelected, size } = this.state;
    if (
      prevState.tabId !== tabId ||
      prevState.pageSelected !== pageSelected ||
      prevState.size !== size
    ) {
      this.onChangeTab(tabId);
    }
  }

  fetchFinalOfferAll = (status) => {
    const { dispatch } = this.props;
    const { pageSelected, size } = this.state;
    dispatch({
      type: 'onboard/fetchOnboardListAll',
      payload: {
        processStatus: status,
        page: pageSelected,
        limit: size,
      },
    });
  };

  fetchFinalOffer = (status) => {
    const { pageSelected, size } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'onboard/fetchOnboardList',
      payload: {
        processStatus: status,
        page: pageSelected,
        limit: size,
      },
    });
  };

  onChangeTab = (key) => {
    const { SENT_FINAL_OFFERS, ACCEPTED_FINAL_OFFERS, RENEGOTIATE_FINAL_OFFERS } = PROCESS_STATUS;
    this.setState({
      tabId: key,
    });
    if (key === '1') {
      this.fetchFinalOfferAll([SENT_FINAL_OFFERS, ACCEPTED_FINAL_OFFERS, RENEGOTIATE_FINAL_OFFERS]);
    } else if (key === '2') {
      this.fetchFinalOffer(SENT_FINAL_OFFERS);
    } else if (key === '3') {
      this.fetchFinalOffer(ACCEPTED_FINAL_OFFERS);
    } else {
      this.fetchFinalOffer(RENEGOTIATE_FINAL_OFFERS);
    }
  };

  getPageAndSize = (page, pageSize) => {
    this.setState({
      pageSelected: page,
      size: pageSize,
    });
  };

  render() {
    const { finalOffers = {}, dataAll, loadingAll, total } = this.props;
    const { tabId, pageSelected, size } = this.state;
    const {
      sentFinalOffers = [],
      acceptedFinalOffers = [],
      renegotiateFinalOffers = [],
    } = finalOffers;

    return (
      <div className={styles.FinalOffers}>
        <div className={styles.tabs}>
          <Tabs defaultActiveKey={tabId} onChange={this.onChangeTab}>
            <TabPane
              // tab={formatMessage({ id: 'component.onboardingOverview.sentEligibilityForms' })}
              tab="all"
              key="1"
            >
              <AllTab
                list={dataAll}
                loading={loadingAll}
                pageSelected={pageSelected}
                size={size}
                getPageAndSize={this.getPageAndSize}
                total={total}
              />
            </TabPane>
            <TabPane
              // tab={formatMessage({ id: 'component.onboardingOverview.sentEligibilityForms' })}
              tab="sent final offers"
              key="2"
            >
              <SentFinalOffers
                list={sentFinalOffers}
                pageSelected={pageSelected}
                size={size}
                getPageAndSize={this.getPageAndSize}
                total={total}
              />
            </TabPane>

            <TabPane
              // tab={formatMessage({ id: 'component.onboardingOverview.receivedSubmittedDocuments' })}
              tab="accepted final offers"
              key="3"
            >
              <AcceptedFinalOffers
                list={acceptedFinalOffers}
                pageSelected={pageSelected}
                size={size}
                getPageAndSize={this.getPageAndSize}
                total={total}
              />
            </TabPane>

            <TabPane
              // tab={formatMessage({ id: 'component.onboardingOverview.receivedSubmittedDocuments' })}
              tab="re-negotiate final offers"
              key="4"
            >
              <RenegotitateFinalOffers
                list={renegotiateFinalOffers}
                pageSelected={pageSelected}
                size={size}
                getPageAndSize={this.getPageAndSize}
                total={total}
              />
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
  const { finalOffers = {}, dataAll, total = '' } = onboardingOverview;

  return {
    finalOffers,
    total,
    dataAll,
    loadingAll: loading.effects['onboard/fetchOnboardListAll'],
  };
})(FinalOffers);
