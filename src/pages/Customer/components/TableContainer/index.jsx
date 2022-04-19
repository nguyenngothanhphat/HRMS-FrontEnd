import React, { PureComponent } from 'react';
import { Tabs, Layout, Input, Select } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import { debounce } from 'lodash';
import styles from './index.less';
import TableCustomers from '../TableCustomers';
import MenuFilter from './components/MenuFilter';
import ModalAdd from './components/ModalAdd';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import FilterPopover from '@/components/FilterPopover';
import FilterButton from '@/components/FilterButton';

@connect(
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
  }),
)
class TableContainer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      isShown: false,
    };
    this.refForm = React.createRef();
    this.onSearchDebounce = debounce(this.onSearchDebounce, 500);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerManagement/fetchCustomerList',
    });
    dispatch({
      type: 'customerManagement/fetchCompanyList',
    });
  }

  // submit filter
  handleSubmit = async (values) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'customerManagement/filterListCustomer',
      payload: {
        status: values.byStatus,
        tenantId: getCurrentTenant(),
        company: getCurrentCompany(),
        // companyName: i.name,
      },
    });
    dispatch({
      type: 'customerManagement/save',
      payload: { filter: values },
    });
  };

  // close popover
  handleClose = () => {
    const { visible } = this.state;
    this.setState({
      visible: !visible,
    });
  };

  // show popover
  handleVisible = () => {
    const { visible } = this.state;
    this.setState({
      visible: !visible,
    });
  };

  // show modal
  showModal = () => {
    const { isShown } = this.state;
    this.setState({
      isShown: !isShown,
    });
  };

  // cancel and reset fill in modal
  onCloseModal = () => {
    const { isShown } = this.state;
    this.setState({
      isShown: !isShown,
    });
  };

  onSearch = (e = {}) => {
    const { value = '' } = e.target;
    this.onSearchDebounce(value);
  };

  onSearchDebounce = (value) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerManagement/fetchCustomerList',
      payload: {
        searchKey: value,
      },
    });
  };

  // add new Customer
  handleAddNew = (values, countryName) => {
    const { dispatch } = this.props;
    const {
      customerID,
      status,
      legalName,
      dba,
      phone,
      email,
      addressLine1,
      addressLine2,
      // country,
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
      const { isShown } = this.state;
      // form.resetFields();
      this.setState({
        isShown: !isShown,
      });
    });
  };

  addZeroToNumber = (number) => {
    if (number < 10 && number >= 0) return `0${number}`.slice(-2);
    return number;
  };

  showDot = (obj) => !Object.values(obj).every((x) => !x);

  render() {
    const { Content } = Layout;
    const { TabPane } = Tabs;
    const {
      listCustomer,
      loadingCustomer,
      companyList = [],
      filter = {},
      loadingFilter = false,
    } = this.props;
    const { isShown } = this.state;
    const tabs = [{ id: 1, name: `Customers (${this.addZeroToNumber(listCustomer.length)})` }];

    const listStatus = [
      <Select.Option key="Engaging">Engaging</Select.Option>,
      <Select.Option key="Active">Active</Select.Option>,
      <Select.Option key="Inactive">Inactive</Select.Option>,
      // <Select.Option key="negotiation">Negotiation</Select.Option>,
    ];
    const contentFilter = (
      <>
        <MenuFilter
          onSubmit={this.handleSubmit}
          listStatus={listStatus}
          companyList={companyList}
        />
      </>
    );

    const menu = (
      <div className={styles.tabExtraContent}>
        <div className={styles.buttonAddImport} onClick={this.showModal}>
          <PlusOutlined />
          Add new customer
        </div>
        <FilterPopover realTime placement="bottomRight" content={contentFilter}>
          <FilterButton fontSize={14} showDot={this.showDot(filter)} />
        </FilterPopover>
        <div className={styles.searchInp}>
          <Input
            placeholder="Search by Company Name, ID, Account Owner"
            prefix={<SearchOutlined />}
            onChange={(e) => this.onSearch(e)}
          />
        </div>
      </div>
    );

    return (
      <div className={styles.tableContainer}>
        <div className={styles.tableContent}>
          <Tabs
            defaultActiveKey="1"
            className={styles.tabComponent}
            onTabClick={this.handleClickTabPane}
            tabBarExtraContent={menu}
          >
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
                  <ModalAdd
                    listCustomer={listCustomer}
                    isShown={isShown}
                    listStatus={listStatus}
                    handleAddNew={this.handleAddNew}
                    onCloseModal={this.onCloseModal}
                  />
                  {/* <TabFilter /> */}
                </Layout>
              </TabPane>
            ))}
          </Tabs>
        </div>
      </div>
    );
  }
}

export default TableContainer;
