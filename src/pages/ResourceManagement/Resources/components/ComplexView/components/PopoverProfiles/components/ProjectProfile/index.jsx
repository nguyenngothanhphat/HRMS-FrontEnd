import { Col, Popover, Row, Progress } from 'antd';
import React, { useState } from 'react';
import { connect, history } from 'umi';
import CloseX from '@/assets/dashboard/closeX.svg';

import styles from './index.less';
import CapitalNameIcon from '../../../CapitalNameIcon';

const ProjectProfile = (props) => {
  const { children, placement = 'top', project = {} } = props;
  const [showPopover, setShowPopover] = useState(false);

  const {
    project: { projectId = '', projectName = '-', division = '-', customerName = '' } = {},
    accountOwner: { generalInfo: { legalName: accountOwner = '-' } = {} } = {},
    engineeringOwner: { generalInfo: { legalName: engineeringOwner = '-' } = {} } = {},
    utilization = 0,
  } = project;

  const handleViewProject = () => {
    history.push(`/project-management/list/${projectId}/summary`);
  };

  const renderHeader = () => {
    return (
      <div className={styles.header}>
        <CapitalNameIcon text={projectName} />
        <div className={styles.information}>
          <span className={styles.name}>{projectName}</span>
          <span className={styles.position}>{division}</span>
        </div>
      </div>
    );
  };

  const projectInfo = () => {
    const items = [
      {
        label: 'Customer',
        value: customerName,
      },
      {
        label: 'Account Owner',
        value: <span className={styles.managerName}>{accountOwner}</span>,
        link: '#',
      },
      {
        label: 'Engineering Owner',
        value: <span className={styles.managerName}>{engineeringOwner}</span>,
        link: '#',
      },
      {
        label: 'Project ID',
        value: projectId,
      },
      {
        label: 'Status',
        value: (
          <div>
            <Progress percent={utilization || 0} showInfo={false} />
            <div className={styles.rightPosition}>
              <span>{utilization || 0}%</span>
            </div>
          </div>
        ),
      },
    ];

    return (
      <div className={styles.userInfo}>
        {items.map((i) => (
          <Row className={styles.eachRow} key={i.label}>
            <Col className={styles.eachRow__label} span={8}>
              {i.label}:
            </Col>
            <Col className={styles.eachRow__value} span={16}>
              {i.value}
            </Col>
          </Row>
        ))}
      </div>
    );
  };

  const renderPopup = () => {
    return (
      <div className={styles.popupContainer}>
        <img
          className={styles.closeButton}
          src={CloseX}
          alt=""
          onClick={() => setShowPopover(!showPopover)}
        />
        {renderHeader()}
        <div className={styles.divider} />
        {projectInfo()}
        <div className={styles.divider} />
        <div onClick={handleViewProject} className={styles.viewFullProfile}>
          View more details
        </div>
      </div>
    );
  };

  return (
    <>
      <Popover
        placement={placement}
        content={() => renderPopup()}
        title={null}
        trigger="click"
        visible={showPopover}
        overlayClassName={styles.ProjectProfile}
        onVisibleChange={() => {
          setShowPopover(!showPopover);
        }}
      >
        {children}
      </Popover>
    </>
  );
};

export default connect(({ resourceManagement: { projectList = [] } }) => ({ projectList }))(
  ProjectProfile,
);
