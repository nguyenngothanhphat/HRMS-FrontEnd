import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { getCurrentCompany } from '@/utils/authority';
import { PageContainer } from '@/layouts/layout/src';
import { Tabs, Affix } from 'antd';
import AddIcon from '@/assets/plusIcon1.svg';
import ActiveProject from './components/ActiveProject';
import InactiveProject from './components/InactiveProject';
import AddProjectModal from './components/AddProjectModal';
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
  const {
    activeList,
    inactiveList,
    totalActive,
    totalInactive,
    roleList,
    employeeList,
    dispatch,
    user,
    loading1,
    listLocationsByCompany = [],
    companiesOfUser = [],
    loadingFetchProject = false,
  } = props;
  const [isModalVisible, setModalVisible] = useState(false);
  const [pageSelected, setPageSelected] = useState(1);
  const [size, setSize] = useState(10);

  const fetchData = () => {
    dispatch({
      type: 'projectManagement/getProjectByCompany',
      payload: {
        company: getCurrentCompany(),
        page: pageSelected,
        limit: size,
      },
    });
  };

  const getPageAndSize = (page, pageSize) => {
    setPageSelected(page);
    setSize(pageSize);
  };

  useEffect(() => {
    fetchData();
  }, [pageSelected, size]);

  const handleAddNewProject = () => {
    setModalVisible(true);
  };

  const addNewProject = () => {
    return (
      <div className={s.addNewProject} onClick={handleAddNewProject}>
        <img src={AddIcon} alt="add" />
        <span>Add new project</span>
      </div>
    );
  };

  const onDone = () => {
    setModalVisible(false);
    fetchData();
  };

  const onTabClick = () => {
    fetchData();
  };

  return (
    <PageContainer>
      <div className={s.containerDashboard}>
        <Affix offsetTop={30}>
          <div className={s.titlePage}>
            <p className={s.titlePage__text}>Projects Management</p>
          </div>
        </Affix>

        <div className={s.projectManagement}>
          {/* <h1>Project list</h1> */}
          <div className={s.tabs}>
            <Tabs onTabClick={onTabClick} defaultActiveKey="1" tabBarExtraContent={addNewProject()}>
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
                  getPageAndSize={getPageAndSize}
                  employeeList={employeeList}
                  pageSelected={pageSelected}
                  size={size}
                  dispatch={dispatch}
                  totalActive={totalActive}
                  user={user}
                  loading={loading1}
                  listLocationsByCompany={listLocationsByCompany}
                  companiesOfUser={companiesOfUser}
                  loadingFetchProject={loadingFetchProject}
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
                  getPageAndSize={getPageAndSize}
                  totalInactive={totalInactive}
                  pageSelected={pageSelected}
                  size={size}
                  employeeList={employeeList}
                  dispatch={dispatch}
                  user={user}
                  loading={loading1}
                  loadingFetchProject={loadingFetchProject}
                />
              </TabPane>
            </Tabs>
            <AddProjectModal visible={isModalVisible} onDone={onDone} />
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
      totalActive = '',
      totalInactive = '',
    } = {},
    locationSelection: { listLocationsByCompany = [] } = {},
    loading,
  }) => ({
    user,
    activeList,
    totalActive,
    totalInactive,
    inactiveList,
    roleList,
    employeeList,
    listLocationsByCompany,
    companiesOfUser: user.companiesOfUser,
    loading1: loading.effects['projectManagement/addMember'],
    loadingFetchProject: loading.effects['projectManagement/getProjectByCompany'],
  }),
)(ProjectManagement);
