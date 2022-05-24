import React from 'react';
import styles from './index.less';

const ViewCommentModalContent = (props) => {
  const { comment = '' } = props;
  return (
    <div className={styles.ViewCommentModalContent}>
      <span>{comment}</span>
    </div>
  );
};
export default ViewCommentModalContent;
