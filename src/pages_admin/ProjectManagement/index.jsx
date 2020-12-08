import React, { useEffect } from 'react';
import { connect } from 'umi';

import { PageContainer } from '@/layouts/layout/src';
import { Tabs, Affix } from 'antd';
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
  const { activeList, inactiveList, dispatch } = props;

  useEffect(() => {
    dispatch({
      type: 'projectManagement/getProjectByCompany',
      payload: {
        company: '5e8723f131c6e53d60ae9678',
      },
    });
  }, []);

  console.log(props);

  return (
    <PageContainer>
      <div className={s.containerDashboard}>
        <Affix offsetTop={40}>
          <div className={s.titlePage}>
            <p className={s.titlePage__text}>Project list</p>
          </div>
        </Affix>

        <div className={s.projectManagement}>
          {/* <h1>Project list</h1> */}
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
      </div>
    </PageContainer>
  );

  // return (
  //   <div className={s.projectManagement}>
  //     <h1>Project list</h1>
  //     <div className={s.tabs}>
  //       <Tabs defaultActiveKey="1">
  //         <TabPane
  //           // tab={formatMessage({ id: 'component.onboardingOverview.sentEligibilityForms' })}
  //           tab="Active"
  //           key="1"
  //         >
  //           {/* <ProvisionalOfferDrafts list={provisionalOfferDrafts} /> */}
  //           <ActiveProject
  //             list={activeList}
  //             columnArr={[
  //               PROJECT_ID,
  //               PROJECT_NAME,
  //               CREATED_DATE,
  //               PROJECT_MANAGER,
  //               DURATION,
  //               START_DATE,
  //               MEMBERS,
  //               PROJECT_HEALTH,
  //               ACTION,
  //             ]}
  //           />
  //         </TabPane>
  //         <TabPane
  //           // tab={formatMessage({ id: 'component.onboardingOverview.receivedSubmittedDocuments' })}
  //           tab="Inactive"
  //           key="2"
  //         >
  //           {/* <FinalOfferDrafts list={finalOfferDrafts} /> */}
  //           <InactiveProject list={inactiveList} />
  //         </TabPane>
  //       </Tabs>
  //     </div>
  //   </div>
  // );
};

// export default connect(({ projectManagement: { listData = [] } = {} }) => ({
//   listData,
// }))(ProjectManagement);
export default connect(({ projectManagement: { activeList = [], inactiveList = [] } = {} }) => ({
  activeList,
  inactiveList,
}))(ProjectManagement);
