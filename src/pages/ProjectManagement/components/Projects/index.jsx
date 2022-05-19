import { Button } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import { DATE_FORMAT_LIST } from '@/utils/projectManagement';
import OrangeAddIcon from '@/assets/projectManagement/orangeAdd.svg';
import EditIcon from '@/assets/projectManagement/edit2.svg';
import DeleteIcon from '@/assets/projectManagement/delete.svg';
import CommonTable from './components/CommonTable';
import Header from './components/Header';
import CommonModal from '@/components/CommonModal';
import EditProjectStatusModalContent from '../EditProjectStatusModalContent';
import DeleteProjectModalContent from '../DeleteProjectModalContent';
import styles from './index.less';

const Projects = (props) => {
  const {
    projectList = [],
    statusSummary = [],
    dispatch,
    loadingFetchProjectList = false,
    loadingUpdateProject = false,
    loadingDeleteProject = false,
    permissions = {},
  } = props;
  const [projectStatus, setProjectStatus] = useState('All');

  const [isEditProjectStatus, setIsEditProjectStatus] = useState(false);
  const [isDeleteProject, setIsDeleteProject] = useState(false);
  const [selectedProject, setSelectedProject] = useState('');

  const fetchProjectList = async (payload) => {
    let tempPayload = payload;
    if (projectStatus !== 'All') {
      tempPayload = {
        ...payload,
        projectStatus: [projectStatus],
      };
    }
    dispatch({
      type: 'projectManagement/fetchProjectListEffect',
      payload: tempPayload,
    });
    dispatch({
      type: 'projectManagement/fetchStatusSummaryEffect',
    });
  };

  const viewProjectInformation = (projectId) => {
    history.push(`/project-management/list/${projectId}/summary`);
  };

  const viewProfile = (id) => {
    const url = `/directory/employee-profile/${id}`;
    window.open(url, '_blank');
  };

  const addResource = (id) => {
    history.push(`/project-management/list/${id}/resources`);
  };

  useEffect(() => {
    fetchProjectList();
  }, [projectStatus]);

  useEffect(() => {
    dispatch({
      type: 'projectManagement/fetchProjectStatusListEffect',
    });
  }, []);

  // refresh list without losing filter, search
  const onRefresh = () => {
    dispatch({
      type: 'projectManagement/refreshProjectList',
    });
  };

  const renderTimeTitle = (title) => {
    return (
      <span className={styles.timeTitle}>
        <span>{title}</span>
        <span className={styles.smallText}>(mm/dd/yyyy)</span>
      </span>
    );
  };

  // permissions
  const modifyProjectPermission = permissions.modifyProject !== -1;

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
        dataIndex: 'customerName',
        key: 'customerName',
        render: (customerName) => {
          return <span className={styles.clickableTag}>{customerName || '-'}</span>;
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
        title: renderTimeTitle('Start Date'),
        dataIndex: 'startDate',
        key: 'startDate',
        align: 'center',
        render: (startDate = '') => {
          return (
            <span>{startDate ? moment(startDate).locale('en').format(DATE_FORMAT_LIST) : '-'}</span>
          );
        },
      },
      {
        title: renderTimeTitle('End Date'),
        dataIndex: 'tentativeEndDate',
        key: 'tentativeEndDate',
        align: 'center',
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
        render: (division) => {
          return <span className={styles.colorTag}>{division || ''}</span>;
        },
      },
      {
        title: 'Status',
        dataIndex: 'projectStatus',
        key: 'projectStatus',
        render: (pmStatus = '', record = {}) => {
          return (
            <div className={styles.projectStatus}>
              <span>{pmStatus || '-'}</span>
              {modifyProjectPermission && (
                <img
                  src={EditIcon}
                  alt=""
                  onClick={() => {
                    setSelectedProject(record);
                    setIsEditProjectStatus(true);
                  }}
                />
              )}
            </div>
          );
        },
      },
      {
        title: 'Resources',
        dataIndex: 'numberOfResource',
        key: 'numberOfResource',
        width: '7%',
        align: 'center',
        render: (numberOfResource, row) => {
          if ((!numberOfResource || numberOfResource === 0) && modifyProjectPermission) {
            return (
              <Button
                className={styles.addResourceBtn}
                icon={<img src={OrangeAddIcon} alt="" />}
                onClick={() => addResource(row?.projectId)}
              >
                Add
              </Button>
            );
          }
          return (
            <span
              className={styles.blueText}
              onClick={() => addResource(row?.projectId)}
              style={{ cursor: 'pointer' }}
            >
              {numberOfResource || '-'}
            </span>
          );
        },
      },
      {
        title: 'Action',
        key: 'action',
        align: 'center',
        render: (record) => {
          return (
            <div className={styles.btnAction}>
              <Button
                type="link"
                shape="circle"
                onClick={() => {
                  setSelectedProject(record);
                  setIsDeleteProject(true);
                }}
              >
                <img src={DeleteIcon} alt="delete" />
              </Button>
            </div>
          );
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
      <div className={styles.tableContainer}>
        <CommonTable
          columns={generateColumns()}
          list={projectList}
          loading={loadingFetchProjectList}
        />
      </div>

      <CommonModal
        visible={isEditProjectStatus}
        onClose={() => setIsEditProjectStatus(false)}
        firstText="Save Changes"
        cancelText="Cancel"
        title="Edit Status"
        loading={loadingUpdateProject}
        content={
          <EditProjectStatusModalContent
            onClose={() => setIsEditProjectStatus(false)}
            selectedProject={selectedProject}
            onRefresh={onRefresh}
          />
        }
        width={600}
      />

      <CommonModal
        visible={isDeleteProject}
        onClose={() => setIsDeleteProject(false)}
        firstText="Delete"
        cancelText="Cancel"
        title="Delete Project"
        loading={loadingDeleteProject}
        content={
          <DeleteProjectModalContent
            onClose={() => setIsDeleteProject(false)}
            selectedProject={selectedProject}
            onRefresh={onRefresh}
          />
        }
        width={600}
      />
    </div>
  );
};
export default connect(
  ({
    projectManagement: { projectList = [], statusSummary = [], projectListPayload = {} } = {},
    user: { currentUser = {}, permissions = {} } = {},
    loading,
  }) => ({
    currentUser,
    permissions,
    projectList,
    statusSummary,
    projectListPayload,
    loadingFetchProjectList: loading.effects['projectManagement/fetchProjectListEffect'],
    loadingUpdateProject: loading.effects['projectManagement/updateProjectEffect'],
    loadingDeleteProject: loading.effects['projectManagement/deleteProjectEffect'],
  }),
)(Projects);
