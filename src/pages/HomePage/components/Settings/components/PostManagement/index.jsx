import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import PostCard from './components/PostCard';
import AddPost from './components/AddPost';
import styles from './index.less';
import { TAB_IDS } from '@/utils/homePage';
import { goToTop } from '@/utils/utils';

const PostManagement = () => {
  const [addingPost, setAddingPost] = useState(false);
  const [editingPost, setEditingPost] = useState(false);
  const [record, setRecord] = useState({});
  const [selectedTab, setSelectedTab] = useState(TAB_IDS.ANNOUNCEMENTS);

  const onAddPost = (recordTemp) => {
    setRecord(recordTemp);
    setAddingPost(true);
    goToTop();
  };

  const onEditPost = (recordTemp) => {
    setRecord(recordTemp);
    setEditingPost(true);
    goToTop();
  };

  const onBack = () => {
    setAddingPost(false);
    setEditingPost(false);
    goToTop();
  };

  useEffect(() => {
    goToTop();
  }, []);

  if (addingPost) {
    return (
      <div className={styles.PostManagement}>
        <AddPost onBack={onBack} selectedTab={selectedTab} record={record} />
      </div>
    );
  }
  if (editingPost) {
    return (
      <div className={styles.PostManagement}>
        <AddPost onBack={onBack} selectedTab={selectedTab} editing record={record} />
      </div>
    );
  }
  return (
    <div className={styles.PostManagement}>
      <PostCard
        onAddPost={onAddPost}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        onEditPost={onEditPost}
      />
    </div>
  );
};

export default connect(({ user: { currentUser = {}, permissions = {} } = {} }) => ({
  currentUser,
  permissions,
}))(PostManagement);
