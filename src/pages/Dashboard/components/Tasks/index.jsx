import { Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import SmallDownArrow from '@/assets/dashboard/smallDownArrow.svg';
import CommonModal from './components/CommonModal';
import LeftArrow from '@/assets/dashboard/leftArrow.svg';
import MyTasks from './components/MyTasks';
import styles from './index.less';
import MyProjects from './components/MyProjects';

const { TabPane } = Tabs;
const MANAGER = 'MANAGER';
const Tasks = (props) => {
  const [activeKey, setActiveKey] = useState('1');
  const [modalVisible, setModalVisible] = useState(false);
  const { dispatch, roles = [], myId = '' } = props;

  useEffect(() => {
    dispatch({
      type: 'dashboard/fetchProjectList',
      payload: {},
      myId,
    });
  }, []);

  const renderTasksAction = () => {
    return (
      <div className={styles.header__actions}>
        <span>Sort By</span>
        <img src={SmallDownArrow} alt="" />
      </div>
    );
  };
  const checkRoleHrAndManager = roles.includes(MANAGER);
  // MAIN
  return (
    <div className={styles.Tasks}>
      <div>
        <div className={styles.header}>
          <span className={styles.header__headerText}>Tasks</span>
          {activeKey === '1' && renderTasksAction()}
          {activeKey === '2' && renderTasksAction()}
        </div>
        <div className={styles.content}>
          <Tabs activeKey={activeKey} onTabClick={(key) => setActiveKey(key)}>
            <TabPane tab="My Tasks" key="1">
              <MyTasks />
            </TabPane>
            {checkRoleHrAndManager ? (
              <TabPane tab="My Projects" key="2">
                <MyProjects />
              </TabPane>
            ) : (
              ''
            )}
          </Tabs>
        </div>
      </div>
      <div className={styles.viewAllBtn} onClick={() => setModalVisible(true)}>
        {activeKey === '1' && <span>View all Tasks</span>}
        {activeKey === '2' && <span>View all Projects</span>}
        <img src={LeftArrow} alt="expand" />
      </div>
      <CommonModal
        visible={modalVisible}
        title={activeKey === '1' ? `My Tasks` : 'My Projects'}
        onClose={() => setModalVisible(false)}
        tabKey={activeKey}
      />
    </div>
  );
};

export default connect(
  ({
    user: {
      currentUser: { employee: { generalInfo: { _id: myId = '' } = {} } = {}, roles = [] } = {},
    } = {},
    dashboard: { projectList = [], resoucreList = [] } = {},
  }) => ({
    myId,
    roles,
    projectList,
    resoucreList,
  }),
)(Tasks);
