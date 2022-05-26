import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Layout, Select, Tabs, Tag } from 'antd';
import { debounce } from 'lodash';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { getCurrentTenant } from '@/utils/authority';
import FilterPopover from '@/components/FilterPopover';
import FilterButton from '@/components/FilterButton';
import CustomSearchBox from '@/components/CustomSearchBox';
import TableCustomers from '../TableCustomers';
import MenuFilter from './components/MenuFilter';
import ModalAdd from './components/ModalAdd';
import styles from './index.less';

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
      applied: 0,
      arr: [],
      form: null,
      isFiltering: false,
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

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerManagement/save',
      payload: {
        filter: {},
      },
    });
  }

  // submit filter
  onFilter = async (values) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerManagement/filterListCustomer',
      payload: {
        ...values,
      },
    });
    this.handleFilterCount(values);
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

  clearFilter = () => {
    const { dispatch } = this.props;
    const { form } = this.state;
    dispatch({
      type: 'customerManagement/fetchCustomerList',
    });
    this.setState({
      applied: 0,
      arr: [],
      isFiltering: false,
    });
    form.resetFields();
  };

  handleFilterCount = (values) => {
    const { arr } = this.state;
    const newObj = Object.assign(arr, values);
    const filteredObj = Object.entries(newObj).filter(
      ([key, value]) => value !== undefined && value?.length > 0,
    );
    this.setState({
      applied: Object.keys(filteredObj).length,
      isFiltering: true,
    });
  };

  setForm = (form) => {
    this.setState({
      form,
    });
  };

  onSearch = (value) => {
    // const { value = '' } = e.target;
    // this.handleFilterCount(value);
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
      this.setState({
        isShown: !isShown,
      });
    });
  };

  addZeroToNumber = (number) => {
    if (number < 10 && number >= 0) return `0${number}`.slice(-2);
    return number;
  };

  showDot = (obj) => {
    return !Object.values(obj).every((o) => {
      if (Array.isArray(o)) {
        return o.length === 0;
      }
      if (!o) return true;
      return false;
    });
  };

  render() {
    const { Content } = Layout;

    const { TabPane } = Tabs;
    const { listCustomer, loadingCustomer, companyList = [], loadingFilter = false } = this.props;
    const { isShown, applied, isFiltering } = this.state;

    const tabs = [{ id: 1, name: `Customers (${this.addZeroToNumber(listCustomer.length)})` }];
    const listStatus = [
      <Select.Option key="Engaging">Engaging</Select.Option>,
      <Select.Option key="Active">Active</Select.Option>,
      <Select.Option key="Inactive">Inactive</Select.Option>,
    ];

    const menu = (
      <div className={styles.tabExtraContent}>
        {applied > 0 && (
          <Tag
            className={styles.tagCountFilter}
            closable
            closeIcon={<CloseOutlined />}
            onClose={() => {
              this.clearFilter();
            }}
          >
            {applied} applied
          </Tag>
        )}
        <div className={styles.buttonAddImport} onClick={this.showModal}>
          <PlusOutlined />
          Add new customer
        </div>
        <FilterPopover
          realTime
          placement="bottomRight"
          content={
            <MenuFilter
              onSubmit={this.onFilter}
              listStatus={listStatus}
              companyList={companyList}
              onSearch={this.onSearch}
              setForm={this.setForm}
            />
          }
        >
          <FilterButton fontSize={14} showDot={isFiltering} />
        </FilterPopover>

        <CustomSearchBox
          onSearch={(e) => this.onSearchDebounce(e.target.value)}
          placeholder="Search by Company Name, ID, Account Owner"
        />
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
