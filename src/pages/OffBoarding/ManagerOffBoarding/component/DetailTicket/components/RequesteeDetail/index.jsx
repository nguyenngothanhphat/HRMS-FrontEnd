import React, { PureComponent } from 'react';
import { Col, Divider, Row, Avatar, Progress } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import styles from './index.less';

class RequesteeDetail extends PureComponent {
  render() {
    const requesteeDetail = {
      employee: {
        _id: 'PSI 1022',
        name: 'Vamsi Venkat Krishna A..',
        jobTitle: 'UX designer',
      },
      project: {
        current: 'Intranet',
        manager: 'Rose Mary',
        projectHealth: 85,
      },
    };
    const { employee, project } = requesteeDetail;
    return (
      <div className={styles.requesteeDetail}>
        <p className={styles.requesteeDetail__title}>Requestee Detail</p>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col span={5}>
            <p className={styles.requesteeDetail__text}>Employee ID</p>
            <span>{employee._id}</span>
          </Col>
          <Col span={7} className={styles.requesteeDetail__center}>
            <div style={{ display: 'flex' }}>
              <div className={styles.requesteeDetail__avatar} />
              <p className={styles.requesteeDetail__text}>Employee Name</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '-8px' }}>
              <Avatar className={styles.requesteeDetail__avatar} icon={<UserOutlined />} />
              <span>
                <u>{employee.name}</u>
              </span>
            </div>
          </Col>
          <Col span={8}>
            <p className={styles.requesteeDetail__text}>Job Title</p>
            <p>{employee.jobTitle}</p>
          </Col>
        </Row>
        <Divider />
        <Row gutter={{ xs: 8, sm: 18, md: 24, lg: 32 }}>
          <Col span={5}>
            <p className={styles.requesteeDetail__text}>Current Project</p>
            <p>
              <u>{project.current}</u>
            </p>
          </Col>
          <Col span={7}>
            <div style={{ display: 'flex' }}>
              <div className={styles.requesteeDetail__avatar} />
              <p className={styles.requesteeDetail__text}>Project Manager</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '-8px' }}>
              <Avatar className={styles.requesteeDetail__avatar} icon={<UserOutlined />} />
              <span>
                <u>{project.manager}</u>
              </span>
            </div>
          </Col>
          <Col span={8}>
            <p className={styles.requesteeDetail__text}>Project Health</p>
            <Progress percent={project.projectHealth} status="active" />
          </Col>
          <Row align="middle">
            <Col>
              <a>
                <u>View report</u>
              </a>
            </Col>
          </Row>
        </Row>
      </div>
    );
  }
}

export default RequesteeDetail;
