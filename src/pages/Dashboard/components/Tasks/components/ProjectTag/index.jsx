import { Avatar, Col, Progress, Row } from 'antd';
import React from 'react';
import { connect } from 'umi';
import MockAvatar from '@/assets/dashboard/mockAvatar.jpg';
import styles from './index.less';

const ProjectTag = (props) => {
  const { project: projectProp, resourceProject } = props;
  // FUNCTIONS
  const getProgressBarColor = (percent) => {
    if (percent < 30) return '#FD4546';
    if (percent < 70) return '#FFA100';
    return '#25BA70';
  };

  // RENDER UI
  const renderProjectMember = (members) => {
    if (members.length === 0) return '';
    return (
      <div className={styles.projectMembers}>
        <Avatar.Group
          maxCount={3}
          maxStyle={{
            color: '#FFA100',
            backgroundColor: '#EAF0FF',
          }}
        >
          {members.map(() => {
            return <Avatar size="small" style={{ backgroundColor: '#EAF0FF' }} src={MockAvatar} />;
          })}
        </Avatar.Group>
        {members.length > 1 ? (
          <span className={styles.moreMember}>
            {members[0].generalInfo.legalName} + {members.length - 1} more
          </span>
        ) : (
          <span className={styles.moreMember}>{members[0].generalInfo.legalName}</span>
        )}
      </div>
    );
  };

  const renderTag = (project) => {
    return (
      <Col span={24}>
        <div className={styles.ProjectTag}>
          <Row justify="space-between" align="top">
            <Col span={16} className={styles.leftPart}>
              <span className={styles.projectName}>{project.projectName}</span>
              {renderProjectMember(resourceProject)}
            </Col>
            <Col span={8} className={styles.rightPart}>
              <div className={`${styles.progressTag}`}>
                <div className={styles.statusLabel}>
                  Status: <span>{project.projectStatus}%</span>
                </div>
                <Progress
                  strokeLinecap="round"
                  strokeColor={getProgressBarColor(project.projectStatus)}
                  percent={project.projectStatus}
                  size="small"
                  type="line"
                  showInfo={false}
                />
              </div>
            </Col>
          </Row>
        </div>
      </Col>
    );
  };

  return renderTag(projectProp);
};

export default connect(() => ({}))(ProjectTag);
