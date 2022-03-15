import { Button, Tabs } from 'antd';
import React, { useState } from 'react';
import { connect } from 'umi';
import DownloadIcon from '@/assets/timeSheet/download.svg';
import ProjectView from './components/ProjectView';
import TeamView from './components/TeamView';
import styles from './index.less';

const { TabPane } = Tabs;

const VIEW_TYPE = {
  TEAM_VIEW: 'team-view',
  PROJECT_VIEW: 'project-view',
};
const ManagerReport = (props) => {
  // others
  const { dispatch, timeSheet: { payloadFetch = {} } = {} } = props;
  const [activeKey, setActiveKey] = useState(VIEW_TYPE.PROJECT_VIEW);

  const exportToExcel = async (type, fileName) => {
    const getListExport = await dispatch({
      type,
      payload: payloadFetch,
    });
    const getDataExport = getListExport ? getListExport.data : '';
    const downloadLink = document.createElement('a');
    const universalBOM = '\uFEFF';
    downloadLink.href = `data:text/csv; charset=utf-8,${encodeURIComponent(
      universalBOM + getDataExport,
    )}`;
    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const exportTag = () => {
    if (activeKey === VIEW_TYPE.PROJECT_VIEW) {
      return exportToExcel('timeSheet/exportReportProject', 'project-view.xlsx');
    }
    return exportToExcel('timeSheet/exportReportTeam', 'team-view.xlsx');
  };

  const options = () => {
    return (
      <div className={styles.options}>
        <Button
          className={styles.exportBtn}
          icon={<img src={DownloadIcon} alt="Icon Download" />}
          onClick={exportTag}
        >
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
          <ProjectView activeView={activeKey} />
        </TabPane>
        <TabPane tab="Team View" key={VIEW_TYPE.TEAM_VIEW}>
          <TeamView activeView={activeKey} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default connect(({ user, timeSheet }) => ({ user, timeSheet }))(ManagerReport);
