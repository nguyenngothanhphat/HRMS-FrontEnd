import React, { useEffect } from 'react';
import { connect } from 'umi';

import { PageContainer } from '@/layouts/layout/src';
import { Tabs, Affix } from 'antd';
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
  const { activeList, inactiveList, roleList, employeeList, dispatch, user, loading1 } = props;

  useEffect(() => {
    dispatch({
      type: 'projectManagement/getProjectByCompany',
      payload: {
        company: user.currentUser.company._id || '',
      },
    });
  }, []);

  return (
    <PageContainer>
      <div className={s.containerDashboard}>
        <Affix offsetTop={42}>
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
                  roleList={roleList}
                  employeeList={employeeList}
                  dispatch={dispatch}
                  user={user}
                  loading={loading1}
                />
              </TabPane>
              <TabPane
                // tab={formatMessage({ id: 'component.onboardingOverview.receivedSubmittedDocuments' })}
                tab="Inactive"
                key="2"
              >
                {/* <FinalOfferDrafts list={finalOfferDrafts} /> */}
                <InactiveProject
                  list={inactiveList}
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
                  roleList={roleList}
                  employeeList={employeeList}
                  dispatch={dispatch}
                  user={user}
                  loading={loading1}
                />
              </TabPane>
            </Tabs>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default connect(
  ({
    user,
    projectManagement: {
      activeList = [],
      inactiveList = [],
      roleList = [],
      employeeList = [],
    } = {},
    loading,
  }) => ({
    user,
    activeList,
    inactiveList,
    roleList,
    employeeList,
    loading1: loading.effects['projectManagement/addMember'],
  }),
)(ProjectManagement);
