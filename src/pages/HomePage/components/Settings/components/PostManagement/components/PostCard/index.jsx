import { Tabs } from 'antd';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import AddButton from './components/AddButton';
import AnnouncementTable from './components/AnnouncementTable';
import BannerTable from './components/BannerTable';
import BirthdayTable from './components/BirthdayTable';
import ImageTable from './components/ImageTable';
import PollTable from './components/PollTable';
import styles from './index.less';
import { TAB_IDS } from '@/utils/homePage';

const PostCard = (props) => {
  const { onAddPost = () => {}, selectedTab = '', setSelectedTab = () => {} } = props;

  // redux
  const { homePage: { postsByType = [] } = {}, loadingFetchPostList = false } = props;

  // redux
  const { dispatch } = props;

  // functions
  const addZeroToNumber = (number) => {
    if (number < 10 && number > 0) return `0${number}`.slice(-2);
    return number;
  };

  const fetchData = () => {
    dispatch({
      type: 'homePage/fetchPostListByTypeEffect',
      payload: {
        postType: selectedTab,
      },
    });
  };

  const getTabName = (tab) => {
    let count = 0;
    switch (tab.id) {
      case TAB_IDS.ANNOUNCEMENTS:
        count = 0;
        break;
      case TAB_IDS.ANNIVERSARY:
        count = 0;
        break;

      case TAB_IDS.IMAGES:
        count = 0;
        break;

      case TAB_IDS.BANNER:
        count = 0;
        break;

      case TAB_IDS.POLL:
        count = 0;
        break;

      default:
        break;
    }
    return `${tab.name} (${addZeroToNumber(count)})`;
  };

  const tableTabs = [
    {
      id: TAB_IDS.ANNOUNCEMENTS,
      name: 'Announcements',
      component: (
        <AnnouncementTable
          data={postsByType}
          loading={loadingFetchPostList}
          refreshData={fetchData}
        />
      ),
    },
    {
      id: TAB_IDS.ANNIVERSARY,
      name: 'Birthday',
      component: (
        <BirthdayTable data={postsByType} loading={loadingFetchPostList} refreshData={fetchData} />
      ),
    },
    {
      id: TAB_IDS.IMAGES,
      name: 'Images',
      component: (
        <ImageTable data={postsByType} loading={loadingFetchPostList} refreshData={fetchData} />
      ),
    },
    {
      id: TAB_IDS.BANNER,
      name: 'Banner',
      component: (
        <BannerTable data={postsByType} loading={loadingFetchPostList} refreshData={fetchData} />
      ),
    },
    {
      id: TAB_IDS.POLL,
      name: 'Polls',
      component: (
        <PollTable data={postsByType} loading={loadingFetchPostList} refreshData={fetchData} />
      ),
    },
  ];

  useEffect(() => {
    dispatch({
      type: 'homePage/fetchPostTypeListEffect',
    });
  }, []);

  useEffect(() => {
    fetchData();
  }, [selectedTab]);

  const options = () => {
    return <AddButton text="Add Post" onClick={onAddPost} />;
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
  ({ homePage = {}, loading, user: { currentUser = {}, permissions = {} } = {} }) => ({
    currentUser,
    permissions,
    homePage,
    loadingFetchPostList: loading.effects['homePage/fetchPostListByTypeEffect'],
  }),
)(PostCard);
