import React, { PureComponent } from 'react';
import { Card, Col, Row, Avatar, Divider } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { formatMessage } from 'umi';
import moment from 'moment';
import styles from './index.less';

class EmployeeDetail extends PureComponent {
  render() {
    const { relievingDetails = {} } = this.props;
    const { employee = {}, manager = {} } = relievingDetails;
    const { employeeId = '', generalInfo = {}, title = {} } = employee;

    return (
      <div className={styles.employeeDetail}>
        <Card
          className={styles.employeeDetail__card}
          title={formatMessage({ id: 'pages.relieving.employeeDetail' })}
        >
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col span={6}>
              <p className={styles.employeeDetail__text}>
                {formatMessage({ id: 'pages.relieving.employeeID' })}
              </p>
              <span>{employeeId}</span>
            </Col>
            <Col span={11}>
              <div style={{ display: 'flex' }}>
                <div className={styles.employeeDetail__avatar} />
                <p className={styles.employeeDetail__text}>
                  {' '}
                  {formatMessage({ id: 'pages.relieving.employeeName' })}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginTop: '-8px' }}>
                {generalInfo?.avatar ? (
                  <Avatar className={styles.employeeDetail__avatar} src={generalInfo.avatar} />
                ) : (
                  <Avatar className={styles.employeeDetail__avatar} icon={<UserOutlined />} />
                )}
                <span className={styles.employeeDetail__name}>
                  <u> {`${generalInfo?.firstName} ${generalInfo?.lastName}`}</u>
                </span>
              </div>
            </Col>
            <Col span={7}>
              <p className={styles.employeeDetail__text}>
                {formatMessage({ id: 'pages.relieving.employee.joinedDate' })}
              </p>
              <p>{moment(employee.joinDate).locale('en').format('DD-MM-YYYY')}</p>
            </Col>
          </Row>
          <Divider />
          <Row gutter={{ xs: 8, sm: 18, md: 24, lg: 32 }}>
            <Col span={6}>
              <p className={styles.employeeDetail__text}>
                {formatMessage({ id: 'pages.relieving.employee.jobTitle' })}
              </p>
              <span>{title.name}</span>
            </Col>
            <Col span={11}>
              <div style={{ display: 'flex' }}>
                <div className={styles.employeeDetail__avatar} />
                <p className={styles.employeeDetail__text}>
                  {formatMessage({ id: 'pages.relieving.employee.reporting' })}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginTop: '-8px' }}>
                {manager?.generalInfo?.avatar ? (
                  <Avatar
                    className={styles.employeeDetail__avatar}
                    src={manager?.generalInfo?.avatar}
                  />
                ) : (
                  <Avatar className={styles.employeeDetail__avatar} icon={<UserOutlined />} />
                )}

                <span>
                  <u>{`${manager?.generalInfo?.firstName} ${manager?.generalInfo?.lastName}`}</u>
                </span>
              </div>
            </Col>
            <Col span={7}>
              <p className={styles.employeeDetail__text}>
                {formatMessage({ id: 'pages.relieving.employee.department' })}
              </p>
              <p>{employee?.department?.name}</p>
            </Col>
          </Row>
        </Card>
      </div>
    );
  }
}

export default EmployeeDetail;
