import React, { PureComponent } from 'react';
import { Tabs, Layout, Popover, Button, Input, Select } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import { debounce } from 'lodash';
import styles from './index.less';
import TableCustomers from '../TableCustomers';
import MenuFilter from './components/MenuFilter';
import cancelIcon from '../../../../assets/cancelIcon.svg';
import ModalAdd from './components/ModalAdd';
import { FilterIcon } from './components/FilterIcon';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';

@connect(
  ({
    loading,
    user: { companiesOfUser = [], currentUser: { employee: { _id = '' } = {} } = {} } = {},
    customerManagement: { listCustomer = [] } = {},
  }) => ({
    listCustomer,
    companiesOfUser,
    _id,
    loadingCustomer: loading.effects['customerManagement/fetchCustomerList'],
  }),
)
class TableContainer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tabs: [{ id: 1, name: 'Customers' }],
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
  }

  // submit filter
  handleSubmit = (values) => {
    const { dispatch, companiesOfUser } = this.props;
    const companyID = getCurrentCompany();
    const company = [...companiesOfUser];
    const i = company.find((item) => item._id === companyID);

    dispatch({
      type: 'customerManagement/filterListCustomer',
      payload: {
        status: values.byStatus,
        tenantId: getCurrentTenant(),
        company: getCurrentCompany(),
        companyName: i.name,
      },
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
    const { dispatch, _id } = this.props;
    const {
      customerID,
      status,
      legalName,
      dba,
      phone,
      email,
      addressLine1,
      addressLine2,
      country,
      state,
      city,
      zipCode,
      website,
      tags,
      comments,
    } = values;
    const newTags = tags.map((item) => parseInt(item, 10));
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
        accountOwner: _id || '',
        tagIds: newTags || [],
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

  render() {
    const { Content } = Layout;
    const { TabPane } = Tabs;
    const { listCustomer, loadingCustomer } = this.props;
    const { tabs, visible, isShown } = this.state;

    const listStatus = [
      <Select.Option key="Engaging">Engaging</Select.Option>,
      <Select.Option key="Active">Active</Select.Option>,
      <Select.Option key="Inactive">Inactive</Select.Option>,
      // <Select.Option key="negotiation">Negotiation</Select.Option>,
    ];
    const filter = (
      <>
        <MenuFilter onSubmit={this.handleSubmit} listStatus={listStatus} />
        <div className={styles.btnForm}>
          <Button
            className={styles.btnClose}
            htmlType="reset"
            form="filter"
            onClick={this.handleClose}
          >
            Close
          </Button>
          <Button className={styles.btnApply} form="filter" htmlType="submit" key="submit">
            Apply
          </Button>
        </div>
      </>
    );

    const menu = (
      <div className={styles.tabExtraContent}>
        <div className={styles.buttonAddImport} onClick={this.showModal}>
          <PlusOutlined />
          Add new customer
        </div>
        <Popover
          placement="bottomRight"
          content={filter}
          title={() => (
            <div className={styles.popoverHeader}>
              <p className={styles.headTitle}>Filters</p>
              <p
                className={styles.closeIcon}
                style={{ cursor: 'pointer' }}
                onClick={this.handleClose}
              >
                <img src={cancelIcon} alt="close" />
              </p>
            </div>
          )}
          trigger="click"
          visible={visible}
          onVisibleChange={this.handleVisible}
          overlayClassName={styles.FilterPopover}
        >
          <div className={styles.filterButton}>
            <FilterIcon />
            <p className={styles.textButtonFilter}>Filter</p>
          </div>
        </Popover>
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
                    <TableCustomers listCustomer={listCustomer} loadingCustomer={loadingCustomer} />
                  </Content>
                  <ModalAdd
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
