import React, { PureComponent } from 'react';
import { Col, Divider, Row, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { formatMessage } from 'umi';
import styles from './index.less';

class RequesteeDetail extends PureComponent {
  render() {
    const { id, avatar, name, jobTitle } = this.props;
    return (
      <div className={styles.requesteeDetail}>
        <p className={styles.requesteeDetail__title}>
          {formatMessage({ id: 'pages.offBoarding.requesteeTitle' })}
        </p>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col span={5}>
            <p className={styles.requesteeDetail__text}>
              {formatMessage({ id: 'pages.offBoarding.requestee.employeeID' })}
            </p>
            <span>{id}</span>
          </Col>
          <Col span={7} className={styles.requesteeDetail__center}>
            <div style={{ display: 'flex' }}>
              <div className={styles.requesteeDetail__avatar} />
              <p className={styles.requesteeDetail__text}>
                {formatMessage({ id: 'pages.offBoarding.requestee.employeeName' })}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '-8px' }}>
              <img
                alt=""
                src={avatar || <UserOutlined />}
                className={styles.requesteeDetail__avatar}
              />
              <span>
                <u>{name} </u>
              </span>
            </div>
          </Col>
          <Col span={8}>
            <p className={styles.requesteeDetail__text}>
              {formatMessage({ id: 'pages.offBoarding.requestee.jobTitle' })}
            </p>
            <p>{jobTitle}</p>
          </Col>
        </Row>
        <Divider />
        <Row gutter={{ xs: 8, sm: 18, md: 24, lg: 32 }}>
          <Col span={5}>
            <p className={styles.requesteeDetail__text}>
              {formatMessage({ id: 'pages.offBoarding.requestee.currentProject' })}
            </p>
            <p>
              <u />
            </p>
          </Col>
          <Col span={7}>
            <div style={{ display: 'flex' }}>
              <div className={styles.requesteeDetail__avatar} />
              <p className={styles.requesteeDetail__text}>
                {formatMessage({ id: 'pages.offBoarding.requestee.projectManager' })}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '-8px' }}>
              <Avatar className={styles.requesteeDetail__avatar} icon={<UserOutlined />} />
              <span>
                <u />
              </span>
            </div>
          </Col>
          <Col span={8}>
            <p className={styles.requesteeDetail__text}>
              {formatMessage({ id: 'pages.offBoarding.requestee.projectHealth' })}
            </p>
            {/* <Progress percent={project.projectHealth} status="active" /> */}
          </Col>
          <Row align="middle">
            <Col>
              <a>
                <u>{formatMessage({ id: 'pages.offBoarding.requestee.viewReport' })}</u>
              </a>
            </Col>
          </Row>
        </Row>
      </div>
    );
  }
}

export default RequesteeDetail;
