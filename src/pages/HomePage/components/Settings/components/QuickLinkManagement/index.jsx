import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import QuickLinkCard from './components/QuickLinkCard';
import AddNewQuickLink from './components/AddNewQuickLink';
import { TAB_IDS_QUICK_LINK } from '@/utils/homePage';
import { goToTop } from '@/utils/utils';
// import styles from './index.less';

const QuickLinkManagement = (props) => {
  const [addingPost, setAddingPost] = useState(false);
  const [editingPost, setEditingPost] = useState(false);
  const [record, setRecord] = useState({});
  const [selectedTab, setSelectedTab] = useState(TAB_IDS_QUICK_LINK.GENERAL);

  const {
    homePage: {
      quickLinkListAllHomePage = [],
      quickLinkListTimeOff = [],
      totalQuickLinkType = [],
    } = {},
    loadingFetchQuickLinkList = false,
  } = props;

  // redux
  const { dispatch } = props;

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

  const fetchTotalQuickLinkType = () => {
    dispatch({
      type: 'homePage/fetchTotalQuickLinkTypeEffect',
    });
  };

  const fetchData = (page = 1, limit = 10) => {
    let type = '';

    switch (selectedTab) {
      case TAB_IDS_QUICK_LINK.GENERAL:
        type = 'homePage/fetchAllQuickLinkHomePageEffect';
        break;
      case TAB_IDS_QUICK_LINK.TIMEOFF:
        type = 'homePage/fetchQuickLinkTimeOffEffect';
        break;
      default:
        break;
    }
    dispatch({
      type,
      payload: {
        type: selectedTab.toLowerCase(),
        page,
        limit,
      },
    });
    fetchTotalQuickLinkType();
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
        <AddNewQuickLink
          onBack={onBack}
          fetchData={fetchData}
          selectedTab={selectedTab}
          record={record}
        />
      </div>
    );
  }
  if (editingPost) {
    return (
      <div>
        <AddNewQuickLink
          onBack={onBack}
          fetchData={fetchData}
          selectedTab={selectedTab}
          editing
          record={record}
        />
      </div>
    );
  }
  return (
    <div>
      <QuickLinkCard
        onAddNewQuickLink={onAddNewQuickLink}
        quickLinkListAllHomePage={quickLinkListAllHomePage}
        selectedTab={selectedTab}
        quickLinkListTimeOff={quickLinkListTimeOff}
        totalQuickLinkType={totalQuickLinkType}
        loadingFetchQuickLinkList={loadingFetchQuickLinkList}
        setSelectedTab={setSelectedTab}
        fetchData={fetchData}
        onEditQuickLink={onEditQuickLink}
      />
    </div>
  );
};

export default connect(
  ({
    homePage = {},
    location: { companyLocationList = [] } = {},
    loading,
    user: { currentUser = {}, permissions = {} } = {},
  }) => ({
    currentUser,
    permissions,
    homePage,
    companyLocationList,
    loadingFetchQuickLinkList:
      loading.effects['homePage/fetchAllQuickLinkHomePageEffect'] ||
      loading.effects['homePage/fetchQuickLinkTimeOffEffect'],
  }),
)(QuickLinkManagement);
