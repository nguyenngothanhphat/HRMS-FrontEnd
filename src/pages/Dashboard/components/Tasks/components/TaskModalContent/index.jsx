import React from 'react';
import { connect } from 'umi';
import MyTasks from '../MyTasks';
import MyProjects from '../MyProjects';

const TaskModalContent = (props) => {
  const { tabKey = '' } = props;

  const renderModalContent = () => {
    switch (tabKey) {
      case '1':
        return <MyTasks isInModal />;
      case '2':
        return <MyProjects isInModal />;
      default:
        return '';
    }
  };

  return <div>{renderModalContent()}</div>;
};

export default connect(() => ({}))(TaskModalContent);
