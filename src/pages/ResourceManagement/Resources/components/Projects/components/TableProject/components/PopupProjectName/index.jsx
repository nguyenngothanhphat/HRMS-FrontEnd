import React from 'react';
import { Avatar, Col, Divider, Row } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import moment from 'moment';
import { history } from 'umi';
import styles from './index.less';

const PopupProjectName = (props) => {
  const {
    dataProjectName: {
      projectName = '',
      status = '',
      division = '',
      projectType = '',
      clientName = '',
      billingStatus = '',
      ultilization = '',
      startDate = '',
      endDate = '',
      projectId = '',
    } = {},
  } = props;

  return (
    <div className={styles.popupContent}>
      <div className={styles.generalInfo}>
        <div className={styles.avatar}>
          <Avatar size={55} icon={<UserOutlined />} />
        </div>
        <div className={styles.employeeInfo}>
          <div className={styles.employeeInfo__name}>{projectName}</div>
          <div className={styles.employeeInfo__department}>
            <span>Status: </span>
            <span>{status}</span>
          </div>
          <div className={styles.employeeInfo__department}>
            <span>Project Type:</span> <span>{projectType}</span>
          </div>
        </div>
      </div>
      <Divider className={styles.divider} />
      <div className={styles.contact}>
        <Row gutter={[20, 20]}>
          <Col span={9}>
            <div className={styles.contact__title}>Client Name: </div>
          </Col>
          <Col span={15}>
            <div className={styles.contact__clientName}>{clientName}</div>
          </Col>
          <Col span={9}>
            <div className={styles.contact__title}>Billing Status: </div>
          </Col>
          <Col span={15}>
            <div className={styles.contact__value}>{billingStatus}</div>
          </Col>
          <Col span={9}>
            <div className={styles.contact__title}>Ultilization: </div>
          </Col>
          <Col span={15}>
            <div
              style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}
              className={styles.contact__value}
            >
              {ultilization}
            </div>
          </Col>
          <Col span={9}>
            <div className={styles.contact__title}>Duration: </div>
          </Col>
          <Col span={15}>
            <div
              style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}
              className={styles.contact__value}
            >
              <span>{moment(startDate).format('MMM DD')}</span>
              <span> - </span>
              <span>{moment(endDate).format('MMM DD YYYY')}</span>
            </div>
          </Col>
          <Col span={9}>
            <div className={styles.contact__title}>Project Status: </div>
          </Col>
          <Col span={15}>
            <div className={styles.contact__value} />
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

export default PopupProjectName;
