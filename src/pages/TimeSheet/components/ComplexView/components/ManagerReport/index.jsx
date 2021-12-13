import { Tabs, Button } from 'antd';
import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import ProjectView from './components/ProjectView';
import TeamView from './components/TeamView';
import styles from './index.less';
import DownloadIcon from '@/assets/timeSheet/download.svg';

const { TabPane } = Tabs;

const VIEW_TYPE = {
  TEAM_VIEW: 'team-view',
  PROJECT_VIEW: 'project-view',
};
const ManagerReport = () => {
  // others
  const [activeKey, setActiveKey] = useState(VIEW_TYPE.PROJECT_VIEW);

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
        <TabPane tab="Project View" key={VIEW_TYPE.PROJECT_VIEW}>
          <ProjectView />
        </TabPane>
        <TabPane tab="Team View" key={VIEW_TYPE.TEAM_VIEW}>
          <TeamView />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default connect(({ user: { currentUserRoles = [] } }) => ({ currentUserRoles }))(
  ManagerReport,
);
