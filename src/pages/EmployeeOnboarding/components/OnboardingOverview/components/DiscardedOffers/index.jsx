import React, { PureComponent } from 'react';
import { Tabs, Input } from 'antd';
import { connect } from 'umi';
import { SearchOutlined } from '@ant-design/icons';

// import SentFinalOffers from './components/SentFinalOffers/index';
// import AcceptedFinalOffers from './components/AcceptedFinalOffers/index';
// import RenegotitateFinalOffers from './components/RenegotiateFinalOffers/index';
import { PROCESS_STATUS } from '@/utils/onboarding';
import { debounce } from 'lodash';
import ProvisionalOffers from './components/ProvisionalOffers/index';
import FinalOffers from './components/FinalOffers/index';
import AllTab from './components/AllTab';

import styles from './index.less';

const { TabPane } = Tabs;

class DiscardedOffers extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tabId: '1',
      pageSelected: 1,
      size: 10,
      nameSearch: '',
    };
    this.setDebounce = debounce((query) => {
      this.setState({
        nameSearch: query,
      });
    }, 500);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { PROVISIONAL_OFFERS, FINAL_OFFERS } = PROCESS_STATUS;

    if (dispatch) {
      this.fetchBackgroundCheckAll([PROVISIONAL_OFFERS, FINAL_OFFERS]);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { tabId, pageSelected, size, nameSearch } = this.state;
    if (
      prevState.tabId !== tabId ||
      prevState.pageSelected !== pageSelected ||
      prevState.size !== size ||
      prevState.nameSearch !== nameSearch
    ) {
      this.onChangeTab(tabId);
    }
  }

  fetchBackgroundCheckAll = (status) => {
    const { dispatch } = this.props;
    const { pageSelected, size, nameSearch } = this.props;
    dispatch({
      type: 'onboard/fetchOnboardListAll',
      payload: {
        processStatus: status,
        page: pageSelected,
        limit: size,
        name: nameSearch,
      },
    });
  };

  fetchBackgroundCheck = (status) => {
    const { dispatch } = this.props;
    const { pageSelected, size, nameSearch } = this.props;
    dispatch({
      type: 'onboard/fetchOnboardList',
      payload: {
        processStatus: status,
        page: pageSelected,
        limit: size,
        name: nameSearch,
      },
    });
  };

  getPageAndSize = (page, pageSize) => {
    this.setState({
      pageSelected: page,
      size: pageSize,
    });
  };

  onChangeTab = (key) => {
    const { PROVISIONAL_OFFERS, FINAL_OFFERS } = PROCESS_STATUS;
    this.setState({
      tabId: key,
    });
    if (key === '1') {
      this.fetchBackgroundCheckAll([PROVISIONAL_OFFERS, FINAL_OFFERS]);
    } else if (key === '2') {
      this.fetchBackgroundCheck(PROVISIONAL_OFFERS);
    } else {
      this.fetchBackgroundCheck(FINAL_OFFERS);
    }
  };

  onChange = (e) => {
    this.setDebounce(e.target.value);
  };

  render() {
    const { discardedOffers = {}, dataAll, loadingAll, total } = this.props;
    const { provisionalOffers = [], finalOffers = [] } = discardedOffers;
    const { tabId, pageSelected, size } = this.state;
    return (
      <div className={styles.DiscardedOffers}>
        <div className={styles.tabs}>
          <Tabs
            defaultActiveKey={tabId}
            onChange={this.onChangeTab}
            tabBarExtraContent={
              <Input
                onChange={this.onChange}
                placeholder="Search by candidate ID"
                prefix={<SearchOutlined />}
              />
            }
          >
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
              tab="provisional offers"
              key="2"
            >
              {/* <SentFinalOffers list={sentFinalOffers} /> */}
              <ProvisionalOffers
                list={provisionalOffers}
                pageSelected={pageSelected}
                size={size}
                getPageAndSize={this.getPageAndSize}
                total={total}
              />
            </TabPane>

            <TabPane
              // tab={formatMessage({ id: 'component.onboardingOverview.receivedSubmittedDocuments' })}
              tab="final offers"
              key="3"
            >
              <FinalOffers
                list={finalOffers}
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
  const { discardedOffers = {}, dataAll = [], total = '' } = onboardingOverview;

  return {
    discardedOffers,
    total,
    dataAll,
    loadingAll: loading.effects['onboard/fetchOnboardListAll'],
  };
})(DiscardedOffers);
