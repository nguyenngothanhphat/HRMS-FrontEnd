import { Col, Row } from 'antd';
import React, { PureComponent } from 'react';
import Project from './Project';
import styles from './index.less';

class RequesteeDetail extends PureComponent {
  render() {
    const { employeeInfo: { nameEmployee, employeeId, title } = {}, projectsList = [] } =
      this.props;
    return (
      <div className={styles.requesteeDetail}>
        <div className={styles.formTitle}>
          <span className={styles.title}>Requestee details</span>
        </div>
        <div className={styles.formContent}>
          <Row>
            <Col span={6}>Employee ID</Col>
            <Col span={18} className={styles.detailColumn}>
              <span className={styles.fieldValue}>{employeeId}</span>
            </Col>
          </Row>
          <Row>
            <Col span={6}>Employee Name</Col>
            <Col span={18} className={styles.detailColumn}>
              <span
                onClick={() => this.onViewEmployeeProfile(employeeId)}
                className={styles.employeeLink}
              >
                {nameEmployee}
              </span>
            </Col>
          </Row>
          <Row>
            <Col span={6}>Position</Col>
            <Col span={18} className={styles.detailColumn}>
              <span>{title}</span>
            </Col>
          </Row>
          <div className={styles.projectList}>
            {/* <span className={styles.title}>Projects</span> */}
            <Row>
              <Col span={6}>Current Project</Col>
              <Col span={6}>Project Manager</Col>
              <Col span={12}>Project Health</Col>
            </Row>

            {projectsList.length === 0 ? (
              <>
                <Row>
                  <Col span={6} className={styles.detailColumn}>
                    <span>No project</span>
                  </Col>
                </Row>
              </>
            ) : (
              <>
                {projectsList.map((project) => {
                  const {
                    name: prName = '',
                    manager: {
                      _id: pjManagerId = '',
                      generalInfo: { firstName: fn = '', lastName: ln = '' } = {},
                    } = {},
                    projectHealth = 0,
                  } = project;
                  return (
                    <>
                      <Project
                        name={prName}
                        projectManager={`${fn} ${ln}`}
                        projectHealth={projectHealth}
                        employeeId={pjManagerId}
                      />
                      {/* {index + 1 < projects.length && <div className={styles.divider} />} */}
                    </>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default RequesteeDetail;
