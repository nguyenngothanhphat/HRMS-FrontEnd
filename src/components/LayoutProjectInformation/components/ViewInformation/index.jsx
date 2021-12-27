import { Button, Col, Divider, Row } from 'antd';
import React from 'react';
import { connect } from 'umi';
import MockCustomerLogo from '@/assets/mockCustomerLogo.png';
import s from '../../index.less';
import CustomTag from '../CustomTag';

const ViewInformation = (props) => {
  const { projectDetail, permissions = {} } = props;
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
    tags = [],
  } = projectDetail;

  const { generalInfo: { userId: accountOwnerId = '', legalName: accountOwnerName = '' } = {} } =
    accountOwner || {};
  const {
    generalInfo: { userId: engineeringOwnerId = '', legalName: engineeringOwnerName = '' } = {},
  } = engineeringOwner || {};
  // permissions
  const modifyProjectPermission = permissions.modifyProject !== -1;

  const viewProfile = (id) => {
    const url = `/directory/employee-profile/${id}`;
    window.open(url, '_blank');
  };

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
      value: projectStatus,
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
  ];

  const colors = ['#006BEC', '#FF6CA1', '#6236FF', '#FE5D27'];
  const getColor = (index) => {
    return colors[index % colors.length];
  };

  return (
    <div className={s.viewRight__projectInfo} style={{ position: 'relative' }}>
      {modifyProjectPermission && <Button className={s.btnEdit}>Edit</Button>}
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
              <Row>
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
    </div>
  );
};

export default connect(
  ({
    user: { permissions },
    projectDetails: { projectDetail = {}, projectTagList = [] } = {},
  }) => ({
    projectDetail,
    projectTagList,
    permissions,
  }),
)(ViewInformation);
