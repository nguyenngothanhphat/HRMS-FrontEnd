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

// const { ID, NAME, POSITION, LOCATION, DATE_JOIN, ACTION } = COLUMN_NAME;
// const { FINAL_OFFERS_DRAFTS } = TABLE_TYPE;

class AllDrafts extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    const { PROVISIONAL_OFFER_DRAFT, FINAL_OFFERS_DRAFT } = PROCESS_STATUS;

    if (dispatch) {
      this.fetchOfferDraftAll([PROVISIONAL_OFFER_DRAFT, FINAL_OFFERS_DRAFT]);
    }
  }

  fetchOfferDraftAll = (status) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'onboard/fetchOnboardListAll',
      payload: {
        processStatus: status,
      },
    });
  };

  fetchOfferDraft = (status) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'onboard/fetchOnboardList',
      payload: {
        processStatus: status,
      },
    });
  };

  onChangeTab = (key) => {
    const { PROVISIONAL_OFFER_DRAFT, FINAL_OFFERS_DRAFT } = PROCESS_STATUS;
    if (key === '1') {
      this.fetchOfferDraftAll([PROVISIONAL_OFFER_DRAFT, FINAL_OFFERS_DRAFT]);
    } else if (key === '2') {
      this.fetchOfferDraft(PROVISIONAL_OFFER_DRAFT);
    } else {
      this.fetchOfferDraft(FINAL_OFFERS_DRAFT);
    }
  };

  render() {
    const { allDrafts = {}, dataAll, loadingAll } = this.props;

    const { provisionalOfferDrafts = [], finalOfferDrafts = [] } = allDrafts;

    return (
      // <OnboardTable
      //   list={finalOfferDrafts}
      //   columnArr={[ID, NAME, POSITION, LOCATION, DATE_JOIN, ACTION]}
      //   type={FINAL_OFFERS_DRAFTS}
      // />
      <div className={styles.AllDrafts}>
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
              tab="provisional offer drafts"
              key="2"
            >
              <ProvisionalOfferDrafts list={provisionalOfferDrafts} />
            </TabPane>
            <TabPane
              // tab={formatMessage({ id: 'component.onboardingOverview.receivedSubmittedDocuments' })}
              tab="final offers draft"
              key="3"
            >
              <FinalOfferDrafts list={finalOfferDrafts} />
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
  const { finalOfferDrafts = [], allDrafts = {}, dataAll = [] } = onboardingOverview;
  return {
    finalOfferDrafts,
    allDrafts,
    dataAll,
    loadingAll: loading.effects['onboard/fetchOnboardListAll'],
  };
})(React.memo(AllDrafts));
