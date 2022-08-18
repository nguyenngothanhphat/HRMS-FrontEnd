import React from 'react';
import styles from './index.less';

const ProjectLayout = ({ children, className }) => {
  return <div className={`${styles.ProjectLayout} ${className}`}>{children}</div>;
};

export default ProjectLayout;
