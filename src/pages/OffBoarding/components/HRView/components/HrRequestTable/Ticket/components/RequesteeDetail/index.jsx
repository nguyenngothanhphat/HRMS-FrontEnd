import React, { PureComponent, Fragment } from 'react';
import { Col, Divider, Row, Avatar, Progress } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { formatMessage } from 'umi';
import moment from 'moment';
import styles from './index.less';

class RequesteeDetail extends PureComponent {
  render() {
    const {
      id,
      name,
      jobTitle,
      joinDate,
      department,
      nameOfManager,
      listProject = [],
    } = this.props;
    return (
      <div className={styles.requesteeDetail}>
        <div className={styles.requesteeDetail__title}>
          {formatMessage({ id: 'pages.offBoarding.requesteeTitle' })}
        </div>
        <div>
          <div className={styles.requesteeDetail__item}>
            <div> {formatMessage({ id: 'pages.offBoarding.requestee.employeeID' })}</div>
            <div>{id}</div>
          </div>
          <div className={styles.requesteeDetail__item}>
            <div> {formatMessage({ id: 'pages.offBoarding.requestee.employeeName' })}</div>
            <div style={{ color: '#2C6DF9' }}>{name}</div>
          </div>
          <div className={styles.requesteeDetail__item}>
            <div> {formatMessage({ id: 'pages.offBoarding.requestee.position' })}</div>
            <div>{jobTitle}</div>
          </div>
          <div className={styles.requesteeDetail__item}>
            <div> {formatMessage({ id: 'pages.offBoarding.requestee.department' })}</div>
            <div>{department}</div>
          </div>
          <div className={styles.requesteeDetail__item}>
            <div> {formatMessage({ id: 'pages.offBoarding.requestee.joinDate' })}</div>
            <div>{moment(joinDate).format('MM.DD.YY')}</div>
          </div>
          <div className={styles.requesteeDetail__item}>
            <div> {formatMessage({ id: 'pages.offBoarding.requestee.projectManager' })}</div>
            <div style={{ color: '#2C6DF9' }}>{nameOfManager}</div>
          </div>
        </div>
        {/* {listProject.length === 0 ? (
          <>
            <Divider />
            <div className={styles.textNoProject}>No Project</div>
          </>
        ) : (
          listProject.map((item) => {
            const {
              name: nameProject,
              projectHealth,
              manager: { generalInfo: { firstName: nameManager, avatar: avatarManager = '' } = {} },
            } = item;
            return (
              <Fragment key={item}>
                <Divider />
                <Row gutter={{ xs: 8, sm: 18, md: 24, lg: 32 }}>
                  <Col span={5}>
                    <p className={styles.requesteeDetail__text}>
                      {formatMessage({ id: 'pages.offBoarding.requestee.currentProject' })}
                    </p>
                    <p>
                      <u>{nameProject}</u>
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
                      <Avatar
                        className={styles.requesteeDetail__avatar}
                        icon={<UserOutlined />}
                        src={avatarManager}
                      />
                      <span>
                        <u>{nameManager}</u>
                      </span>
                    </div>
                  </Col>
                  <Col span={8}>
                    <p className={styles.requesteeDetail__text}>
                      {formatMessage({ id: 'pages.offBoarding.requestee.projectHealth' })}
                    </p>
                    <Progress percent={projectHealth} status="active" />
                  </Col>
                  <Row align="middle">
                    <Col>
                      <a>
                        <u>{formatMessage({ id: 'pages.offBoarding.requestee.viewReport' })}</u>
                      </a>
                    </Col>
                  </Row>
                </Row>
              </Fragment>
            );
          })
        )} */}
      </div>
    );
  }
}

export default RequesteeDetail;
