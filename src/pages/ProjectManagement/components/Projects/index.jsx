import { Button } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import { DATE_FORMAT_LIST } from '@/utils/projectManagement';
import OrangeAddIcon from '@/assets/projectManagement/orangeAdd.svg';
import CommonTable from './components/CommonTable';
import Header from './components/Header';
import styles from './index.less';

const Projects = (props) => {
  const { projectList = [], statusSummary = [], dispatch, loadingFetchProjectList = false } = props;
  const [projectStatus, setProjectStatus] = useState('All');

  const fetchStatusSummary = () => {
    dispatch({
      type: 'projectManagement/fetchStatusSummaryEffect',
    });
  };

  const fetchProjectList = async (payload) => {
    let tempPayload = payload;
    if (projectStatus !== 'All') {
      tempPayload = {
        ...payload,
        projectStatus: [projectStatus],
      };
    }
    const res = await dispatch({
      type: 'projectManagement/fetchProjectListEffect',
      payload: tempPayload,
    });
    if (res.statusCode === 200) {
      fetchStatusSummary();
    }
  };

  const viewProjectInformation = (projectId) => {
    history.push(`/project-management/list/${projectId}/summary`);
  };

  const viewProfile = (id) => {
    const url = `/directory/employee-profile/${id}`;
    window.open(url, '_blank');
  };

  useEffect(() => {
    dispatch({
      type: 'projectManagement/fetchProjectStatusListEffect',
    });
  }, []);

  useEffect(() => {
    if (projectStatus !== 'All') {
      fetchProjectList({ projectStatus: [projectStatus] });
    } else fetchProjectList();
  }, [projectStatus]);

  const generateColumns = () => {
    const columns = [
      {
        title: 'Project Name',
        dataIndex: 'projectName',
        key: 'projectName',
        render: (projectName, row) => {
          return (
            <span
              className={styles.clickableTag}
              onClick={() => viewProjectInformation(row?.projectId)}
            >
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
        title: 'Project Type',
        dataIndex: 'engagementType',
        key: 'engagementType',
        render: (engagementType) => <span>{engagementType || '-'}</span>,
      },
      {
        title: 'Project Manager',
        dataIndex: 'projectManager',
        key: 'projectManager',
        render: (projectManager) => {
          return (
            <span
              className={styles.clickableTag}
              onClick={() => viewProfile(projectManager?.generalInfo?.userId)}
            >
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
          return (
            <span>{startDate ? moment(startDate).locale('en').format(DATE_FORMAT_LIST) : '-'}</span>
          );
        },
      },
      {
        title: 'End Date*',
        dataIndex: 'tentativeEndDate',
        key: 'tentativeEndDate',
        render: (tentativeEndDate = '') => {
          return (
            <span>
              {tentativeEndDate
                ? moment(tentativeEndDate).locale('en').format(DATE_FORMAT_LIST)
                : '-'}
            </span>
          );
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
          return <span>{pmStatus || '-'}</span>;
        },
      },
      {
        title: 'Resources',
        dataIndex: 'resources',
        key: 'resources',
        width: '7%',
        render: (resources = '') => {
          if (!resources) {
            return (
              <Button className={styles.addResourceBtn} icon={<img src={OrangeAddIcon} alt="" />}>
                Add
              </Button>
            );
          }
          return <span className={styles.blueText}>{resources || '-'}</span>;
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
          statusSummary={statusSummary}
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
    projectManagement: { projectList = [], statusSummary = [] } = {},
    user: { currentUser = {}, permissions = [] } = {},
    loading,
  }) => ({
    currentUser,
    permissions,
    projectList,
    statusSummary,
    loadingFetchProjectList: loading.effects['projectManagement/fetchProjectListEffect'],
  }),
)(Projects);
