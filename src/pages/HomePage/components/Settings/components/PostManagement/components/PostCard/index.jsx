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
  const { dispatch } = props;

  // functions
  const addZeroToNumber = (number) => {
    if (number < 10 && number > 0) return `0${number}`.slice(-2);
    return number;
  };

  const getTabName = (tab) => {
    let count = 0;
    switch (tab.id) {
      case TAB_IDS.ANNOUNCEMENTS:
        count = 0;
        break;
      case TAB_IDS.BIRTHDAY:
        count = 0;
        break;

      case TAB_IDS.IMAGES:
        count = 0;
        break;

      case TAB_IDS.BANNER:
        count = 0;
        break;

      case TAB_IDS.POLLS:
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
      component: <AnnouncementTable />,
    },
    {
      id: TAB_IDS.BIRTHDAY,
      name: 'Birthday',
      component: <BirthdayTable />,
    },
    {
      id: TAB_IDS.IMAGES,
      name: 'Images',
      component: <ImageTable />,
    },
    {
      id: TAB_IDS.BANNER,
      name: 'Banner',
      component: <BannerTable />,
    },
    {
      id: TAB_IDS.POLLS,
      name: 'Polls',
      component: <PollTable />,
    },
  ];

  useEffect(() => {
    dispatch({
      type: 'homePage/fetchPostTypeListEffect',
    });
  }, []);

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

export default connect(({ user: { currentUser = {}, permissions = {} } = {} }) => ({
  currentUser,
  permissions,
}))(PostCard);
