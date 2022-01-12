import React from 'react';
import { connect } from 'umi';
import styles from './index.less';

const AddPost = () => {
  return (
    <div className={styles.AddPost}>
      Add Post 
    </div>
  );
};

export default connect(({ user: { currentUser = {}, permissions = {} } = {} }) => ({
  currentUser,
  permissions,
}))(AddPost);
