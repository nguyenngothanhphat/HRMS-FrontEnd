import React, { useState } from 'react';
import { connect } from 'umi';
import PostCard from './components/PostCard';
import AddPost from './components/AddPost';
import styles from './index.less';
import { TAB_IDS } from '@/utils/homePage';

const PostManagement = () => {
  const [addingPost, setAddingPost] = useState(false);
  const [selectedTab, setSelectedTab] = useState(TAB_IDS.ANNOUNCEMENTS);

  return (
    <div className={styles.PostManagement}>
      {addingPost ? (
        <AddPost onBack={() => setAddingPost(false)} selectedTab={selectedTab} />
      ) : (
        <PostCard
          onAddPost={() => setAddingPost(true)}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
      )}
    </div>
  );
};

export default connect(({ user: { currentUser = {}, permissions = {} } = {} }) => ({
  currentUser,
  permissions,
}))(PostManagement);
