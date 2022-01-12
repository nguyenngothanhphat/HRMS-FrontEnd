import React from 'react';
import { connect } from 'umi';
import PostCard from './components/PostCard';
import styles from './index.less';

const PostManagement = () => {
  return (
    <div className={styles.PostManagement}>
      <PostCard />
    </div>
  );
};

export default connect(({ user: { currentUser = {}, permissions = {} } = {} }) => ({
  currentUser,
  permissions,
}))(PostManagement);
