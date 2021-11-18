import { Col, Popover, Row, Progress } from 'antd';
import React, { useState } from 'react';
import { connect } from 'umi';
import CloseX from '@/assets/dashboard/closeX.svg';

import styles from './index.less';
import CapitalNameIcon from '../../../CapitalNameIcon';

const ProjectProfile = (props) => {
  const { children, placement = 'top', projectId } = props;
  const [showPopover, setShowPopover] = useState(false);

  const renderHeader = () => {
    const {projectList} = props;
    const project = projectList.find(x => x.projectId === projectId)
    const {division = {}} = project || {}
    const projectName = project ? project.projectName : '-'
    return (
      <div className={styles.header}>
        <CapitalNameIcon text={projectName} />
        <div className={styles.information}>
          <span className={styles.name}>{projectName}</span>
          <span className={styles.position}>{division ? division.name : '-'}</span>
          {/* <span className={styles.department}>Engineering Dept</span> */}
        </div>
      </div>
    );
  };
  const projectInfo = () => {
    const {projectList} = props;
    const project = projectList.find(x => x.projectId === projectId) || {name: 'Project ABCDEF', statusProgress: 40}
    const items = [
      {
        label: 'Customer',
        value: `${project ? project.customerName : '-' }`,
        // link: '#',
      },
      {
        label: 'Account Owner',
        value: <span className={styles.managerName}>{project && project.accountOwner ? project.accountOwner.generaInfo.name : '-'}</span>,
        link: '#',
      },
      {
        label: 'Engineering Owner',
        value: <span className={styles.managerName}>{project && project.engineeringOwner ? project.engineeringOwner.generaInfo.name : '-'}</span>,
        link: '#',
      },
      {
        label: 'Project ID',
        value: `${project ? project.projectId : '-'}`,
      },
      {
        label: 'Status',
        value: <div><Progress percent={project.statusProgress} showInfo={false} /><div className={styles.rightPosition}><span>{project.statusProgress}%</span></div></div>,
      },
    ];

    return (
      <div className={styles.userInfo}>
        {items.map((i) => (
          <Row className={styles.eachRow}>
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
        {projectInfo(projectId)}
        <div className={styles.divider} />
        <div className={styles.viewFullProfile}>View more details</div>
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

export default connect(({resourceManagement: { projectList=[]}}) => ({projectList}))(
  ProjectProfile,
);
