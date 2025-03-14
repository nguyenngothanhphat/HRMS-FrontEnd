import { Tabs } from 'antd';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import AddButton from './components/AddButton';
import AnnouncementTable from './components/AnnouncementTable';
import BannerTable from './components/BannerTable';
// import BirthdayTable from './components/BirthdayTable';
import ImageTable from './components/ImageTable';
import PollTable from './components/PollTable';
import styles from './index.less';
import { TAB_IDS } from '@/constants/homePage';

const PostCard = (props) => {
  const {
    onAddPost = () => {},
    selectedTab = '',
    setSelectedTab = () => {},
    onEditPost = () => {},
  } = props;

  // redux
  const {
    homePage: {
      announcements = [],
      banners = [],
      polls = [],
      // anniversaries = [],
      images = [],
      totalPostsOfType = [],
    } = {},
    loadingFetchPostList = false,
  } = props;

  // redux
  const { dispatch } = props;

  // functions
  const addZeroToNumber = (number) => {
    if (number < 10 && number > 0) return `0${number}`.slice(-2);
    return number;
  };

  const fetchTotalPostsOfType = () => {
    dispatch({
      type: 'homePage/fetchTotalPostsOfType',
    });
  };

  const fetchData = ({ page } = {}) => {
    let type = '';

    switch (selectedTab) {
      case TAB_IDS.ANNOUNCEMENTS:
        type = 'homePage/fetchAnnouncementsEffect';
        break;
      case TAB_IDS.ANNIVERSARY:
        type = 'homePage/fetchAnniversariesEffect';
        break;
      case TAB_IDS.IMAGES:
        type = 'homePage/fetchImagesEffect';
        break;
      case TAB_IDS.BANNER:
        type = 'homePage/fetchBannersEffect';
        break;
      case TAB_IDS.POLL:
        type = 'homePage/fetchPollsEffect';

        break;
      default:
        break;
    }
    dispatch({
      type,
      payload: {
        postType: selectedTab,
        page,
      },
    });
    fetchTotalPostsOfType();
  };

  const getTotalTab = (tabId) => {
    let count = 0;
    switch (tabId) {
      case TAB_IDS.ANNOUNCEMENTS:
        count = totalPostsOfType.find((x) => x._id === TAB_IDS.ANNOUNCEMENTS)?.count || 0;
        break;
      case TAB_IDS.ANNIVERSARY:
        count = totalPostsOfType.find((x) => x._id === TAB_IDS.ANNIVERSARY)?.count || 0;
        break;

      case TAB_IDS.IMAGES:
        count = totalPostsOfType.find((x) => x._id === TAB_IDS.IMAGES)?.count || 0;
        break;

      case TAB_IDS.BANNER:
        count = totalPostsOfType.find((x) => x._id === TAB_IDS.BANNER)?.count || 0;
        break;

      case TAB_IDS.POLL:
        count = totalPostsOfType.find((x) => x._id === TAB_IDS.POLL)?.count || 0;
        break;

      default:
        break;
    }
    return count;
  };

  const getTabName = (tab) => {
    return `${tab.name} (${addZeroToNumber(getTotalTab(tab.id))})`;
  };

  const tableTabs = [
    {
      id: TAB_IDS.ANNOUNCEMENTS,
      name: 'Announcements',
      component: (
        <AnnouncementTable
          data={announcements}
          loading={loadingFetchPostList}
          refreshData={fetchData}
          onEditPost={onEditPost}
          totalType={getTotalTab(TAB_IDS.ANNOUNCEMENTS)}
        />
      ),
    },
    // {
    //   id: TAB_IDS.ANNIVERSARY,
    //   name: 'Birthday',
    //   component: (
    //     <BirthdayTable
    //       data={anniversaries}
    //       loading={loadingFetchPostList}
    //       refreshData={fetchData}
    //       onEditPost={onEditPost}
    //     />
    //   ),
    // },
    {
      id: TAB_IDS.IMAGES,
      name: 'Images',
      component: (
        <ImageTable
          data={images}
          loading={loadingFetchPostList}
          refreshData={fetchData}
          onEditPost={onEditPost}
          totalType={getTotalTab(TAB_IDS.IMAGES)}
        />
      ),
    },
    {
      id: TAB_IDS.BANNER,
      name: 'Banner',
      component: (
        <BannerTable
          data={banners}
          loading={loadingFetchPostList}
          refreshData={fetchData}
          onEditPost={onEditPost}
          onAddPost={onAddPost}
          totalType={getTotalTab(TAB_IDS.BANNER)}
        />
      ),
    },
    {
      id: TAB_IDS.POLL,
      name: 'Polls',
      component: (
        <PollTable
          data={polls}
          loading={loadingFetchPostList}
          refreshData={fetchData}
          onEditPost={onEditPost}
          totalType={getTotalTab(TAB_IDS.POLL)}
        />
      ),
    },
  ];

  useEffect(() => {
    dispatch({
      type: 'homePage/fetchPostTypeListEffect',
    });
  }, []);

  useEffect(() => {
    fetchData({});
  }, [selectedTab]);

  const options = () => {
    if (selectedTab !== TAB_IDS.BANNER) {
      return <AddButton text="Add Post" onClick={onAddPost} />;
    }
    return '';
  };

  return (
    <div className={styles.PostCard}>
      <Tabs
        defaultActiveKey={selectedTab}
        destroyInactiveTabPane
        tabBarExtraContent={options()}
        onTabClick={(key) => setSelectedTab(key)}
      >
        {tableTabs.map((x) => (
          <Tabs.TabPane tab={getTabName(x)} key={x.id}>
            {x.component}
          </Tabs.TabPane>
        ))}
      </Tabs>
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
    loadingFetchPostList:
      loading.effects['homePage/fetchAnnouncementsEffect'] ||
      loading.effects['homePage/fetchAnniversariesEffect'] ||
      loading.effects['homePage/fetchBannersEffect'] ||
      loading.effects['homePage/fetchImagesEffect'] ||
      loading.effects['homePage/fetchPollsEffect'],
  }),
)(PostCard);
