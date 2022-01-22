import React, { useState } from 'react';
import { connect } from 'umi';
import PostCard from './components/PostCard';
import AddPost from './components/AddPost';
import styles from './index.less';

const PostManagement = () => {
  const [addingPost, setAddingPost] = useState(false);
  return (
    <div className={styles.PostManagement}>
      {addingPost ? (
        <AddPost onBack={() => setAddingPost(false)} />
      ) : (
        <PostCard onAddPost={() => setAddingPost(true)} />
      )}
    </div>
  );
};

export default connect(({ user: { currentUser = {}, permissions = {} } = {} }) => ({
  currentUser,
  permissions,
}))(PostManagement);
