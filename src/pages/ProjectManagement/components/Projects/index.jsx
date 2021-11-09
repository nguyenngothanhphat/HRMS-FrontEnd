import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import CommonTable from './components/CommonTable';
import Header from './components/Header';
import styles from './index.less';

const Projects = (props) => {
  const { projectList = [], dispatch, loadingFetchProjectList = false } = props;
  const [projectStatus, setProjectStatus] = useState('All');

  const fetchProjectList = (name = '') => {
    dispatch({
      type: 'projectManagement/fetchProjectListEffect',
      payload: {
        name,
      },
    });
  };

  useEffect(() => {
    fetchProjectList();
  }, []);

  const generateColumns = () => {
    const columns = [
      {
        title: 'Project Name',
        dataIndex: 'projectName',
        key: 'projectName',
      },
      {
        title: 'Customer',
        dataIndex: 'customerId',
        key: 'customerId',
      },
      {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
      },
      {
        title: 'Project Manager',
        dataIndex: 'projectManager',
        key: 'projectManager',
        render: (projectManager) => {
          return (
            <span className={styles.projectManager}>
              {projectManager?.generalInfo?.legalName || '-'}
            </span>
          );
        },
      },
      {
        title: 'Start Date',
        dataIndex: 'startDate',
        key: 'startDate',
        render: (startDate = '') => {
          return <span>{startDate || '-'}</span>;
        },
      },
      {
        title: 'End Date*',
        dataIndex: 'tentativeEndDate',
        key: 'tentativeEndDate',
        render: (tentativeEndDate = '') => {
          return <span>{tentativeEndDate || '-'}</span>;
        },
      },
      {
        title: 'Division',
        dataIndex: 'division',
        key: 'division',
        render: (division = {}) => {
          return <span>{division.name}</span>;
        },
      },
      {
        title: 'Status',
        dataIndex: 'projectStatus',
        key: 'projectStatus',
        render: (pmStatus = '') => {
          return <span>{pmStatus}</span>;
        },
      },
      {
        title: 'Resource',
        dataIndex: 'resource',
        key: 'resource',
        render: (resource = '') => {
          return <span>{resource || '-'}</span>;
        },
      },
    ];

    return columns;
  };

  return (
    <div className={styles.Projects}>
      <div className={styles.header}>
        <Header
          projectStatus={projectStatus}
          setProjectStatus={setProjectStatus}
          fetchProjectList={fetchProjectList}
        />
      </div>
      <div
        className={styles.tableContainer}
        style={projectList.length === 0 ? {} : { paddingBottom: '0' }}
      >
        <CommonTable
          columns={generateColumns()}
          list={projectList}
          loading={loadingFetchProjectList}
        />
      </div>
    </div>
  );
};
export default connect(
  ({
    projectManagement: { projectList = [] } = {},
    user: { currentUser = {}, permissions = [] } = {},
    loading,
  }) => ({
    currentUser,
    permissions,
    projectList,
    loadingFetchProjectList: loading.effects['projectManagement/fetchProjectListEffect'],
  }),
)(Projects);
