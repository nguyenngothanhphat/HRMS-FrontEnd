// /* eslint-disable react/prefer-stateless-function */
// /* eslint-disable react/jsx-no-undef */
// import React, { Component } from 'react';
// import { Tabs } from 'antd';
// import { formatMessage } from 'umi';
// import ReceivedSubmittedDocuments from './components/ReceivedSubmittedDocuments';
// import SentEligibilityForms from './components/SentEligibilityForms';

// import styles from './index.less';

// class PendingEligibilityChecks extends Component {
//   render() {
//     const { TabPane } = Tabs;

//     return (
//       <div className={styles.PendingEligibilityChecks}>
//         <div className={styles.tabs}>
//           <Tabs defaultActiveKey="1">
//             <TabPane
//               tab={formatMessage({ id: 'component.onboardingOverview.sentEligibilityForms' })}
//               key="1"
//             >
//               <SentEligibilityForms />
//             </TabPane>
//             <TabPane
//               tab={formatMessage({ id: 'component.onboardingOverview.receivedSubmittedDocuments' })}
//               key="2"
//             >
//               <ReceivedSubmittedDocuments />
//             </TabPane>
//           </Tabs>
//         </div>
//       </div>
//     );
//   }
// }

// export default PendingEligibilityChecks;

import React, { Component } from 'react';
import { Tabs } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { connect, formatMessage } from 'umi';

import OnboardTable from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/OnboardTable';
// import SentFinalOffers from './components/SentFinalOffers';
// import AcceptedFinalOffers from './components/AcceptedFinalOffers';
import ReceivedSubmittedDocuments from './components/ReceivedSubmittedDocuments';
import SentEligibilityForms from './components/SentEligibilityForms';

import { rookieList } from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/utils';

import styles from './index.less';

const { TabPane } = Tabs;

class PendingEligibilityChecks extends Component {
  render() {
    const { pendingEligibilityChecks = {} } = this.props;
    const { sentEligibilityForms = [], receivedSubmittedDocuments = [] } = pendingEligibilityChecks;

    return (
      <div className={styles.PendingEligibilityChecks}>
        <div className={styles.tabs}>
          <Tabs defaultActiveKey="1">
            <TabPane
              // tab={formatMessage({ id: 'component.onboardingOverview.sentEligibilityForms' })}
              tab="sent eligibility forms"
              key="1"
            >
              <SentEligibilityForms list={sentEligibilityForms} />
            </TabPane>
            <TabPane
              // tab={formatMessage({ id: 'component.onboardingOverview.receivedSubmittedDocuments' })}
              tab="received submitted documents"
              key="2"
            >
              <ReceivedSubmittedDocuments list={receivedSubmittedDocuments} />
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
  const { pendingEligibilityChecks = {} } = onboardingOverview;

  return {
    pendingEligibilityChecks,
  };
})(PendingEligibilityChecks);
