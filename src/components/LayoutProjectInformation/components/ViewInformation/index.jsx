import { Button, Col, Divider, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import MockCustomerLogo from '@/assets/mockCustomerLogo.png';
import EditIcon from '@/assets/projectManagement/edit2.svg';
import s from '../../index.less';
import CustomTag from '../CustomTag';
import EditProjectStatusModalContent from '@/pages/ProjectManagement/components/EditProjectStatusModalContent';
import EditProjectModalContent from '@/pages/ProjectManagement/components/EditProjectModalContent';

import CommonModal from '@/components/CommonModal';

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

  const viewProfile = (id) => {
    const url = `/directory/employee-profile/${id}`;
    window.open(url, '_blank');
  };

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
        <span className={s.clickable} onClick={() => viewProfile(accountOwnerId)}>
          {accountOwnerName}
        </span>
      ),
    },
    {
      name: 'Engineering Owner',
      value: (
        <span className={s.clickable} onClick={() => viewProfile(engineeringOwnerId)}>
          {engineeringOwnerName}
        </span>
      ),
    },
    {
      name: 'Project Manager',
      value: (
        <span className={s.clickable} onClick={() => viewProfile(projectManagerId)}>
          {projectManagerName}
        </span>
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
        {tags.map((t, i) => (
          <CustomTag color={getColor(i)}>{t}</CustomTag>
        ))}
      </div>
      <CommonModal
        visible={isEditProjectStatus}
        onClose={() => setIsEditProjectStatus(false)}
        firstText="Save Changes"
        secondText="Cancel"
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
        secondText="Cancel"
        title="Edit Project"
        loading={loadingUpdateProject}
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
