import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import QuickLinkCard from './components/QuickLinkCard';
import AddNewQuickLink from './components/AddNewQuickLink';
import { TAB_IDS_QUICK_LINK } from '@/utils/homePage';
import { goToTop } from '@/utils/utils';
// import styles from './index.less';

const QuickLinkManagement = () => {
  const [addingPost, setAddingPost] = useState(false);
  const [editingPost, setEditingPost] = useState(false);
  const [record, setRecord] = useState({});
  const [selectedTab, setSelectedTab] = useState(TAB_IDS_QUICK_LINK.GENERAL);

  const onAddNewQuickLink = (recordTemp) => {
    setRecord(recordTemp);
    setAddingPost(true);
    goToTop();
  };

  const onEditQuickLink = (recordTemp) => {
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
      <div>
        <AddNewQuickLink onBack={onBack} selectedTab={selectedTab} record={record} />
      </div>
    );
  }
  if (editingPost) {
    return (
      <div>
        <AddNewQuickLink onBack={onBack} selectedTab={selectedTab} editing record={record} />
      </div>
    );
  }
  return (
    <div>
      <QuickLinkCard
        onAddNewQuickLink={onAddNewQuickLink}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        onEditQuickLink={onEditQuickLink}
      />
    </div>
  );
};

export default connect(({ user: { currentUser = {}, permissions = {} } = {} }) => ({
  currentUser,
  permissions,
}))(QuickLinkManagement);
