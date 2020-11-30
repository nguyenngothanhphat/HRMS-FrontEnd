import React from 'react';
import { connect } from 'umi';

import { Tabs } from 'antd';
import TableComponent from './components/TableComponent';
import ActiveProject from './components/ActiveProject';
import InactiveProject from './components/InactiveProject';
import s from './index.less';

import COLUMN_NAME from './components/utils';

const { TabPane } = Tabs;

const {
  PROJECT_ID,
  PROJECT_NAME,
  CREATED_DATE,
  PROJECT_MANAGER,
  DURATION,
  START_DATE,
  MEMBERS,
  PROJECT_HEALTH,
  ACTION,
} = COLUMN_NAME;

const ProjectManagement = (props) => {
  const { activeList, inactiveList } = props;
  console.log(props);

  return (
    <div className={s.projectManagement}>
      <h1>ProjectManagement</h1>
      <div className={s.tabs}>
        <Tabs defaultActiveKey="1">
          <TabPane
            // tab={formatMessage({ id: 'component.onboardingOverview.sentEligibilityForms' })}
            tab="Active"
            key="1"
          >
            {/* <ProvisionalOfferDrafts list={provisionalOfferDrafts} /> */}
            <ActiveProject
              list={activeList}
              columnArr={[
                PROJECT_ID,
                PROJECT_NAME,
                CREATED_DATE,
                PROJECT_MANAGER,
                DURATION,
                START_DATE,
                MEMBERS,
                PROJECT_HEALTH,
                ACTION,
              ]}
            />
          </TabPane>
          <TabPane
            // tab={formatMessage({ id: 'component.onboardingOverview.receivedSubmittedDocuments' })}
            tab="Inactive"
            key="2"
          >
            {/* <FinalOfferDrafts list={finalOfferDrafts} /> */}
            <InactiveProject list={inactiveList} />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

// export default connect(({ projectManagement: { listData = [] } = {} }) => ({
//   listData,
// }))(ProjectManagement);
export default connect(({ projectManagement: { activeList = [], inactiveList = [] } = {} }) => ({
  activeList,
  inactiveList,
}))(ProjectManagement);
