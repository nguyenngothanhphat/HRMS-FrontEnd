import { Row } from 'antd';
import React from 'react';
import { connect } from 'umi';
import Empty from '@/components/Empty';
import Icon from '@/assets/dashboard/emptyIcon.svg';
import ProjectTag from '../ProjectTag';
import styles from './index.less';

const MyProjects = (props) => {
  const { isInModal = false, projectList = [], resoucreList = [], myId = '' } = props;
  const result = projectList.filter((val) => val.projectManager !== null);
  const newProjectList = result.filter((val) => val.projectManager.generalInfo._id === myId);

  if (newProjectList.length === 0) return <Empty image={Icon} />;
  return (
    <div className={styles.MyProjects} style={isInModal ? { maxHeight: '600px' } : {}}>
      <Row gutter={[16, 16]}>
        {newProjectList.map((project) => {
          return <ProjectTag project={project} resourceProject={resoucreList} />;
        })}
      </Row>
    </div>
  );
};

export default connect(
  ({
    dashboard: { projectList = [], resoucreList = [] } = {},
    user: { currentUser: { employee: { generalInfo: { _id: myId = '' } = {} } = {} } = {} } = {},
  }) => ({ projectList, resoucreList, myId }),
)(MyProjects);
