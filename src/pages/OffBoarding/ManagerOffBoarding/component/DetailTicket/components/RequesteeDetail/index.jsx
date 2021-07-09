import { Col, Row } from 'antd';
import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import Project from './Project';
import styles from './index.less';

@connect()
class RequesteeDetail extends PureComponent {
  onViewEmployeeProfile = async (id) => {
    const {
      employeeInfo: { location: locationName = {}, company = {} } = {},
      tenant = '',
      dispatch,
    } = this.props;

    // await dispatch({
    //   type: 'employeeProfile/save',
    //   payload: {
    //     tenantCurrentEmployee: tenant,
    //     companyCurrentEmployee: company?._id,
    //   },
    // });

    // localStorage.setItem('tenantCurrentEmployee', tenant);
    // localStorage.setItem('companyCurrentEmployee', company?._id);
    // localStorage.setItem('idCurrentEmployee', id);

    // setTimeout(() => {
    //   history.push({
    //     pathname: `/directory/employee-profile/${id}`,
    //     state: { location: locationName },
    //   });
    // }, 200);
  };

  render() {
    const {
      employeeInfo: { nameEmployee, employeeId, title, ownerRequest: idEmployee = '' } = {},
      projectsList = [],
    } = this.props;
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
                onClick={() => this.onViewEmployeeProfile(idEmployee)}
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
                      // _id: pjManagerId = '',
                      generalInfo: { firstName: fn = '', lastName: ln = '', userId = '' } = {},
                    } = {},
                    projectHealth = 0,
                  } = project;
                  return (
                    <>
                      <Project
                        name={prName}
                        projectManager={`${fn} ${ln}`}
                        projectHealth={projectHealth}
                        employeeId={userId}
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
