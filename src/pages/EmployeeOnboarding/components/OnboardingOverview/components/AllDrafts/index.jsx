import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { Tabs } from 'antd';

// import {
//   COLUMN_NAME,
//   TABLE_TYPE,
// } from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/utils';
// import OnboardTable from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/OnboardTable';
import { PROCESS_STATUS } from '@/models/onboard';
import styles from './index.less';
import ProvisionalOfferDrafts from './components/ProvisionalOfferDrafts';
import FinalOfferDrafts from './components/FinalOfferDrafts';
import AllTab from './components/AllTab';

const { TabPane } = Tabs;

// const { ID, NAME, POSITION, LOCATION, DATE_JOIN, ASSIGN_TO, ASSIGNEE_MANAGER, ACTION } = COLUMN_NAME;
// const { FINAL_OFFERS_DRAFTS } = TABLE_TYPE;

class AllDrafts extends PureComponent {
  // static getDerivedStateFromProps(nextProps, prevState) {
  //   console.log(prevState);
  //   console.log(nextProps);
  //   return { ...prevState, ...nextProps };
  // }

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
    const { PROVISIONAL_OFFER_DRAFT, FINAL_OFFERS_DRAFT } = PROCESS_STATUS;

    if (dispatch) {
      this.fetchOfferDraftAll([PROVISIONAL_OFFER_DRAFT, FINAL_OFFERS_DRAFT]);
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

  fetchOfferDraftAll = (status) => {
    const { pageSelected, size } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'onboard/fetchOnboardListAll',
      payload: {
        processStatus: status,
        page: pageSelected,
        limit: size,
      },
    });
  };

  fetchOfferDraft = (status) => {
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
    const { PROVISIONAL_OFFER_DRAFT, FINAL_OFFERS_DRAFT } = PROCESS_STATUS;
    this.setState({
      tabId: key,
    });
    if (key === '1') {
      this.fetchOfferDraftAll([PROVISIONAL_OFFER_DRAFT, FINAL_OFFERS_DRAFT]);
    } else if (key === '2') {
      this.fetchOfferDraft(PROVISIONAL_OFFER_DRAFT);
    } else {
      this.fetchOfferDraft(FINAL_OFFERS_DRAFT);
    }
  };

  getPageAndSize = (page, pageSize) => {
    this.setState({
      pageSelected: page,
      size: pageSize,
    });
  };

  render() {
    const { allDrafts = {}, dataAll, loadingAll, total } = this.props;
    const { tabId, pageSelected, size } = this.state;
    console.log('aaaaa');
    const { provisionalOfferDrafts = [], finalOfferDrafts = [] } = allDrafts;

    return (
      // <OnboardTable
      //   list={finalOfferDrafts}
      //   columnArr={[ID, NAME, POSITION, LOCATION, DATE_JOIN, ASSIGN_TO, ASSIGNEE_MANAGER, ACTION]}
      //   type={FINAL_OFFERS_DRAFTS}
      // />
      <div className={styles.AllDrafts}>
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
              tab="provisional offer drafts"
              key="2"
            >
              <ProvisionalOfferDrafts
                list={provisionalOfferDrafts}
                pageSelected={pageSelected}
                size={size}
                getPageAndSize={this.getPageAndSize}
                total={total}
              />
            </TabPane>
            <TabPane
              // tab={formatMessage({ id: 'component.onboardingOverview.receivedSubmittedDocuments' })}
              tab="final offers draft"
              key="3"
            >
              <FinalOfferDrafts
                list={finalOfferDrafts}
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

// export default FinalOfferDrafts;
export default connect((state) => {
  const { onboard = {}, loading } = state;
  const { onboardingOverview = {} } = onboard;
  const { finalOfferDrafts = [], allDrafts = {}, dataAll = [], total = '' } = onboardingOverview;
  return {
    finalOfferDrafts,
    total,
    allDrafts,
    dataAll,
    loadingAll: loading.effects['onboard/fetchOnboardListAll'],
  };
})(React.memo(AllDrafts));
