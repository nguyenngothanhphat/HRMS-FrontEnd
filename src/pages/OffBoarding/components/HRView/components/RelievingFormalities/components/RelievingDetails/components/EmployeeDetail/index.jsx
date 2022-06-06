import React, { PureComponent } from 'react';
import { Card, Col, Row } from 'antd';
import moment from 'moment';

import { formatMessage } from 'umi';

import styles from './index.less';

class EmployeeDetail extends PureComponent {
  render() {
    const { relievingDetails = {} } = this.props;
    const { employee = {}, manager = {} } = relievingDetails;
    const {
      employeeId = '',
      generalInfo: { firstName: nameEmployee = '' } = {},
      title: { name: titleName = '' } = {},
      department: { name: departmentName = '' } = {},
      joinDate = '',
    } = employee;
    const { generalInfo: { firstName: nameManager = '' } = {} } = manager;
    const DOJ = moment(joinDate).format('MM.DD.YY');
    return (
      <div className={styles.employeeDetail}>
        <Card
          className={styles.employeeDetail__card}
          title={formatMessage({ id: 'pages.relieving.employeeDetail' })}
        >
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col span={8}>
              <Col span={24}>
                <div className={styles.title}>Employee ID</div>
              </Col>
              <Col span={24}>
                <div className={styles.title}>Employee Name</div>
              </Col>
              <Col span={24}>
                <div className={styles.title}>Position</div>
              </Col>
              <Col span={24}>
                <div className={styles.title}>Department</div>
              </Col>
              <Col span={24}>
                <div className={styles.title}>Terralogic DOJ</div>
              </Col>
              <Col span={24}>
                <div className={styles.title}>Project Manager</div>
              </Col>
            </Col>
            <Col span={16}>
              <Col span={24}>
                <div className={styles.value}>{employeeId}</div>
              </Col>
              <Col span={24}>
                <div className={`${styles.value} ${styles.valueName}`}>{nameEmployee}</div>
              </Col>
              <Col span={24}>
                <div className={styles.value}>{titleName}</div>
              </Col>
              <Col span={24}>
                <div className={styles.value}>{departmentName}</div>
              </Col>
              <Col span={24}>
                <div className={styles.value}>{DOJ}</div>
              </Col>
              <Col span={24}>
                <div className={`${styles.value} ${styles.valueName}`}>{nameManager}</div>
              </Col>
            </Col>
          </Row>
        </Card>
      </div>
    );
  }
}

export default EmployeeDetail;
