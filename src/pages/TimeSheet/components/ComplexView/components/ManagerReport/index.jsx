import { Tabs } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import { connect } from 'umi';
import { exportRawDataToCSV } from '@/utils/exportToCsv';
import CustomOrangeButton from '@/components/CustomOrangeButton';
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
  const {
    dispatch,
    timeSheet: { payloadExport = {}, projectList = [] } = {},
    permissions = {},
  } = props;

  // Format fromDate and toDate
  const { fromDate, toDate, projectId } = payloadExport;
  const startDate = moment(fromDate)
    .locale('en')
    .format('ll')
    .replace(/[, \s]+/g, '');
  const endDate = moment(toDate)
    .locale('en')
    .format('ll')
    .replace(/[, \s]+/g, '');

  const project = projectList.find((list) => list.id === projectId);

  // PERMISSIONS TO VIEW PROJECT OR TEAM
  const viewReportProject = permissions.viewReportProjectViewTimesheet === 1;
  const viewReportTeam = permissions.viewReportTeamViewTimesheet === 1;

  const [activeKey, setActiveKey] = useState(
    (viewReportProject && VIEW_TYPE.PROJECT_VIEW) || (viewReportTeam && VIEW_TYPE.TEAM_VIEW),
  );

  const exportToCSV = async (type, fileName) => {
    const getListExport = await dispatch({
      type,
      payload: payloadExport,
    });
    const getDataExport = getListExport ? getListExport.data : '';
    exportRawDataToCSV(getDataExport, fileName);
  };

  const exportTag = () => {
    if (activeKey === VIEW_TYPE.PROJECT_VIEW) {
      return exportToCSV(
        'timeSheet/exportReportProject',
        `ProjectView-${project?.projectName || ''}-${startDate}-${endDate}.csv`,
      );
    }
    return exportToCSV('timeSheet/exportReportTeam', `TeamView-${startDate}-${endDate}.csv`);
  };

  const options = () => {
    return (
      <div className={styles.options}>
        <CustomOrangeButton icon={DownloadIcon} onClick={exportTag}>
          Export
        </CustomOrangeButton>
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
        {viewReportProject && (
          <TabPane tab="Project View" key={VIEW_TYPE.PROJECT_VIEW}>
            <ProjectView activeView={activeKey} />
          </TabPane>
        )}

        {viewReportTeam && (
          <TabPane tab="Team View" key={VIEW_TYPE.TEAM_VIEW}>
            <TeamView activeView={activeKey} />
          </TabPane>
        )}
      </Tabs>
    </div>
  );
};

export default connect(({ user, user: { permissions = [] } = {}, timeSheet }) => ({
  user,
  timeSheet,
  permissions,
}))(ManagerReport);
