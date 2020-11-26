import React, { PureComponent } from 'react';
import { Card, Col, Row, Avatar, Divider } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import moment from 'moment';
import styles from './index.less';

class EmployeeDetail extends PureComponent {
  render() {
    const requesteeDetail = {
      employee: {
        _id: 'PSI 1022',
        name: 'Vamsi Venkat Krishna A',
        jobTitle: 'UX designer',
      },
      project: {
        current: 'Intranet',
        manager: 'Rose Mary',
        projectHealth: 85,
      },
    };
    const { project } = requesteeDetail;
    const { relievingDetails = {} } = this.props;
    const { employee = {} } = relievingDetails;
    const { employeeId = '', generalInfo = {}, title = {} } = employee;

    return (
      <div className={styles.employeeDetail}>
        <Card className={styles.employeeDetail__card} title="Employee Detail">
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col span={6}>
              <p className={styles.employeeDetail__text}>Employee ID</p>
              <span>{employeeId}</span>
            </Col>
            <Col span={11}>
              <div style={{ display: 'flex' }}>
                <div className={styles.employeeDetail__avatar} />
                <p className={styles.employeeDetail__text}>Employee Name</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginTop: '-8px' }}>
                <Avatar className={styles.employeeDetail__avatar} src={generalInfo.avatar} />
                <span className={styles.employeeDetail__name}>
                  <u> {`${generalInfo?.firstName} ${generalInfo?.lastName}`}</u>
                </span>
              </div>
            </Col>
            <Col span={7}>
              <p className={styles.employeeDetail__text}>Joined Date</p>
              <p>{moment(employee.joinDate).locale('en').format('DD-MM-YYYY')}</p>
            </Col>
          </Row>
          <Divider />
          <Row gutter={{ xs: 8, sm: 18, md: 24, lg: 32 }}>
            <Col span={6}>
              <p className={styles.employeeDetail__text}>Job Title</p>
              <span>{title.name}</span>
            </Col>
            <Col span={11}>
              <div style={{ display: 'flex' }}>
                <div className={styles.employeeDetail__avatar} />
                <p className={styles.employeeDetail__text}>Reporting Manager</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginTop: '-8px' }}>
                <Avatar className={styles.employeeDetail__avatar} icon={<UserOutlined />} />
                <span>
                  <u>{project.manager}</u>
                </span>
              </div>
            </Col>
            <Col span={7}>
              <p className={styles.employeeDetail__text}>Department</p>
              <p>{employee?.department?.name}</p>
            </Col>
          </Row>
        </Card>
      </div>
    );
  }
}

export default EmployeeDetail;
