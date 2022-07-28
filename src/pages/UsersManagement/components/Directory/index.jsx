import { CloseOutlined } from '@ant-design/icons';
import { Layout, Skeleton, Tabs, Tag } from 'antd';
import React, { Suspense, useEffect, useState } from 'react';
import { connect } from 'umi';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import FilterPopover from '@/components/FilterPopover';
import CustomOrangeButton from '@/components/CustomOrangeButton';
import DirectoryTable from './components/DirectoryTable';
// import FilterContent from '../FilterContent';

import styles from './index.less';

const FilterContent = React.lazy(() => import('./components/FilterContent'));

const { Content } = Layout;
const { TabPane } = Tabs;

const DirectoryComponent = (props) => {
  const {
    dispatch,
    usersManagement: { filter = {}, filterList = {}, total = 0, employeeList = [] } = {},
    currentUser: { roles = [] },
    companiesOfUser = [],
    loadingFetchList,
    loadingFetchFilterList,
    companyLocationList = [],
  } = props;

  const { listCountry = [] } = filterList;

  const [tabList] = useState({
    active: 'active',
    inActive: 'inActive',
  });

  const [tabId, setTabId] = useState('active');
  const [applied, setApplied] = useState(0);
  const [pageSelected, setPageSelected] = useState(1);
  const [size, setSize] = useState(10);

  // FUNCTIONALITY
  const clearFilter = () => {
    dispatch({
      type: 'usersManagement/clearFilter',
    });
    setApplied(0);
  };

  // USE EFFECT
  useEffect(() => {
    return () => {
      setTabId('active');
      setPageSelected(1);
      setSize(10);
      dispatch({
        type: 'usersManagement/save',
        payload: {
          filterList: {},
          filter: {},
        },
      });
    };
  }, []);

  const getPageSelected = (page) => {
    setPageSelected(page);
  };

  const getSize = (sizeProp) => {
    setSize(sizeProp);
  };

  const renderData = () => {
    const { active, inActive } = tabList;

    // if there are location & company, call API
    const checkCallAPI =
      companiesOfUser.length > 0 && companyLocationList.length > 0 && listCountry.length > 0;

    if (checkCallAPI) {
      // MULTI COMPANY & LOCATION PAYLOAD
      if (tabId === active) {
        dispatch({
          type: 'usersManagement/fetchEmployeesList',
          payload: {
            ...filter,
            status: ['ACTIVE'],
            company: getCurrentCompany(),
            tenantId: getCurrentTenant(),
          },
          params: {
            page: pageSelected,
            limit: size,
          },
        });
      }

      if (tabId === inActive) {
        dispatch({
          type: 'usersManagement/fetchEmployeesList',
          payload: {
            ...filter,
            status: ['INACTIVE'],
            company: getCurrentCompany(),
            tenantId: getCurrentTenant(),
          },
          params: {
            page: pageSelected,
            limit: size,
          },
        });
      }
    }
  };

  const refreshData = () => {
    renderData();
  };

  useEffect(() => {
    refreshData();
  }, [JSON.stringify(filter), JSON.stringify(listCountry), pageSelected, size, tabId]);

  const handleClickTabPane = async (tabIdProp) => {
    setTabId(tabIdProp);
  };

  useEffect(() => {
    clearFilter();
  }, [tabId]);

  const handleFilterCounts = (values) => {
    const filteredObj = Object.entries(values).filter(
      ([, value]) => (value !== undefined && value?.length > 0) || typeof value === 'number',
    );
    const newObj = Object.fromEntries(filteredObj);
    setApplied(Object.keys(newObj).length);
  };

  const rightButton = () => {
    return (
      <div className={styles.tabBarExtra}>
        {applied > 0 && (
          <Tag
            className={styles.tagCountFilter}
            closable
            closeIcon={<CloseOutlined />}
            onClose={() => {
              clearFilter();
            }}
          >
            {applied} filters applied
          </Tag>
        )}

        <FilterPopover
          placement="bottomRight"
          content={
            <Suspense fallback={<Skeleton active />}>
              <FilterContent activeTab={tabId} handleFilterCounts={handleFilterCounts} />
            </Suspense>
          }
          realTime
          submitText="Apply"
          closeText="Clear"
          onSecondButton={clearFilter}
        >
          <CustomOrangeButton fontSize={14} showDot={Object.keys(filter).length > 0} />
        </FilterPopover>
      </div>
    );
  };

  const renderTabPane = () => {
    const { active, inActive } = tabList;

    return (
      <>
        <TabPane tab="Active Users" key={active}>
          <Layout className={styles.directoryLayout_inner}>
            <Content className="site-layout-background">
              <DirectoryTable
                loading={loadingFetchList || loadingFetchFilterList}
                list={employeeList}
                keyTab={active}
                getPageSelected={getPageSelected}
                getSize={getSize}
                pageSelected={pageSelected}
                rowSize={size}
                total={total}
                refreshData={refreshData}
              />
            </Content>
          </Layout>
        </TabPane>
        <TabPane tab="Inactive Users" key={inActive}>
          <Layout className={styles.directoryLayout_inner}>
            <Content className="site-layout-background">
              <DirectoryTable
                loading={loadingFetchList || loadingFetchFilterList}
                list={employeeList}
                keyTab={inActive}
                getPageSelected={getPageSelected}
                getSize={getSize}
                pageSelected={pageSelected}
                rowSize={size}
                total={total}
                refreshData={refreshData}
              />
            </Content>
          </Layout>
        </TabPane>
      </>
    );
  };

  return (
    <div className={styles.DirectoryComponent}>
      <div className={styles.contentContainer}>
        <Tabs
          // defaultActiveKey="active"
          className={styles.TabComponent}
          onTabClick={handleClickTabPane}
          tabBarExtraContent={rightButton(roles)}
        >
          {renderTabPane()}
        </Tabs>
      </div>
    </div>
  );
};

export default connect(
  ({
    loading,
    location: { companyLocationList = [] } = {},
    employee,
    user: { currentUser = {}, permissions = {}, companiesOfUser = [] },
    usersManagement,
  }) => ({
    loadingFetchList: loading.effects['usersManagement/fetchEmployeesList'],
    loadingFetchFilterList: loading.effects['employee/fetchFilterList'],
    loadingExportCSV: loading.effects['employee/exportEmployees'],
    employee,
    currentUser,
    permissions,
    companyLocationList,
    companiesOfUser,
    usersManagement,
  }),
)(DirectoryComponent);
