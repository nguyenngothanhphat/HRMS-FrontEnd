import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { Tabs } from 'antd';

import {
  COLUMN_NAME,
  TABLE_TYPE,
} from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/utils';
import OnboardTable from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/OnboardTable';
import styles from './index.less';
import ProvisionalOfferDrafts from './components/ProvisionalOfferDrafts';
import FinalOfferDrafts from './components/FinalOfferDrafts';

const { TabPane } = Tabs;

const { ID, NAME, POSITION, LOCATION, DATE_JOIN, ACTION } = COLUMN_NAME;
const { FINAL_OFFERS_DRAFTS } = TABLE_TYPE;

class AllDrafts extends PureComponent {
  render() {
    const { allDrafts = {} } = this.props;
    // console.log(allDrafts);
    const { provisionalOfferDrafts = [], finalOfferDrafts = [] } = allDrafts;
    // console.log(provisionalOfferDrafts);

    return (
      // <OnboardTable
      //   list={finalOfferDrafts}
      //   columnArr={[ID, NAME, POSITION, LOCATION, DATE_JOIN, ACTION]}
      //   type={FINAL_OFFERS_DRAFTS}
      // />
      <div className={styles.AllDrafts}>
        <div className={styles.tabs}>
          <Tabs defaultActiveKey="1">
            <TabPane
              // tab={formatMessage({ id: 'component.onboardingOverview.sentEligibilityForms' })}
              tab="provisional offer drafts"
              key="1"
            >
              <ProvisionalOfferDrafts list={provisionalOfferDrafts} />
            </TabPane>
            <TabPane
              // tab={formatMessage({ id: 'component.onboardingOverview.receivedSubmittedDocuments' })}
              tab="final offers draft"
              key="2"
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
  const { onboard = {} } = state;
  const { onboardingOverview = {} } = onboard;
  const { finalOfferDrafts = [], allDrafts = {} } = onboardingOverview;
  return {
    finalOfferDrafts,
    allDrafts,
  };
})(AllDrafts);
