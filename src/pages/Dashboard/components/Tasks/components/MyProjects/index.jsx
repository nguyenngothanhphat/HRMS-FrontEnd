import { Row } from 'antd';
import React from 'react';
import { connect } from 'umi';
import ProjectTag from '../ProjectTag';
import styles from './index.less';

const mockProjects = [
  {
    id: 1,
    name: 'Syscloud',
    status: 60,
    members: [
      {
        avatar: '',
        name: 'Aditya Venkatesan',
      },
    ],
  },
  {
    id: 2,
    name: 'Decimal Tech',
    status: 90,
    members: [
      {
        avatar: '',
        name: 'Aditya Venkatesan',
      },
      {
        avatar: '',
        name: 'Aditya Venkatesan',
      },
      {
        avatar: '',
        name: 'Aditya Venkatesan',
      },
    ],
  },
];

const MyProjects = (props) => {
  const { isInModal = false } = props;
  return (
    <div className={styles.MyProjects} style={isInModal ? { maxHeight: '600px' } : {}}>
      <Row gutter={[16, 16]}>
        {mockProjects.map((project) => {
          return <ProjectTag project={project} />;
        })}
      </Row>
    </div>
  );
};

export default connect(() => ({}))(MyProjects);
