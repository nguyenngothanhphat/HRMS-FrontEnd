import { Avatar, Tooltip } from 'antd';
import React, { useState } from 'react';
import { connect } from 'umi';
import MockAvatar from '@/assets/timeSheet/mockAvatar.jpg';
import CommonTable from '@/components/CommonTable';
import { employeeColor } from '@/utils/timeSheet';
import ProjectDetailModal from '../../../ProjectDetailModal';
import styles from './index.less';

const WeeklyTable = (props) => {
  const {
    data = [],
    selectedProjects = [],
    setSelectedProjects = () => {},
    loadingFetch = false,
    page = 1,
    limit = 10,
    onChangePagination = () => {},
    total = 0,
  } = props;

  const [projectDetailModalVisible, setProjectDetailModalVisible] = useState(false);
  const [handlingProject, setHandlingProject] = useState('');

  const getColorByIndex = (index) => {
    return employeeColor[index % employeeColor.length];
  };

  const renderTooltipTitle = (list) => {
    return (
      <div>
        {list.map((member) => (
          <span style={{ display: 'block' }}>{member.employee.legalName}</span>
        ))}
      </div>
    );
  };

  const onProjectClick = (projectId) => {
    setProjectDetailModalVisible(true);
    setHandlingProject(projectId);
  };

  const generateColumns = () => {
    const columns = [
      {
        title: 'Project Name',
        dataIndex: 'projectName',
        key: 'projectName',
        render: (projectName, row, index) => (
          <div className={styles.renderProject} onClick={() => onProjectClick(row?.projectId)}>
            <div className={styles.avatar}>
              <div className={styles.icon} style={{ backgroundColor: getColorByIndex(index) }}>
                <span>{projectName ? projectName.toString()?.charAt(0) : 'P'}</span>
              </div>
            </div>
            <div className={styles.right}>
              <span className={styles.name}>{projectName}</span>
            </div>
          </div>
        ),
      },
      {
        title: 'Type',
        dataIndex: 'engagementType',
        key: 'engagementType',
      },
      {
        title: 'Resources',
        dataIndex: 'resource',
        key: 'resource',
        render: (resource = []) => {
          return (
            <Tooltip
              title={renderTooltipTitle(resource)}
              placement="rightTop"
              getPopupContainer={(trigger) => {
                return trigger;
              }}
            >
              <div className={styles.taskMembers}>
                <Avatar.Group maxCount={4}>
                  {resource.map((member) => {
                    return <Avatar size="large" src={member.avatar || MockAvatar} />;
                  })}
                </Avatar.Group>
              </div>
            </Tooltip>
          );
        },
      },
      {
        title: 'Total Days',
        dataIndex: 'projectSpentInDay',
        key: 'projectSpentInDay',
        render: (projectSpentInDay = 0) => <span>{projectSpentInDay} Days</span>,
      },
      {
        title: 'Total Hours',
        dataIndex: 'projectSpentInHours',
        key: 'projectSpentInHours',
        render: (projectSpentInHours = 0) => <span>{projectSpentInHours} Hours</span>,
      },
    ];
    return columns;
  };

  // MAIN AREA
  return (
    <div className={styles.WeeklyTable}>
      <CommonTable
        columns={generateColumns()}
        list={data}
        selectedRowKeys={selectedProjects}
        setSelectedRowKeys={setSelectedProjects}
        rowKey="projectId"
        scrollable
        loading={loadingFetch}
        selectable
        isBackendPaging
        page={page}
        limit={limit}
        onChangePage={onChangePagination}
        total={total}
      />
      <ProjectDetailModal
        visible={projectDetailModalVisible}
        onClose={() => setProjectDetailModalVisible(false)}
        projectId={handlingProject}
        dataSource={data}
      />
    </div>
  );
};

export default connect(() => ({}))(WeeklyTable);
