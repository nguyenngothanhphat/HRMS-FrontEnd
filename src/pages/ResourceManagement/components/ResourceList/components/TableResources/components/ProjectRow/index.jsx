import React from 'react';
import styles from './index.less';

const ProjectRow = ({ value, length, index, className }) => {
  return (
    <div
      className={styles.ProjectRow}
      style={{ borderBottom: length > 1 && index < length - 1 ? '1px solid #f0f0f0' : undefined }}
    >
      <div className={`${styles.value} ${className}`}>{value}</div>
    </div>
  );
};

export default ProjectRow;
