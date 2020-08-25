import React, { Component } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import { Row, Col, Icon, Button, Menu, Dropdown, Drawer, Modal, Statistic, Select } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import windowSize from 'react-window-size';
import moment from 'moment';
import router from 'umi/router';
// import BillDetail from '@/components/BillDetail';
import ExpenseFilter from '@/components/ExpenseFilter';
import ExpenseTable from '@/components/ExpenseTable';
import { ReactComponent as DeleteIcon } from '@/assets/svg/delete.svg';
// import { ReactComponent as ExportIcon } from '@/assets/svg/export.svg';
import { ReactComponent as FilterIcon } from '@/assets/svg/filter.svg';
import { ReactComponent as FilterFillIcon } from '@/assets/svg/filter_fill.svg';
import { ReactComponent as ForwardIcon } from '@/assets/svg/forward.svg';
import styles from './style.less';
// import ExportExcel from './components/ExportExcel';

const { Option } = Select;

@connect(
  ({
    bill: { selectedList = [], list = [], summary } = {},
    bill = {},
    user,
    loading,
    currency,
  }) => ({
    selectedList,
    list,
    summary,
    user,
    bill,
    loadingBill: loading.effects['bill/fetchActiveBills'],
    currency,
  })
)
class Bill extends Component {
  constructor(props) {
    super(props);
    const d = new Date();
    this.state = {
      // eslint-disable-next-line react/no-unused-state
      year: moment(d).year(),
      visibleFilter: false,
      visibleDelete: false,
    };
  }

