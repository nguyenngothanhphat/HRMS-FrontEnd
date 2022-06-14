import { Tabs } from 'antd';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import AddButton from './components/AddButton';
import QuickLinkTable from './components/QuickLinkTable';
import TimeOffTable from './components/TimeOffTable';
import styles from './index.less';
import { TAB_IDS_QUICK_LINK } from '@/utils/homePage';

const QuickLinkCard = (props) => {
  const {
    onAddNewQuickLink = () => {},
    selectedTab = '',
    setSelectedTab = () => {},
    onEditQuickLink = () => {},
  } = props;
  // redux
  const {
    homePage: {
      quickLinkListHomePage = [],
      quickLinkListTimeOff = [],
      totalQuickLinkType = [],
    } = {},
    loadingFetchQuickLinkList = false,
  } = props;

  // redux
  const { dispatch } = props;

  // functions
  const addZeroToNumber = (number) => {
    if (number < 10 && number > 0) return `0${number}`.slice(-2);
    return number;
  };

  const fetchTotalQuickLinkType = () => {
    dispatch({
      type: 'homePage/fetchTotalQuickLinkTypeEffect',
    });
  };

  const fetchData = () => {
    let type = '';

    switch (selectedTab) {
      case TAB_IDS_QUICK_LINK.GENERAL:
        type = 'homePage/fetchQuickLinkHomePageEffect';
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
      },
    });
    fetchTotalQuickLinkType();
  };

  const getTabName = (tab) => {
    let count = 0;
    switch (tab.id) {
      case TAB_IDS_QUICK_LINK.GENERAL:
        count =
          totalQuickLinkType.find((x) => x._id === TAB_IDS_QUICK_LINK.GENERAL.toLowerCase())
            ?.count || 0;
        break;
      case TAB_IDS_QUICK_LINK.TIMEOFF:
        count =
          totalQuickLinkType.find((x) => x._id === TAB_IDS_QUICK_LINK.TIMEOFF.toLowerCase())
            ?.count || 0;
        break;
      default:
        break;
    }
    return `${tab.name} (${addZeroToNumber(count)})`;
  };

  const tableTabs = [
    {
      id: TAB_IDS_QUICK_LINK.GENERAL,
      name: TAB_IDS_QUICK_LINK.GENERALTABNAME,
      component: (
        <QuickLinkTable
          data={quickLinkListHomePage}
          loading={loadingFetchQuickLinkList}
          refreshData={fetchData}
          onEditQuickLink={onEditQuickLink}
        />
      ),
    },
    {
      id: TAB_IDS_QUICK_LINK.TIMEOFF,
      name: TAB_IDS_QUICK_LINK.FORTIMEOFF,
      component: (
        <TimeOffTable
          data={quickLinkListTimeOff}
          loading={loadingFetchQuickLinkList}
          refreshData={fetchData}
          onEditQuickLink={onEditQuickLink}
        />
      ),
    },
  ];

  useEffect(() => {
    fetchData();
  }, [selectedTab]);

  const options = () => {
    return <AddButton text="Add New" onClick={onAddNewQuickLink} />;
  };

  return (
    <div className={styles.QuickLinkCard}>
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
    loadingFetchQuickLinkList:
      loading.effects['homePage/fetchQuickLinkHomePageEffect'] ||
      loading.effects['homePage/fetchQuickLinkTimeOffEffect'],
  }),
)(QuickLinkCard);
