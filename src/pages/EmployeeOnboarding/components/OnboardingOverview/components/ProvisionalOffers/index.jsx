import React, { PureComponent } from 'react';
import { Tabs } from 'antd';
import { connect } from 'umi';
import { PROCESS_STATUS } from '@/models/onboard';
import SentProvisionalOffers from './components/SentProvisionalOffers/index';
import AcceptedProvisionalOffers from './components/AcceptedProvisionalOffers/index';
import RenegotiateProvisionalOffers from './components/RenegotiateProvisionalOffers/index';
import AllTab from './components/AllTab';

import styles from './index.less';

class ProvisionalOffers extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tabId: '1',
      pageSelected: 1,
      size: 10,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { SENT_PROVISIONAL_OFFERS, ACCEPTED_PROVISIONAL_OFFERS, RENEGOTIATE_PROVISIONAL_OFFERS } =
      PROCESS_STATUS;

    if (dispatch) {
      this.fetchProvisionalOfferAll([
        SENT_PROVISIONAL_OFFERS,
        ACCEPTED_PROVISIONAL_OFFERS,
        RENEGOTIATE_PROVISIONAL_OFFERS,
      ]);
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

  fetchProvisionalOfferAll = (status) => {
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

  fetchProvisionalOffer = (status) => {
    const { dispatch } = this.props;
    const { pageSelected, size } = this.state;

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
    const { SENT_PROVISIONAL_OFFERS, ACCEPTED_PROVISIONAL_OFFERS, RENEGOTIATE_PROVISIONAL_OFFERS } =
      PROCESS_STATUS;
    this.setState({
      tabId: key,
    });
    if (key === '1') {
      this.fetchProvisionalOfferAll([
        SENT_PROVISIONAL_OFFERS,
        ACCEPTED_PROVISIONAL_OFFERS,
        RENEGOTIATE_PROVISIONAL_OFFERS,
      ]);
    } else if (key === '2') {
      this.fetchProvisionalOffer(SENT_PROVISIONAL_OFFERS);
    } else if (key === '3') {
      this.fetchProvisionalOffer(ACCEPTED_PROVISIONAL_OFFERS);
    } else {
      this.fetchProvisionalOffer(RENEGOTIATE_PROVISIONAL_OFFERS);
    }
  };

  getPageAndSize = (page, pageSize) => {
    this.setState({
      pageSelected: page,
      size: pageSize,
    });
  };

  render() {
    const { TabPane } = Tabs;
    const { tabId, pageSelected, size } = this.state;
    const { provisionalOffers = {}, dataAll = [], loadingAll, total } = this.props;
    const {
      sentProvisionalOffers = [],
      // receivedProvisionalOffers = [],
      acceptedProvisionalOffers = [],
      renegotiateProvisionalOffers = [],
    } = provisionalOffers;

    return (
      <div className={styles.PendingEligibilityChecks}>
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
              tab="sent provisional offers"
              key="2"
            >
              {/* <OnboardTable list={rookieList} /> */}
              <SentProvisionalOffers
                list={sentProvisionalOffers}
                pageSelected={pageSelected}
                size={size}
                getPageAndSize={this.getPageAndSize}
                total={total}
              />
            </TabPane>

            <TabPane
              // tab={formatMessage({ id: 'component.onboardingOverview.receivedSubmittedDocuments' })}
              tab="accepted provisional offers"
              key="3"
            >
              <AcceptedProvisionalOffers
                list={acceptedProvisionalOffers}
                pageSelected={pageSelected}
                size={size}
                getPageAndSize={this.getPageAndSize}
                total={total}
              />
            </TabPane>

            <TabPane
              // tab={formatMessage({ id: 'component.onboardingOverview.receivedSubmittedDocuments' })}
              tab="renegotiate provisional offers"
              key="4"
            >
              <RenegotiateProvisionalOffers
                list={renegotiateProvisionalOffers}
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

// export default ProvisionalOffers;
export default connect((state) => {
  const { onboard = {}, loading } = state;
  const { onboardingOverview = {} } = onboard;
  const { provisionalOffers = {}, dataAll = [], total = '' } = onboardingOverview;

  return {
    provisionalOffers,
    total,
    dataAll,
    loadingAll: loading.effects['onboard/fetchOnboardListAll'],
  };
})(ProvisionalOffers);
