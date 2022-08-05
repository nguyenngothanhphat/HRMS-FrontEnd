import { CloseOutlined } from '@ant-design/icons';
import { Layout, Skeleton, Tabs, Tag } from 'antd';
import React, { Suspense, useEffect, useState } from 'react';
import { connect, formatMessage } from 'umi';
import iconDownload from '@/assets/download-icon-yellow.svg';
import CustomOrangeButton from '@/components/CustomOrangeButton';
import FilterPopover from '@/components/FilterPopover';
import {
  getCurrentCompany,
  getCurrentLocation,
  getCurrentTenant,
  isOwner,
} from '@/utils/authority';
import { exportArrayDataToCsv, exportRawDataToCSV } from '@/utils/exportToCsv';
import AddEmployeeModal from './components/AddEmployeeModal';
import DirectoryTable from './components/DirectoryTable';
import ImportEmployeeModal from './components/ImportEmployeeModal';
// import FilterContent from '../FilterContent';

import styles from './index.less';
import FilterCountTag from '@/components/FilterCountTag';

const FilterContent = React.lazy(() => import('./components/FilterContent'));

const { Content } = Layout;
const { TabPane } = Tabs;

const DirectoryComponent = (props) => {
  const {
    dispatch,
    permissions = {},
    employee: {
      filter = {},
      listEmployeeActive = [],
      listEmployeeMyTeam = [],
      listEmployeeInActive = [],
    },
    currentUser: { roles = [] },
    companiesOfUser = [],
    loadingCompaniesOfUser = false,
    currentPayload = {},
    loadingListActive,
    loadingListMyTeam,
    loadingListInActive,
    loadingFetchFilterList,
    filterList: { listCountry = [] } = {},
    companyLocationList = [],
    totalActiveEmployee,
    totalInactiveEmployee,
    totalMyTeam,
  } = props;

  const [tabList] = useState({
    active: 'active',
    myTeam: 'myTeam',
    inActive: 'inActive',
  });
  const [tabId, setTabId] = useState('active');
  const [pageSelected, setPageSelected] = useState(1);
  const [size, setSize] = useState(10);
  const [visible, setVisible] = useState(false);
  const [visibleImportEmployee, setVisibleImportEmployee] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  // FUNCTIONALITY
  // Define tabID to filter
  const initTabId = () => {
    let tabIdTemp = 'active';
    const viewTabActive = permissions.viewTabActive === -1;
    const viewTabInActive = permissions.viewTabInActive === -1;

    if (viewTabActive) {
      tabIdTemp = 'inActive';
    }

    // Set tabId for myTeam to hide button Filter
    if (viewTabActive && viewTabInActive) {
      tabIdTemp = 'myTeam';
    }

    setTabId(tabIdTemp);
  };

  const clearFilter = () => {
    dispatch({
      type: 'employee/clearFilter',
    });
  };

  // USE EFFECT
  useEffect(() => {
    initTabId();
    dispatch({
      type: 'employeesManagement/fetchCompanyList',
    });
    return () => {
      setTabId('active');
      setPageSelected(1);
      setSize(10);

      clearFilter();

      dispatch({
        type: 'employee/save',
        payload: {
          filterList: {},
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

  const renderData = (params = {}) => {
    const { active, myTeam, inActive } = tabList;
    const currentCompany = getCurrentCompany();
    const currentLocation = getCurrentLocation();
    const {
      // country = [], state = [],
      page = 1,
      company = [],
    } = params;

    // if there are location & company, call API
    const checkCallAPI =
      companiesOfUser.length > 0 && companyLocationList.length > 0 && listCountry.length > 0;

    if (checkCallAPI) {
      // MULTI COMPANY & LOCATION PAYLOAD
      let companyPayload = [];
      const companyList = companiesOfUser.filter(
        (comp) => comp?._id === currentCompany || comp?.childOfCompany === currentCompany,
      );
      const isOwnerCheck = isOwner();
      // OWNER
      if (!currentLocation && isOwnerCheck) {
        if (company.length !== 0) {
          companyPayload = companyList.filter((lo) => company.includes(lo?._id));
        } else {
          companyPayload = [...companyList];
        }
      } else companyPayload = companyList.filter((lo) => lo?._id === currentCompany);
      const payload = {
        ...params,
        company: isOwnerCheck ? getCurrentCompany() : companyPayload,
        tenantId: getCurrentTenant(),
      };
      setPageSelected(page || 1);

      // permissions to view tab
      const viewTabActive = permissions.viewTabActive !== -1;
      const viewTabInActive = permissions.viewTabInActive !== -1;
      const viewTabMyTeam = permissions.viewTabMyTeam !== -1;

      if (viewTabActive && tabId === active) {
        dispatch({
          type: 'employee/fetchListEmployeeActive',
          payload,
          params: {
            page: payload.page,
            limit: payload.limit,
          },
        });
      }

      if (viewTabMyTeam && tabId === myTeam) {
        const { currentUser = {} } = props;
        const employee = currentUser ? currentUser.employee._id : '';
        dispatch({
          type: 'employee/fetchListEmployeeMyTeam',
          payload: {
            ...payload,
            // department: [departmentName],
            roles: currentUser?.roles || [],
            employee,
            params: {
              page: payload.page,
              limit: payload.limit,
            },
          },
        });
      }
      if (viewTabInActive && tabId === inActive) {
        dispatch({
          type: 'employee/fetchListEmployeeInActive',
          payload,
          params,
        });
      }
    }
  };

  const refreshData = () => {
    setIsFiltering(true);
    setPageSelected(1);
    renderData({
      ...filter,
      page: 1,
      limit: size,
    });
    setTimeout(() => {
      setIsFiltering(false);
    }, 50);
  };

  useEffect(() => {
    refreshData();
  }, [JSON.stringify(filter), JSON.stringify(listCountry), size, tabId]);

  // pageSelected change => only call API when not using filter (isFiltering = false)
  useEffect(() => {
    if (!isFiltering) {
      renderData({
        ...filter,
        page: pageSelected,
        limit: size,
      });
    }
  }, [pageSelected]);

  const renderListEmployee = () => {
    const { active, myTeam } = tabList;

    if (tabId === active) {
      return listEmployeeActive;
    }
    if (tabId === myTeam) {
      return listEmployeeMyTeam;
    }
    return listEmployeeInActive;
  };

  const handleClickTabPane = async (tabIdProp) => {
    setTabId(tabIdProp);

    await dispatch({
      type: 'employee/clearFilter',
    });
  };

  useEffect(() => clearFilter, [tabId]);

  const exportEmployees = async () => {
    const getData = await dispatch({
      type: 'employee/exportEmployees',
      payload: { ...currentPayload, filter },
    });

    const getListExport = getData.data || '';
    exportRawDataToCSV(getListExport, 'listEmployee');
  };

  const openFormImportEmployees = () => {
    setVisibleImportEmployee(true);
  };

  const importEmployees = () => {
    openFormImportEmployees();
  };

  const openFormAddEmployee = () => {
    setVisible(true);
  };
  const addEmployee = () => {
    openFormAddEmployee();
  };

  const processData = (array) => {
    // Uppercase first letter
    let capsPopulations = [];
    capsPopulations = array.map((item) => {
      return {
        'Employee Id': item.employeeId,
        'First Name': item.firstName,
        'Last Name': item.lastName,
        'Middle Name': item.middleName,
        Gender: item.gender,
        'Date of Birth': item.dateOfBirth,
        'Joined Date': item.joinDate,
        Location: item.location,
        Department: item.department,
        'Employee Type': item.employeeType,
        'Employment Type': item.employmentType,
        Title: item.title,
        'Work Email': item.workEmail,
        'Personal Email': item.personalEmail,
        'Manager Work Email': item.managerWorkEmail,
        'Personal Number': item.personalNumber,
      };
    });

    // Get keys, header csv
    const keys = Object.keys(capsPopulations[0]);
    const dataExport = [];
    dataExport.push(keys);

    // Add the rows
    capsPopulations.forEach((obj) => {
      const value = `${keys.map((k) => obj[k]).join('_')}`.split('_');
      dataExport.push(value);
    });

    return dataExport;
  };

  // Download template to import employees
  const downloadTemplate = () => {
    const exportData = [
      {
        employeeId: 'PSI-0000',
        firstName: 'First Name',
        lastName: 'Last Name',
        middleName: 'Middle Name',
        gender: 'Male',
        dateOfBirth: '05/10/2022',
        joinDate: '11/30/2020',
        location: 'Vietnam',
        department: 'Engineering',
        employeeType: 'Regular',
        employmentType: 'Full Time',
        title: 'Junior Frontend',
        workEmail: 'template@mailinator.com',
        personalEmail: 'template@mailinator.com',
        managerWorkEmail: 'manager@mailinator.com',
        personalNumber: '0123456789',
      },
    ];
    exportArrayDataToCsv('Template_Import_Employees', processData(exportData));
  };

  const rightButton = () => {
    const findIndexImport = permissions.importEmployees !== -1;
    const findIndexAdd = permissions.addEmployee !== -1;
    const applied = Object.values(filter).filter((v) => v).length;

    return (
      <div className={styles.tabBarExtra}>
        <FilterCountTag
          count={applied}
          onClearFilter={() => {
            clearFilter();
          }}
        />

        {findIndexImport && (
          <CustomOrangeButton onClick={downloadTemplate} icon={iconDownload}>
            {formatMessage({ id: 'pages_admin.employees.table.downloadTemplate' })}
          </CustomOrangeButton>
        )}

        {findIndexImport && (
          <CustomOrangeButton onClick={exportEmployees} icon={iconDownload}>
            {formatMessage({ id: 'pages_admin.employees.table.exportEmployees' })}
          </CustomOrangeButton>
        )}

        {findIndexImport && (
          <CustomOrangeButton onClick={importEmployees} icon="/assets/images/import.svg">
            {formatMessage({ id: 'pages_admin.employees.table.importEmployees' })}
          </CustomOrangeButton>
        )}

        {findIndexAdd && (
          <CustomOrangeButton onClick={addEmployee} icon="/assets/images/addMemberIcon.svg">
            {formatMessage({ id: 'pages_admin.employees.table.addEmployee' })}
          </CustomOrangeButton>
        )}

        <FilterPopover
          placement="bottomRight"
          content={
            <Suspense fallback={<Skeleton active />}>
              <FilterContent activeTab={tabId} filter={filter} />
            </Suspense>
          }
          realTime
          submitText="Apply"
          closeText="Clear"
          onSecondButton={clearFilter}
        >
          <CustomOrangeButton fontSize={14} showDot={applied > 0} />
        </FilterPopover>
      </div>
    );
  };

  const renderTab = (tabName, key, loading) => {
    return (
      <TabPane tab={tabName} key={key}>
        <Layout className={styles.directoryLayout_inner}>
          <Content className="site-layout-background">
            <DirectoryTable
              loading={loading}
              list={renderListEmployee(key)}
              keyTab={key}
              getPageSelected={getPageSelected}
              getSize={getSize}
              pageSelected={pageSelected}
              rowSize={size}
              tabName={tabName}
              totalActiveEmployee={totalActiveEmployee}
              totalInactiveEmployee={totalInactiveEmployee}
              totalMyTeam={totalMyTeam}
              refreshData={refreshData}
            />
          </Content>
        </Layout>
      </TabPane>
    );
  };

  const renderTabPane = () => {
    const { active, myTeam, inActive } = tabList;

    const findIndexActive = permissions.viewTabActive;
    const findIndexMyTeam = permissions.viewTabMyTeam;
    const findIndexInActive = permissions.viewTabInActive;
    const findIndexShowLocationActive = permissions.filterLocationActive;
    const findIndexShowLocationInActive = permissions.filterLocationInActive;

    return (
      <>
        {findIndexActive !== -1 &&
          renderTab(
            formatMessage({ id: 'pages.directory.directory.activeEmployeesTab' }),
            active,
            loadingListActive || loadingFetchFilterList,
            findIndexShowLocationActive,
          )}
        {findIndexMyTeam !== -1 && (
          <>
            {renderTab(
              formatMessage({ id: 'pages.directory.directory.myTeamTab' }),
              myTeam,
              loadingListMyTeam || loadingFetchFilterList,
            )}
          </>
        )}
        {findIndexInActive !== -1 &&
          renderTab(
            formatMessage({ id: 'pages.directory.directory.inactiveEmployeesTab' }),
            inActive,
            loadingListInActive || loadingFetchFilterList,
            findIndexShowLocationInActive,
          )}
      </>
    );
  };

  const handleCancel = () => {
    setVisible(false);
    setVisibleImportEmployee(false);
  };

  return (
    <div className={styles.DirectoryComponent}>
      {loadingCompaniesOfUser ? (
        <Skeleton />
      ) : (
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
      )}

      <AddEmployeeModal
        company={getCurrentCompany()}
        titleModal="Add Employee"
        visible={visible}
        handleCancel={handleCancel}
        handleRefresh={refreshData}
      />
      {visibleImportEmployee && (
        <ImportEmployeeModal
          company={companiesOfUser}
          titleModal="Import Employees"
          visible={visibleImportEmployee}
          handleCancel={handleCancel}
          handleRefresh={refreshData}
        />
      )}
    </div>
  );
};

export default connect(
  ({
    loading,
    location: { companyLocationList = [] } = {},
    employee,
    user: { currentUser = {}, permissions = {}, companiesOfUser = [] },
    employee: {
      currentPayload = {},
      filterList = {},
      totalActiveEmployee = '',
      totalInactiveEmployee = '',
      totalMyTeam = '',
    } = {},
  }) => ({
    loadingListActive: loading.effects['employee/fetchListEmployeeActive'],
    loadingListMyTeam: loading.effects['employee/fetchListEmployeeMyTeam'],
    loadingListInActive: loading.effects['employee/fetchListEmployeeInActive'],
    loadingCompaniesOfUser: loading.effects['user/fetchCompanyOfUser'],
    loadingFetchFilterList: loading.effects['employee/fetchFilterList'],
    loadingExportCSV: loading.effects['employee/exportEmployees'],
    employee,
    currentUser,
    permissions,
    companyLocationList,
    companiesOfUser,
    filterList,
    currentPayload,
    totalActiveEmployee,
    totalInactiveEmployee,
    totalMyTeam,
  }),
)(DirectoryComponent);