  componentDidMount() {
    const {
      dispatch,
      user: { currentUser: { location: { _id: locationId = '' } = {} } = {} } = {},
      bill: { filterYear, filter: { limit = 10, page = 1 } = {} } = {},
    } = this.props;
    dispatch({
      type: 'bill/fetchSummary',
      payload: { year: filterYear },
    });
    dispatch({
      type: 'bill/fetchActiveBills',
      payload: {
        options: {
          year: moment().year(),
          limit,
          page,
        },
      },
    });
    dispatch({
      type: 'bill/save',
      payload: {
        year: moment().year(),
        filterTab: 'unreported',
      },
    });
    dispatch({ type: 'project/fetch', payload: { location: locationId } });
    if (locationId) {
      dispatch({
        type: 'appSetting/fetchByLocation',
        payload: { location: locationId },
      });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'bill/save', payload: { list: [], selectedList: [], item: {}, filter: {} } });
  }

  closeFilter = () => {
    this.setState({ visibleFilter: false });
  };

  openFilter = () => {
    const { bill: { filterTab } = {} } = this.props;
    if (['unreported'].indexOf(filterTab) > -1) {
      this.setState({ visibleFilter: true });
    }
  };

  closeDelete = () => {
    this.setState({ visibleDelete: false });
  };

  openDelete = () => {
    const { selectedList } = this.props;
    if (selectedList.length > 0) {
      this.setState({ visibleDelete: true });
    }
  };

  handleDelete = () => {
    const { dispatch, selectedList } = this.props;
    dispatch({ type: 'bill/deleteBill', payload: { ids: selectedList } });
    this.closeDelete();
  };

  handleAddToReport = () => {
    const { selectedList } = this.props;
    if (selectedList.length > 0) {
      router.push('/report/new');
    }
  };

  getSelectedList = (selectedList, list) => {
    const temp = list.filter(item => selectedList.indexOf(item._id) > -1);
    return temp;
  };

  // menu = currentSelectedList => {
  //   return (
  //     <Menu>
  //       <Menu.Item key="excel">
  //         <ExportExcel data={currentSelectedList} />
  //       </Menu.Item>
  //     </Menu>
  //   );
  // };

  addMenu = () => {
    return (
      <Menu className={styles.addMenuStyle}>
        <div className={styles.menuMainTitle}>Add</div>
        <div className={styles.divider} />
        <Menu.Item key="expense">
          <Link to="/expense/newexpense">
            <Row type="flex" justify="space-between">
              <Row>
                <div className={styles.menuTitle}>Add Expense</div>

                <div className={styles.menuSubTitle}>Input details manually</div>
              </Row>
              <Row>
                <Icon type="right" />
              </Row>
            </Row>
          </Link>
        </Menu.Item>
        <Menu.Item key="mileage">
          <Link to="/expense/newmileage">
            <Row type="flex" justify="space-between">
              <Row>
                <div className={styles.menuTitle}>Create Mileage</div>
                <div className={styles.menuSubTitle}>For your daily travels</div>
              </Row>
              <Row>
                <Icon type="right" />
              </Row>
            </Row>
          </Link>
        </Menu.Item>
      </Menu>
    );
  };

  formatNumber = num => {
    if (num > 1000000000) {
      const billion = num / 1000000000;
      return { precision: 3, suffix: 'B', value: billion };
    }
    if (num > 1000000) {
      const million = num / 1000000;
      return { precision: 3, suffix: 'M', value: million };
    }
    return { precision: 2, suffix: '', value: num };
  };

  getPrefix = () => {
    const {
      currency: { list: listCurrency = [] } = {},
      user: {
        currentUser: { location: { currency: { _id: userCurrency = '' } = {} } = {} } = {},
      } = {},
    } = this.props;
    const currentCurrency = listCurrency.find(item => item._id === userCurrency) || {};
    return currentCurrency.symbol || '';
  };

  render() {
    const {
      selectedList,
      list,
      summary: {
        reimbursable = {},
        billable = {},
        unReport = {},
        companyCash = {},
        companyCC = {},
      } = {},
      bill,
      windowWidth,
    } = this.props;
    const {
      filter: {
        date = [],
        amount = [],
        type = [],
        tag = [],
        project = [],
        paymentOption = [],
        reimbursable: filterReimbursable = false,
        billable: filterBillable = false,
        limit = 10,
      } = {},
      filter = {},
      // filterYear,
      filterTab = 'unreported',
    } = bill;

    const isFiltering =
      date.length > 0 ||
      amount.length > 0 ||
      type.length > 0 ||
      tag.length > 0 ||
      project.length > 0 ||
      paymentOption.length > 0 ||
      filterReimbursable ||
      filterBillable;

    const { visibleFilter, visibleDelete, year } = this.state;
    // const currentSelectedList = this.getSelectedList(tempBillList, list);

    const summaryMenu = [
      {
        key: 'unreported',
        amount: unReport.amount || 0,
        count: unReport.count || 0,
      },
      {
        key: 'client-billable',
        amount: billable.amount || 0,
        count: billable.count || 0,
      },
      {
        key: 'reimbursable',
        amount: reimbursable.amount || 0,
        count: reimbursable.count || 0,
      },
      {
        key: 'company-cash',
        amount: companyCash.amount || 0,
        count: companyCash.count || 0,
      },
      {
        key: 'company-cc',
        amount: companyCC.amount || 0,
        count: companyCC.count || 0,
      },
    ];

    const actionBtn = [
      {
        icon: (
          <>
            {isFiltering ? (
              <FilterFillIcon className={styles.iconPrimary} onClick={this.openFilter} />
            ) : (
              <FilterIcon
                className={`${styles.iconBlack} ${
                  ['client-billable', 'reimbursable', 'company-cash', 'company-cc'].indexOf(
                    filterTab
                  ) > -1
                    ? styles.disabled
                    : ''
                }`}
                onClick={this.openFilter}
              />
            )}
          </>
        ),
        key: 'filterBtn',
      },
      {
        icon: (
          <DeleteIcon
            style={{ fill: 'black', width: 18.48 }}
            className={`${selectedList.length === 0 ? styles.disabled : ''}`}
            onClick={this.openDelete}
          />
        ),
        key: 'deleteBtn',
      },
      // {
      //   icon: (
      //     <Dropdown overlay={this.menu(currentSelectedList)}>
      //       <ExportIcon style={{ fill: 'black', width: 18 }} />
      //     </Dropdown>
      //   ),
      // },
      {
        icon: (
          <ForwardIcon
            style={{ fill: 'black', width: 19 }}
            className={`${selectedList.length === 0 ? styles.disabled : ''}`}
            onClick={this.handleAddToReport}
          />
        ),
        key: 'forwardBtn',
      },
    ];

    const onYearFilterChange = value => {
      const { dispatch } = this.props;
      dispatch({
        type: 'bill/fetchSummary',
        payload: { year: value },
      });
      dispatch({
        type: 'bill/fetchActiveBills',
        payload: {
          options: {
            year: value,
          },
        },
      });
      dispatch({
        type: 'bill/save',
        payload: {
          filterYear: value,
          filterTab: 'unreported',
          filter: {},
        },
      });
    };

    return (
      <div className={styles.root}>
        <Row type="flex" justify="space-between">
          <div className={styles.title}>
            <span>{formatMessage({ id: 'bill.form.basic' })}</span>
          </div>
          <Row type="flex">
            <Select
              className={styles.selectYear}
              size="large"
              placeholder={formatMessage({ id: 'bill.year.placeholder' })}
              defaultValue={`FY ${year.toString()}`}
              onChange={value => onYearFilterChange(value)}
            >
              <Option value={year}>{`FY ${year}`}</Option>
              <Option value={year - 1}>{`FY ${year - 1}`}</Option>
              <Option value={year - 2}>{`FY ${year - 2}`}</Option>
            </Select>
            <Dropdown overlay={this.addMenu} overlayStyle={{ width: 397 }} trigger={['click']}>
              <Button className={styles.addBtn} type="primary">
                <Icon style={{ fontSize: 12 }} type="plus" />
                {formatMessage({ id: 'common.add' })}
              </Button>
            </Dropdown>
          </Row>
        </Row>

        <Row>
          <Row type="flex" justify="start">
            <Col>
              <span style={{ fontSize: '15px', fontWeight: '300' }}>
                {`${selectedList.length} ${formatMessage({ id: 'bill.table.selected' })}`}
              </span>
            </Col>
          </Row>
        </Row>

        <Row type="flex" justify="space-between" className={styles.menuArea}>
          <Menu
            onClick={this.handleClick}
            selectedKeys={[filterTab]}
            mode="horizontal"
            style={{ backgroundColor: '#eff2fa', width: '61%' }}
            onSelect={({ key }) => {
              const { dispatch } = this.props;
              dispatch({
                type: 'bill/save',
                payload: {
                  filterTab: key,
                  ...(['client-billable', 'reimbursable', 'company-cash', 'company-cc'].indexOf(
                    key
                  ) > -1
                    ? { filter: { page: 1, limit } }
                    : {}),
                  ...(key === 'unreported'
                    ? {
                        filter: {
                          ...filter,
                          page: 1,
                          limit,
                        },
                      }
                    : {}),
                },
              });
              let options = {};
              switch (key) {
                case 'client-billable':
                  options = {
                    billable: { $eq: true },
                    limit,
                  };
                  break;
                case 'reimbursable':
                  options = {
                    reimbursable: { $eq: true },
                    limit,
                  };
                  break;
                case 'company-cash':
                  options = {
                    paymentOption: { $in: ['company cash'] },
                    limit,
                  };
                  break;
                case 'company-cc':
                  options = {
                    paymentOption: { $in: ['company credit card'] },
                    limit,
                  };
                  break;
                default:
                  options = {
                    limit,
                  };
                  break;
              }
              dispatch({
                type: 'bill/fetchActiveBills',
                payload: {
                  options: {
                    ...options,
                    page: 1,
                  },
                },
              });
            }}
            overflowedIndicator={null}
          >
            {summaryMenu.map(item => {
              return (
                <Menu.Item key={item.key}>
                  <div className={styles.summary}>
                    <Statistic
                      value={this.formatNumber(item.amount).value}
                      prefix={this.getPrefix()}
                      suffix={this.formatNumber(item.amount).suffix}
                      precision={this.formatNumber(item.amount).precision}
                    />
                    <div className={styles.summaryCount}>
                      {`${formatMessage({
                        id: `bill.${item.key}`,
                      })} (${item.count})`}
                    </div>
                  </div>
                </Menu.Item>
              );
            })}
          </Menu>
          <div className={styles.actionBtn}>
            {actionBtn.map(item => {
              return (
                <span key={item.key} className={styles.btn}>
                  {item.icon}
                </span>
              );
            })}
          </div>
        </Row>
        <ExpenseTable selectedList={selectedList} list={list} />
        {/* Filter Drawer */}
        <Drawer
          className={styles.filterDrawer}
          title={
            <span className={styles.filterDrawerTitle}>
              {formatMessage({ id: 'common.filter' })}
            </span>
          }
          placement="right"
          destroyOnClose
          visible={visibleFilter}
          onClose={this.closeFilter}
          width={windowWidth <= 450 ? 'auto' : 450}
          headerStyle={{ padding: '41px 24px 0 49px', border: 'none' }}
          bodyStyle={{ borderRadius: 4, padding: '26px 50px 28px 50px' }}
        >
          <ExpenseFilter closeFilter={this.closeFilter} setFirstPage={this.setFirstPage} />
        </Drawer>
        {/* Delete Modal */}
        <Modal
          className={styles.deleteModal}
          visible={visibleDelete}
          onOk={this.handleDelete}
          onCancel={this.closeDelete}
          cancelText={formatMessage({ id: 'bill.cancel' })}
          okText={formatMessage({ id: 'bill.delete' })}
          closable={false}
        >
          <div className={styles.deleteTitle}>
            {`${formatMessage({
              id: 'bill.delete-expense',
            })}?`}
          </div>
          <div>{formatMessage({ id: 'bill.delete.line1' })}</div>
          <div className={styles.countDelete}>
            {`${formatMessage({ id: 'bill.delete.line2' })} ${selectedList.length} ${formatMessage(
              {
                id: 'bill.expense',
              },
              { expense: selectedList.length }
            )}.`}
          </div>
          <div>{`${formatMessage({ id: 'bill.delete.line3' })}?`}</div>
        </Modal>
      </div>
    );
  }
}

export default windowSize(Bill);
