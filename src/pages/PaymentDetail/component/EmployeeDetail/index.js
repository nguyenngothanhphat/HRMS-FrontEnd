import React, { PureComponent } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { Row, Col } from 'antd';
import styles from './index.less';

class EmployeeInfo extends PureComponent {
  render() {
    const { employee = {} } = this.props;

    return (
      <div style={{ paddingBottom: '10px' }} className={styles.payment_detail_employee_info}>
        <div className={styles.title}>{formatMessage({ id: 'report.employee.info' })}</div>
        <Row gutter={48} className={styles.payment_detail_employee_info_component}>
          <Col md={12} sm={24}>
            <Row>
              <Col className={styles.employeeTitle} span={10}>
                <p>{formatMessage({ id: 'report.employee.fullname' })}</p>
                <p>{formatMessage({ id: 'report.employee.id' })}</p>
                <p>{formatMessage({ id: 'report.employee.company' })}</p>
                <p>{formatMessage({ id: 'report.employee.location' })}</p>
                <p>{formatMessage({ id: 'report.employee.department' })}</p>
              </Col>
              <Col className={styles.employeeValue} span={14}>
                <p>{employee.name}</p>
                <p>{employee.id}</p>
                <p>{employee.company}</p>
                <p>{employee.location}</p>
                <p>{employee.department}</p>
              </Col>
            </Row>
          </Col>
          <Col md={12} sm={24}>
            <Row>
              <Col className={styles.employeeTitle} span={8}>
                <p>{formatMessage({ id: 'report.employee.email' })}</p>
                <p>{formatMessage({ id: 'report.employee.phone' })}</p>
                <p>{formatMessage({ id: 'report.employee.manager' })}</p>
              </Col>
              <Col className={styles.employeeValue} span={16}>
                <p>{employee.email}</p>
                <p>{employee.phone}</p>
                <p>{employee.manager}</p>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}

export default EmployeeInfo;
