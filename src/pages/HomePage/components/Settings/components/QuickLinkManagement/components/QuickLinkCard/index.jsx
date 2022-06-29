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
    fetchData = () => {},
    quickLinkListAllHomePage = [],
    quickLinkListTimeOff = [],
    loadingFetchQuickLinkList = false,
    totalQuickLinkType = {},
  } = props;
  // redux

  // functions
  const addZeroToNumber = (number) => {
    if (number < 10 && number > 0) return `0${number}`.slice(-2);
    return number;
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
          data={quickLinkListAllHomePage}
          loading={loadingFetchQuickLinkList}
          refreshData={fetchData}
          selectedTab={selectedTab}
          totalQuickLink={totalQuickLinkType}
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
          selectedTab={selectedTab}
          totalQuickLink={totalQuickLinkType}
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
    location: { companyLocationList = [] } = {},
    user: { currentUser = {}, permissions = {} } = {},
  }) => ({
    currentUser,
    permissions,
    companyLocationList,
  }),
)(QuickLinkCard);
