import React, { Component } from 'react';
import { Row, Col, Progress } from 'antd';
import { history } from 'umi';
import styles from './index.less';

class Project extends Component {
  // ON VIEW EMPLOYEE PROFILE
  onViewEmployeeProfile = (_id) => {
    history.push({
      pathname: `/directory/employee-profile/${_id}`,
    });
  };

  render() {
    const { name = '', projectManager = '', projectHealth = 0, employeeId = '' } = this.props;
    return (
      <div className={styles.Project}>
        <Row>
          <Col span={6} className={styles.detailColumn}>
            <span>{name}</span>
          </Col>
          <Col span={6} className={styles.detailColumn}>
            <span
              onClick={() => this.onViewEmployeeProfile(employeeId)}
              className={styles.employeeLink}
            >
              {projectManager}
            </span>
          </Col>
          <Col span={12} className={styles.detailColumn}>
            <div className={styles.projectHealth}>
              <span className={styles.bar}>
                <Progress strokeLinecap="square" strokeColor="#00C598" percent={projectHealth} />
              </span>
              <span className={styles.viewReport} onClick={this.onViewReport}>
                View Report
              </span>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
export default Project;
