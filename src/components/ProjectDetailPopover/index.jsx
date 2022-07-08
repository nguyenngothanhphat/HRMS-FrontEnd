import React, { useState } from 'react';
import { Avatar, Col, Divider, Row, Progress, Popover } from 'antd';
import moment from 'moment';
import { history } from 'umi';
import styles from './index.less';

const ProjectDetailPopover = (props) => {
  const { children, placement = 'top', data = {} } = props;
  const {
    project: {
      projectName = '',
      projectId = '',
      projectAlias = '',
      engagementType: projectType = '',
    } = {},
    status = '',
    accountOwner: { generalInfo: { legalName: nameAccountOwner = '' } = {} } = {},
    engineeringOwner: { generalInfo: { legalName: nameEngineeringOwner = '' } = {} } = {},
    startDate = '',
    endDate = '',
    percentComplete = '',
  } = data;
  const [showPopover, setShowPopover] = useState(false);

  const getProgressBarColor = (percent) => {
    if (percent < 30) return '#FD4546';
    if (percent < 70) return '#FFA100';
    return '#25BA70';
  };

  const contentPopover = () => {
    return (
      <div className={styles.ProjectDetailPopover}>
        <div className={styles.generalInfo}>
          <div className={styles.avatar}>
            <Avatar style={{ backgroundColor: '#1956DA', fontSize: '32px' }} size={55}>
              {projectName.slice(0, 1).toUpperCase()}
            </Avatar>
          </div>
          <div className={styles.employeeInfo}>
            <div className={styles.employeeInfo__name}>{projectName}</div>
            <div className={styles.employeeInfo__department}>
              <span>Status</span>
              <span>
                {': '}
                {status || '_'}
              </span>
            </div>
            <div className={styles.employeeInfo__department}>
              <span>Project Type</span>
              <span>
                {': '}
                {projectType}
              </span>
            </div>
          </div>
        </div>
        <Divider className={styles.divider} />
        <div className={styles.contact}>
          <Row gutter={[12, 12]}>
            <Col span={9}>
              <div className={styles.contact__title}> Account Owner: </div>
            </Col>
            <Col span={15}>
              <div className={styles.contact__clientName}>{nameAccountOwner || '-'}</div>
            </Col>
            <Col span={9}>
              <div className={styles.contact__title}>Project ID: </div>
            </Col>
            <Col span={15}>
              <div className={styles.contact__value}>{projectId || '-'}</div>
            </Col>
            <Col span={9}>
              <div className={styles.contact__title}>Project Alias: </div>
            </Col>
            <Col span={15}>
              <div
                style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}
                className={styles.contact__value}
              >
                {projectAlias || '-'}
              </div>
            </Col>
            <Col span={9}>
              <div className={styles.contact__title}>Engineering Owner: </div>
            </Col>
            <Col span={15}>
              <div className={styles.contact__value}>{nameEngineeringOwner || '-'}</div>
            </Col>
            <Col span={9}>
              <div className={styles.contact__title}>Duration: </div>
            </Col>
            <Col span={15}>
              <div
                style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}
                className={styles.duration}
              >
                <span>{moment(startDate).locale('en').format('MMM DD')}</span>
                <span> - </span>
                <span>{moment(endDate).locale('en').format('MMM DD YYYY')}</span>
              </div>
            </Col>
            <Col span={9}>
              <div className={styles.contact__title}>Project Status: </div>
            </Col>
            <Col span={15}>
              <Progress
                strokeLinecap="round"
                strokeColor={getProgressBarColor(percentComplete)}
                percent={percentComplete}
                size="small"
                type="line"
                showInfo={false}
              />
            </Col>
          </Row>
        </div>
        <Divider className={styles.divider} />
        <div className={styles.popupActions}>
          <div
            className={styles.popupActions__link}
            onClick={() => history.push(`/project-management/list/${projectId}/summary`)}
          >
            View project details
          </div>
        </div>
      </div>
    );
  };
  return (
    <>
      <Popover
        placement={placement}
        content={showPopover ? contentPopover() : null}
        title={null}
        trigger="hover"
        visible={showPopover}
        overlayClassName={styles.ProjectDetailPopover}
        onVisibleChange={() => {
          setShowPopover(!showPopover);
        }}
      >
        {children}
      </Popover>
    </>
  );
};

export default ProjectDetailPopover;
