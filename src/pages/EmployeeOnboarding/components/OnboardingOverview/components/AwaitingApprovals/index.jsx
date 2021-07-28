import React, { PureComponent } from 'react';
import { Input, Tabs } from 'antd';
import { connect } from 'umi';

import { PROCESS_STATUS } from '@/utils/onboarding';
import { debounce } from 'lodash';
import { SearchOutlined } from '@ant-design/icons';
import ApprovedFinalOffers from './components/ApprovedFinalOffers/index';
import SentForApprovals from './components/SentForApprovals/index';
import AllTab from './components/AllTab';

import styles from './index.less';

const { TabPane } = Tabs;

class AwaitingApprovals extends PureComponent {
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
    });
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { SENT_FOR_APPROVAL, APPROVED_OFFERS } = PROCESS_STATUS;

    if (dispatch) {
      this.fetchAwaitingApprovalsAll([SENT_FOR_APPROVAL, APPROVED_OFFERS]);
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

  fetchAwaitingApprovalsAll = (status) => {
    const { pageSelected, size, nameSearch } = this.state;
    const { dispatch } = this.props;
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

  onChange = (e) => {
    this.setDebounce(e.target.value);
  };

  fetchAwaitingApprovals = (status) => {
    const { pageSelected, size, nameSearch } = this.state;
    const { dispatch } = this.props;
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

  onChangeTab = (key) => {
    const { SENT_FOR_APPROVAL, APPROVED_OFFERS } = PROCESS_STATUS;
    this.setState({
      tabId: key,
    });
    if (key === '1') {
      this.fetchAwaitingApprovalsAll([SENT_FOR_APPROVAL, APPROVED_OFFERS]);
    } else if (key === '2') {
      this.fetchAwaitingApprovals(SENT_FOR_APPROVAL);
    } else {
      this.fetchAwaitingApprovals(APPROVED_OFFERS);
    }
  };

  getPageAndSize = (page, pageSize) => {
    this.setState({
      pageSelected: page,
      size: pageSize,
    });
  };

  render() {
    const { tabId, pageSelected, size } = this.state;
    const { awaitingApprovals = {}, dataAll, loadingAll, total } = this.props;
    const {
      sentForApprovals = [],
      approvedOffers = [],
      // rejectFinalOffer = [],
    } = awaitingApprovals;

    return (
      <div className={styles.AwaitingApprovals}>
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
            <TabPane tab="all" key="1">
              <AllTab
                list={dataAll}
                loading={loadingAll}
                pageSelected={pageSelected}
                size={size}
                getPageAndSize={this.getPageAndSize}
                total={total}
              />
            </TabPane>
            <TabPane tab="sent for approval" key="2">
              {/* <PendingApprovals list={pendingApprovals} /> */}
              <SentForApprovals
                list={sentForApprovals}
                pageSelected={pageSelected}
                size={size}
                getPageAndSize={this.getPageAndSize}
                total={total}
              />
            </TabPane>
            <TabPane tab="approved offers" key="3">
              {/* <ApprovedFinalOffers list={approvedFinalOffers} /> */}
              <ApprovedFinalOffers
                list={approvedOffers}
                pageSelected={pageSelected}
                size={size}
                getPageAndSize={this.getPageAndSize}
                total={total}
              />
            </TabPane>
            {/* <TabPane tab="reject final offers" key="3">
              <RejectFinalOffers list={rejectFinalOffer} />
            </TabPane> */}
          </Tabs>
        </div>
      </div>
    );
  }
}

// export default AwaitingApprovals;
export default connect((state) => {
  const { onboard = {}, loading } = state;
  const { onboardingOverview = {} } = onboard;
  const { awaitingApprovals = {}, dataAll = [], total = '' } = onboardingOverview;

  return {
    awaitingApprovals,
    total,
    dataAll,
    loadingAll: loading.effects['onboard/fetchOnboardListAll'],
  };
})(AwaitingApprovals);
