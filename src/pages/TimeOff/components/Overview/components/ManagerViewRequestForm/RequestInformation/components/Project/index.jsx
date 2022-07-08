import React, { Component } from 'react';
import { Row, Col } from 'antd';
import { history, Link } from 'umi';
import moment from 'moment';
import styles from './index.less';
import { TIMEOFF_DATE_FORMAT } from '@/utils/timeOff';
import UserProfilePopover from '@/components/UserProfilePopover';
import ProjectDetailPopover from '@/components/ProjectDetailPopover';

class Project extends Component {
  onViewProfileClick = (userId) => {
    if (userId) {
      history.push(`/directory/employee-profile/${userId}/general-info`);
    }
  };

  dataHover = (data) => {
    const {
      generalInfo: {
        legalName = '',
        avatar: avatar1 = '',
        userId = '',
        workEmail = '',
        workNumber = '',
        skills = [],
      } = {},
      generalInfo = {},
      department = {},
      location: locationInfo = {},
      manager: managerInfo = {},
      title = {},
    } = data;
    return {
      legalName,
      userId,
      department,
      workEmail,
      workNumber,
      locationInfo,
      generalInfo,
      managerInfo,
      title,
      avatar1,
      skills,
    };
  };

  viewProject = (projectId) => {
    return `/project-management/list/${projectId}/summary`;
  };

  render() {
    const {
      project: { projectName, id: projectId = '' } = {},
      projectManager: { generalInfo: { legalName: managerName = '', userId = '' } = {} } = {},
      projectManager = {},
      infomationProject = {},
      startDate = '',
      endDate = '',
    } = this.props;
    return (
      <div className={styles.Project}>
        <Row>
          <Col span={5} className={styles.detailColumn}>
            <ProjectDetailPopover
              data={{ ...infomationProject }}
              trigger="hover"
              placement="topRight"
            >
              <Link className={styles.projectName} to={this.viewProject(projectId)}>
                {projectName || '-'}
              </Link>
            </ProjectDetailPopover>
          </Col>
          <Col span={5} className={styles.detailColumn}>
            <UserProfilePopover data={this.dataHover(projectManager)}>
              <span className={styles.managerName} onClick={() => this.onViewProfileClick(userId)}>
                {managerName}
              </span>
            </UserProfilePopover>
          </Col>
          <Col span={5} className={styles.detailColumn}>
            <span>{startDate ? moment(startDate).format(TIMEOFF_DATE_FORMAT) : '-'}</span>
          </Col>
          <Col span={5} className={styles.detailColumn}>
            <span>{endDate ? moment(endDate).format(TIMEOFF_DATE_FORMAT) : '-'}</span>
          </Col>
          <Col span={4} className={styles.detailColumn}>
            <div className={styles.projectHealth}>
              {/* <span className={styles.bar}>
                <Progress strokeLinecap="square" strokeColor="#00C598" percent={projectHealth} />
              </span>
              <span className={styles.viewReport} onClick={this.onViewReport}>
                View Report
              </span> */}
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
export default Project;
