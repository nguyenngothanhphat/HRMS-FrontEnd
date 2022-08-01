import { CloseOutlined } from '@ant-design/icons';
import { Form, Layout, Select, Tabs, Tag } from 'antd';
import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import CommonModal from '@/components/CommonModal';
import CustomAddButton from '@/components/CustomAddButton';
import CustomOrangeButton from '@/components/CustomOrangeButton';
import CustomSearchBox from '@/components/CustomSearchBox';
import FilterPopover from '@/components/FilterPopover';
import { getCurrentTenant } from '@/utils/authority';
import TableCustomers from '../TableCustomers';
import ModalAdd from './components/AddModalContent';
import FilterContent from './components/FilterContent';
import styles from './index.less';

const { Content } = Layout;
const { TabPane } = Tabs;

const TableContainer = (props) => {
  const [form] = Form.useForm();

  const {
    dispatch,
    listCustomer,
    loadingCustomer,
    companyList = [],
    loadingFilter = false,
    loadingAdd = false,
  } = props;
  const [isShown, setIsShown] = useState(false);
  const [applied, setApplied] = useState(0);
  const [arr, setArr] = useState([]);
  const [isFiltering, setIsFiltering] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [filter, setFilter] = useState({});

  useEffect(() => {
    dispatch({
      type: 'customerManagement/fetchCompanyList',
    });

    return () => {
      dispatch({
        type: 'customerManagement/save',
        payload: {
          filter: {},
        },
      });
    };
  }, []);

  const handleFilterCount = (values) => {
    const newObj = Object.assign(arr, values);
    const filteredObj = Object.entries(newObj).filter(
      ([, value]) => value !== undefined && value?.length > 0,
    );
    setApplied(Object.keys(filteredObj).length);
    setIsFiltering(Object.keys(filteredObj).length > 0);
  };

  useEffect(() => {
    dispatch({
      type: 'customerManagement/fetchCustomerList',
      payload: {
        searchKey: searchValue,
      },
    });
  }, [searchValue]);

  useEffect(() => {
    dispatch({
      type: 'customerManagement/filterListCustomer',
      payload: {
        ...filter,
      },
    });
    handleFilterCount(filter);
  }, [JSON.stringify(filter)]);

  // submit filter
  const onFilter = async (values) => {
    setFilter(values);
  };

  // cancel and reset fill in modal
  const onCloseModal = () => {
    setIsShown(false);
  };

  const clearFilter = () => {
    setApplied(0);
    setArr([]);
    setIsFiltering(false);
    form.resetFields();
  };

  // add new Customer
  const handleAddNew = (values, countryName) => {
    const {
      customerID,
      status,
      legalName,
      dba,
      phone,
      email,
      addressLine1,
      addressLine2,
      state,
      city,
      zipCode,
      website,
      tags,
      comments,
      accountOwner,
    } = values;

    dispatch({
      type: 'customerManagement/addNewCustomer',
      payload: {
        tenantId: getCurrentTenant(),
        customerId: customerID,
        status,
        legalName: legalName || '',
        dba: dba || '',
        contactPhone: phone || '',
        contactEmail: email,
        addressLine1: addressLine1 || '',
        addressLine2: addressLine2 || '',
        city: city || '',
        state: state || "''",
        country: countryName.name || '',
        postalCode: zipCode || '',
        accountOwner: accountOwner || '',
        tags: tags || [],
        comment: comments || '',
        website: website || '',
      },
    }).then(() => {
      dispatch({
        type: 'customerManagement/fetchCustomerList',
      });
      setIsShown(false);
    });
  };

  const addZeroToNumber = (number) => {
    if (number < 10 && number >= 0) return `0${number}`.slice(-2);
    return number;
  };

  const tabs = [{ id: 1, name: `Customers (${addZeroToNumber(listCustomer.length)})` }];
  const listStatus = [
    <Select.Option key="Engaging">Engaging</Select.Option>,
    <Select.Option key="Active">Active</Select.Option>,
    <Select.Option key="Inactive">Inactive</Select.Option>,
  ];

  const onSearchDebounce = debounce((value) => {
    setSearchValue(value);
  }, 1000);

  const onSearch = (e) => {
    const { value = '' } = e.target;
    onSearchDebounce(value);
  };

  const menu = (
    <div className={styles.tabExtraContent}>
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

      <CustomAddButton onClick={() => setIsShown(true)}>Add new customer</CustomAddButton>
      <FilterPopover
        realTime
        placement="bottomRight"
        content={
          <FilterContent onSubmit={onFilter} listStatus={listStatus} companyList={companyList} />
        }
      >
        <CustomOrangeButton fontSize={14} showDot={isFiltering} />
      </FilterPopover>

      <CustomSearchBox
        onSearch={onSearch}
        placeholder="Search by Company Name, ID, Account Owner"
      />
    </div>
  );

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableContent}>
        <Tabs defaultActiveKey="1" className={styles.tabComponent} tabBarExtraContent={menu}>
          {tabs.map((tab) => (
            <TabPane tab={tab.name} key={tab.id}>
              <Layout className={styles.managementLayout}>
                <Content className="site-layout-background">
                  <TableCustomers
                    listCustomer={listCustomer}
                    loadingCustomer={loadingCustomer}
                    loadingFilter={loadingFilter}
                  />
                </Content>
                <CommonModal
                  visible={isShown}
                  title="Add new customer"
                  onClose={onCloseModal}
                  loading={loadingAdd}
                  content={
                    <ModalAdd
                      listCustomer={listCustomer}
                      isShown={isShown}
                      listStatus={listStatus}
                      handleAddNew={handleAddNew}
                      onCloseModal={onCloseModal}
                    />
                  }
                />
              </Layout>
            </TabPane>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default connect(
  ({
    loading,
    user: { companiesOfUser = [], currentUser: { employee: { _id = '' } = {} } = {} } = {},
    customerManagement: { listCustomer = [], companyList = [], filter = {} } = {},
  }) => ({
    listCustomer,
    companyList,
    companiesOfUser,
    filter,
    _id,
    loadingCustomer: loading.effects['customerManagement/fetchCustomerList'],
    loadingFilter: loading.effects['customerManagement/filterListCustomer'],
    loadingAdd: loading.effects['customerManagement/addNewCustomer'],
  }),
)(TableContainer);
