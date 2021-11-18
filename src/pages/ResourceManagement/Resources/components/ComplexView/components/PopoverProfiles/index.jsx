import { Tabs, Button } from 'antd';
import React, { useState } from 'react';
import { connect } from 'umi';
import ProjectView from './components/ProjectView';
import TeamView from './components/TeamView';
import styles from './index.less';
import DownloadIcon from '@/assets/timeSheet/download.svg';

const { TabPane } = Tabs;

const ManagerReport = (props) => {
  // others
  const [activeKey, setActiveKey] = useState('project-view');

  const options = () => {
    return (
      <div className={styles.options}>
        <Button className={styles.exportBtn} icon={<img src={DownloadIcon} alt="" />}>
          Export
        </Button>
      </div>
    );
  };

  // MAIN AREA
  return (
    <div className={styles.ManagerReport}>
      <Tabs
        activeKey={activeKey}
        onChange={(key) => setActiveKey(key)}
        tabBarExtraContent={options()}
      >
        <TabPane tab="Project View" key="project-view">
          <ProjectView />
        </TabPane>
        <TabPane tab="Team View" key="team-view">
          <TeamView />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default connect(({resourceManagement: { projectList=[]}}) => ({projectList}))(ManagerReport);