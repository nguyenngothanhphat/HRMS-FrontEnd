import { Button, Col, Divider, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect, Link } from 'umi';
import MockCustomerLogo from '@/assets/mockCustomerLogo.png';
import EditIcon from '@/assets/projectManagement/edit2.svg';
import CommonModal from '@/components/CommonModal';
import EditProjectModalContent from '@/pages/ProjectManagement/components/EditProjectModalContent';
import EditProjectStatusModalContent from '@/pages/ProjectManagement/components/EditProjectStatusModalContent';
import { getEmployeeUrl } from '@/utils/utils';
import s from '../../index.less';
import CustomTag from '../CustomTag';

const ViewInformation = (props) => {
  const { projectDetail = {}, permissions = {}, dispatch, loadingUpdateProject = false } = props;
  const {
    avatar = '',
    customerName = '',
    projectAlias = '',
    projectId = '',
    projectName = '',
    projectStatus = '',
    engagementType = '',
    division = '',
    accountOwner = {},
    engineeringOwner = {},
    projectManager = {},
    tags = [],
  } = projectDetail;

  const [isEditProjectStatus, setIsEditProjectStatus] = useState(false);
  const [isEditProject, setIsEditProject] = useState(false);

  const { generalInfo: { userId: accountOwnerId = '', legalName: accountOwnerName = '' } = {} } =
    accountOwner || {};
  const {
    generalInfo: { userId: engineeringOwnerId = '', legalName: engineeringOwnerName = '' } = {},
  } = engineeringOwner || {};

  const {
    generalInfo: { userId: projectManagerId = '', legalName: projectManagerName = '' } = {},
  } = projectManager || {};

  // permissions
  const modifyProjectPermission = permissions.modifyProject !== -1;

  const onRefresh = async () => {
    dispatch({
      type: 'projectDetails/fetchProjectByIdEffect',
      payload: {
        projectId,
      },
    });
  };
  useEffect(() => {
    dispatch({
      type: 'projectManagement/fetchProjectStatusListEffect',
    });
  }, []);

  const items = [
    {
      name: 'Customer',
      value: customerName,
    },
    {
      name: 'Project alias',
      value: projectAlias,
    },
    {
      name: 'Project ID',
      value: projectId,
    },
    {
      name: 'Status',
      value: (
        <div className={s.projectStatus}>
          <span>{projectStatus}</span>
          <img src={EditIcon} alt="" onClick={() => setIsEditProjectStatus(true)} />
        </div>
      ),
    },
    {
      name: 'Engagement Type',
      value: engagementType,
    },
    {
      name: 'Division',
      value: division,
    },
    {
      name: 'Account Owner',
      value: (
        <Link target="_blank" rel="noopener noreferrer" to={getEmployeeUrl(accountOwnerId)}>
          {accountOwnerName}
        </Link>
      ),
    },
    {
      name: 'Engineering Owner',
      value: (
        <Link target="_blank" rel="noopener noreferrer" to={getEmployeeUrl(engineeringOwnerId)}>
          {engineeringOwnerName}
        </Link>
      ),
    },
    {
      name: 'Project Manager',
      value: (
        <Link target="_blank" rel="noopener noreferrer" to={getEmployeeUrl(projectManagerId)}>
          {projectManagerName}
        </Link>
      ),
    },
  ];

  const colors = ['#006BEC', '#FF6CA1', '#6236FF', '#FE5D27'];
  const getColor = (index) => {
    return colors[index % colors.length];
  };

  return (
    <div className={s.viewRight__projectInfo} style={{ position: 'relative' }}>
      {modifyProjectPermission && (
        <Button className={s.btnEdit} onClick={() => setIsEditProject(true)}>
          Edit
        </Button>
      )}
      <img src="/assets/images/img-cover.jpg" alt="img-cover" className={s.projectInfo__imgCover} />
      <img src={avatar || MockCustomerLogo} alt="img-avt" className={s.projectInfo__imgAvt} />
      {modifyProjectPermission && (
        <img
          src="/assets/images/iconUploadImage.svg"
          alt="img-upload"
          className={s.projectInfo__imgAvt__upload}
        />
      )}
      <div className={s.projectInfo__textNameAndTitle}>
        <p className={s.projectInfo__textNameAndTitle__name}>{projectName}</p>
      </div>
      <div className={s.projectInfo__viewBottom}>
        <div className={s.projectInfo__viewBottom__row}>
          {items.map((x) => {
            return (
              <Row align="top" className={s.item}>
                <Col span={12}>
                  <p className={s.label}>{x.name}</p>
                </Col>
                <Col span={12}>
                  <p className={s.value}>{x.value}</p>
                </Col>
              </Row>
            );
          })}
        </div>

        <Divider />
        <p className={s.projectInfo__viewBottom__tagLabel}>Tags</p>
        {typeof tags === 'object'
          ? tags.map((t, i) => <CustomTag color={getColor(i)}>{t.tag_name}</CustomTag>)
          : tags.map((t, i) => <CustomTag color={getColor(i)}>{t}</CustomTag>)}
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
            selectedProject={projectDetail}
            onRefresh={onRefresh}
          />
        }
        width={600}
      />
      <CommonModal
        visible={isEditProject}
        onClose={() => setIsEditProject(false)}
        firstText="Edit Project"
        cancelText="Cancel"
        title="Edit Project"
        loading={loadingUpdateProject}
        formName="editProjectForm"
        content={
          <EditProjectModalContent
            visible={isEditProject}
            onClose={() => setIsEditProject(false)}
            selectedProject={projectDetail}
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
    user: { permissions },
    projectDetails: { projectDetail = {}, projectTagList = [] } = {},
    loading,
  }) => ({
    projectDetail,
    projectTagList,
    permissions,
    loadingUpdateProject: loading.effects['projectManagement/updateProjectEffect'],
  }),
)(ViewInformation);
