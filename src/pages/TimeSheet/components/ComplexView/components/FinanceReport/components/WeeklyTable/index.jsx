import { Avatar, Table, Tooltip } from 'antd';
import React, { useState } from 'react';
import { connect } from 'umi';
import { employeeColor } from '@/utils/timeSheet';
import ProjectDetailModal from '../../../ProjectDetailModal';
import SampleAvatar1 from '@/assets/dashboard/sampleAvatar1.png';
import SampleAvatar2 from '@/assets/dashboard/sampleAvatar2.png';
import SampleAvatar3 from '@/assets/dashboard/sampleAvatar3.png';
import styles from './index.less';

const members = [
  {
    name: 'Lewis',
    avatar: SampleAvatar1,
  },
  {
    name: 'Trung',
    avatar: SampleAvatar2,
  },
  {
    name: 'Anh',
    avatar: SampleAvatar3,
  },
];

const WeeklyTable = (props) => {
  const { data = [], limit = 10, selectedProjects = [], setSelectedProjects = () => {} } = props;
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
          <span style={{ display: 'block' }}>{member.name}</span>
        ))}
      </div>
    );
  };

  const generateColumns = () => {
    const columns = [
      {
        title: 'Project Name',
        dataIndex: 'project',
        key: 'project',
        render: (project, _, index) => (
          <div
            className={styles.renderProject}
            onClick={() => {
              setProjectDetailModalVisible(true);
              setHandlingProject(project);
            }}
          >
            <div className={styles.avatar}>
              <div className={styles.icon} style={{ backgroundColor: getColorByIndex(index) }}>
                <span>{project ? project.toString()?.charAt(0) : 'P'}</span>
              </div>
            </div>
            <div className={styles.right}>
              <span className={styles.name}>{project}</span>
            </div>
          </div>
        ),
      },
      {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
      },
      {
        title: 'Resources',
        dataIndex: 'resources',
        key: 'resources',
        render: () => {
          return (
            <Tooltip
              title={renderTooltipTitle(members)}
              placement="rightTop"
              getPopupContainer={(trigger) => {
                return trigger;
              }}
            >
              <div className={styles.taskMembers}>
                <Avatar.Group maxCount={4}>
                  {members.map((member) => {
                    return <Avatar size="small" src={member.avatar} />;
                  })}
                </Avatar.Group>
              </div>
            </Tooltip>
          );
        },
      },
      {
        title: 'Total Days',
        dataIndex: 'totalDays',
        key: 'totalDays',
      },
      {
        title: 'Total Hours',
        dataIndex: 'totalHours',
        key: 'totalHours',
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
      />
      <ProjectDetailModal
        visible={projectDetailModalVisible}
        onClose={() => setProjectDetailModalVisible(false)}
        projectId={handlingProject}
      />
    </div>
  );
};

export default connect(() => ({}))(WeeklyTable);
