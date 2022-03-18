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
  const { dispatch, roles = [], myId = '', projectList = [] } = props;
  const result = projectList.filter((val) => val.projectManager !== null);
  const newProjectList = result.filter((val) => val.projectManager.generalInfo._id === myId);

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
  const checkRoleManager = roles.includes(MANAGER);
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
            <TabPane tab="My Tasks [Dummy data]" key="1">
              <MyTasks />
            </TabPane>
            {checkRoleManager ? (
              <TabPane tab="My Projects" key="2">
                <MyProjects />
              </TabPane>
            ) : (
              ''
            )}
          </Tabs>
        </div>
      </div>
      {activeKey === '1' && (
        <div className={styles.viewAllBtn} onClick={() => setModalVisible(true)}>
          {activeKey === '1' && <span>View all Tasks</span>}
          <img src={LeftArrow} alt="expand" />
        </div>
      )}
      {activeKey === '2' && newProjectList.length > 0 && (
        <div className={styles.viewAllBtn} onClick={() => setModalVisible(true)}>
          {activeKey === '2' && <span>View all Project</span>}
          <img src={LeftArrow} alt="expand" />
        </div>
      )}
      {activeKey === '2' && newProjectList.length === 0 && <div className={styles.addLength} />}
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
    dashboard: { projectList = [] } = {},
  }) => ({
    myId,
    roles,
    projectList,
  }),
)(Tasks);
