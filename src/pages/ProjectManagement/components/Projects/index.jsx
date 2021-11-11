import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import { Button } from 'antd';
import CommonTable from './components/CommonTable';
import OrangeAddIcon from '@/assets/projectManagement/orangeAdd.svg';
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

  const viewProjectInformation = () => {
    history.push(`/project-management/list/id`);
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
        render: (projectName) => {
          return (
            <span className={styles.clickableTag} onClick={() => viewProjectInformation()}>
              {projectName || '-'}
            </span>
          );
        },
      },
      {
        title: 'Customer',
        dataIndex: 'customerId',
        key: 'customerId',
        render: (customerId) => {
          return <span className={styles.clickableTag}>{customerId || '-'}</span>;
        },
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
            <span className={styles.clickableTag}>
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
          return <span className={styles.colorTag}>{division.name}</span>;
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
          if (!resource) {
            return (
              <Button className={styles.addResourceBtn} icon={<img src={OrangeAddIcon} alt="" />}>
                Add resources
              </Button>
            );
          }
          return <span className={styles.blueText}>{resource || '-'}</span>;
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
