import { Avatar, Table, Tooltip } from 'antd';
import React, { useState } from 'react';
import { connect } from 'umi';
import { employeeColor } from '@/utils/timeSheet';
import ProjectDetailModal from '../../../ProjectDetailModal';
import MockAvatar from '@/assets/timeSheet/mockAvatar.jpg';
import styles from './index.less';

const WeeklyTable = (props) => {
  const {
    data = [],
    limit = 10,
    selectedProjects = [],
    setSelectedProjects = () => {},
    loadingFetch = false,
  } = props;
  const [pageSelected, setPageSelected] = useState(1);
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
                    return <Avatar size="small" src={member.avatar || MockAvatar} />;
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

  const onSelectChange = (values) => {
    setSelectedProjects(values);
  };

  const rowSelection = {
    selectedRowKeys: selectedProjects,
    onChange: onSelectChange,
  };

  const onChangePagination = (pageNumber) => {
    setPageSelected(pageNumber);
  };

  const pagination = {
    position: ['bottomLeft'],
    total: data.length,
    showTotal: (total, range) => (
      <span>
        {' '}
        Showing{' '}
        <b>
          {range[0]} - {range[1]}
        </b>{' '}
        of {total}{' '}
      </span>
    ),
    pageSize: limit,
    current: pageSelected,
    onChange: onChangePagination,
  };

  // MAIN AREA
  return (
    <div className={styles.WeeklyTable}>
      <Table
        columns={generateColumns()}
        dataSource={data}
        rowSelection={rowSelection}
        rowKey={(record) => record.id}
        pagination={false}
        scroll={selectedProjects.length > 0 ? { y: 400 } : {}}
        // pagination={pagination}
        loading={loadingFetch}
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
