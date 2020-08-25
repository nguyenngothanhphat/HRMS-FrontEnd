import React from 'react';
import {
  Button,
  Empty,
  Modal,
  // notification,
  Table,
  Tooltip,
  Drawer,
} from 'antd';
import isEqual from 'lodash/isEqual';
import memoizeOne from 'memoize-one';
import Moment from 'moment';
import { connect } from 'dva';
import { extendMoment } from 'moment-range';
import { formatMessage } from 'umi-plugin-react/locale';
import windowSize from 'react-window-size';
// import Link from 'umi/link';
import PriceInput from '@/components/PriceInput';
import BillDetail from '@/components/BillDetail';
// import AvatarText from '@/components/AvatarText';
import styles from './index.less';

const moment = extendMoment(Moment);

@connect(({ loading, bill }) => ({
  loadingBill: loading.effects['bill/fetchActiveBills'],
  bill,
}))
class ExpenseTable extends React.PureComponent {
  static getDerivedStateFromProps(nextProps) {
    if ('selectedList' in nextProps) {
      const { selectedList } = nextProps;
      return { selectedList };
    }
    return null;
  }

  constructor(props) {
    super(props);
    const { extraList: selectedList = [] } = props;
    this.state = {
      selectedList,
      expenseDetailVisible: false,
      expense: {},
    };
    this.generateColumn = memoizeOne(this.generateColumn, isEqual);
  }

  processData = values => {
    // const { filterYear } = this.props;
    const {
      date: [gteDate, lteDate] = [],
      amount: [gteAmount, lteAmount] = [],
      type = [],
      tag = [],
      project = [],
      paymentOption = [],
      reimbursable = false,
      billable = false,
    } = values;

    return {
      ...(gteDate || lteDate
        ? {
            updatedAt: {
              ...(gteDate
                ? {
                    $gte: gteDate
                      .zone('+00:00')
                      .startOf('day')
                      .toISOString(),
                  }
                : {}),
              ...(lteDate
                ? {
                    $lte: lteDate
                      .zone('+00:00')
                      .endOf('day')
                      .toISOString(),
                  }
                : {}),
            },
          }
        : {}),
      ...(gteAmount || lteAmount
        ? {
            amount: {
              ...(gteAmount ? { $gte: parseInt(gteAmount, 10) } : {}),
              ...(lteAmount ? { $lte: parseInt(lteAmount, 10) } : {}),
            },
          }
        : {}),
      ...(type.length > 0 ? { type: { $in: type } } : {}),
      ...(tag.length > 0 ? { tag: { $in: tag } } : {}),
      ...(project.length > 0 ? { project: { $in: project } } : {}),
      ...(paymentOption.length > 0 ? { paymentOption: { $in: paymentOption } } : {}),
      ...(reimbursable ? { reimbursable: { $eq: reimbursable } } : {}),
      ...(billable ? { billable: { $eq: billable } } : {}),
      // year: filterYear,
    };
  };

  onChangePagination = (page, pageSize) => {
    const { dispatch, bill: { filterTab = '', filter = {} } = {} } = this.props;
    dispatch({
      type: 'bill/save',
      payload: {
        filter: {
          ...filter,
          page,
          limit: pageSize,
        },
      },
    });
    dispatch({
      type: 'bill/fetchActiveBills',
      payload: {
        options: {
          ...this.processData(filter),
          ...(filterTab === 'client-billable' ? { billable: { $eq: true } } : {}),
          ...(filterTab === 'reimbursable' ? { reimbursable: { $eq: true } } : {}),
          ...(filterTab === 'company-cash' ? { paymentOption: { $in: ['company cash'] } } : {}),
          ...(filterTab === 'company-cc'
            ? { paymentOption: { $in: ['company credit card'] } }
            : {}),
          page,
          limit: pageSize,
        },
      },
    });
  };

  onChangePageSize = (current, size) => {
    const { dispatch, bill: { filterTab = '', filter = {} } = {} } = this.props;
    dispatch({
      type: 'bill/save',
      payload: {
        filter: {
          ...filter,
          page: current,
          limit: size,
        },
      },
    });
    dispatch({
      type: 'bill/fetchActiveBills',
      payload: {
        options: {
          ...this.processData(filter),
          ...(filterTab === 'client-billable' ? { billable: { $eq: true } } : {}),
          ...(filterTab === 'reimbursable' ? { reimbursable: { $eq: true } } : {}),
          ...(filterTab === 'company-cash' ? { paymentOption: { $in: ['company cash'] } } : {}),
          ...(filterTab === 'company-cc'
            ? { paymentOption: { $in: ['company credit card'] } }
            : {}),
          page: current,
          limit: size,
        },
      },
    });
  };

  setFirstPage = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'bill/save',
      payload: {
        filter: {
          page: 1,
        },
      },
    });
  };

  componentDidMount = () => {
    const { dispatch, selectedList = [] } = this.props;
    if (selectedList.length > 0) {
      dispatch({ type: 'bill/saveSelectedList', payload: { selectedList } });
    }
  };

  // checkSameCur = (expCurrency, selectedList) => {
  //   if (selectedList.length === 0) return true;
  //   const { list: listProps } = this.props;
  //   const [firstId] = selectedList;
  //   const { currency } = listProps.find(exp => exp._id === firstId);
  //   if (currency !== expCurrency) {
  //     notification.warn({
  //       message: formatMessage({ id: 'noitice', defaultMessage: 'Notice' }),
  //       description: formatMessage({
  //         id: 'list.match.currency',
  //         defaultMessage: 'Please select the expense, that has same currency',
  //       }),
  //     });
  //     return false;
  //   }
  //   return true;
  // };

  triggerChange = selectedList => {
    // Should provide an event to pass value to Form.
    const { onSelect, dispatch } = this.props;
    if (typeof onSelect === 'function') {
      onSelect(selectedList);
    }
    dispatch({ type: 'bill/saveSelectedList', payload: { selectedList } });
  };

  select = (bill, selected) => {
    const { selectedList } = this.state;
    let list = [...selectedList];
    if (selected) {
      list.push(bill._id);
    } else {
      list = list.filter(id => id !== bill._id);
    }
    // else if (this.checkSameCur(bill.currency, list)) {
    //   list.push(bill._id);
    // }
    this.triggerChange(list);
  };

  handleChangeTable = (_pagination, _filters, sorter) => {
    this.setState({
      sortedBills: sorter,
    });
  };

  // handleClickRow = bill => {
  //   const { onRowClick, showDetail } = this.props;
  //   if (typeof onRowClick === 'function') onRowClick(bill);
  //   this.setState({ selectedBill: bill, billDetailVisible: showDetail });
  // };

  closeExpenseDetail = () => {
    this.setState({ expenseDetailVisible: false });
  };

  handleReview = expense => {
    this.setState({ expense, expenseDetailVisible: true });
  };

  // handleReview = bill => {
  //   const { dispatch } = this.props;
  //   dispatch({ type: 'bill/save', payload: { item: bill } });
  // };

  showConfirm = ({ type, expenseID }) => {
    const { dispatch } = this.props;
    const action = {
      delete: {
        title: formatMessage({ id: 'expense.delete.confirm' }),
        onOk() {
          dispatch({ type: 'bill/deleteBill', payload: { expenseID } });
        },
      },
    };

    Modal.confirm({
      ...action[type],
    });
  };

  getType = bill => {
    let type = '';
    if (bill.category !== 'customer-product') {
      type = bill.mileage ? bill.mileage.type : bill.type.name;
    }
    return type;
  };

  generateColumn(type, sortedBills) {
    const columns = [
      {
        className: styles.spentColumn,
        title: 'spent',
        dataIndex: 'date',
        key: 'date',
        width: 135,
        render: date => moment(date).format('MMM D, YYYY'),
        sortOrder: sortedBills.columnKey === 'date' && sortedBills.order,
        sorter: (item, nextItem) => moment.utc(item.date).diff(moment.utc(nextItem.date)),
      },
      {
        title: 'purpose',
        dataIndex: 'description',
        key: 'description',
        width: 150,
        render: description => (
          <Tooltip placement="topLeft" title={description || ''}>
            <div className={styles.description}>{description || ''}</div>
          </Tooltip>
        ),
        sortOrder: sortedBills.columnKey === 'description' && sortedBills.order,
        sorter: (item, nextItem) => item.localeCompare(nextItem),
      },
      {
        title: 'tags',
        dataIndex: 'tag',
        key: 'tag',
        render: tag => (tag ? tag.groupName : formatMessage({ id: 'common.non-tag' })),
        sorter: (item, nextItem) =>
          (item.tag ? item.tag.groupName : '').localeCompare(
            nextItem.tag ? nextItem.tag.groupName : ''
          ),
        sortOrder: sortedBills.columnKey === 'tag' && sortedBills.order,
      },
      {
        title: 'project',
        dataIndex: 'project',
        key: 'project',
        render: project => (project ? project.name : ''),
        sorter: (item, nextItem) => {
          const { project: { name: project = '' } = {} } = item;
          const { project: { name: nextProject = '' } = {} } = nextItem;
          return project.localeCompare(nextProject);
        },
        sortOrder: sortedBills.columnKey === 'project' && sortedBills.order,
      },
      {
        title: 'category',
        dataIndex: 'type',
        key: 'type',
        render: purpose => (purpose ? purpose.name : ''),
        sorter: (item, nextItem) => {
          const typeExpense = this.getType(item);
          const nextType = this.getType(nextItem);
          return typeExpense.localeCompare(nextType);
        },
        sortOrder: sortedBills.columnKey === 'type' && sortedBills.order,
      },
      {
        title: 'original',
        dataIndex: 'originAmount',
        key: 'originAmount',
        render: (originAmount, row) => (
          // <Tooltip title={`${originCurrency}/${currency} ${exchangeRate}`}>
          //   {' '}
          //   <div>
          //     <PriceInput value={{ number: originAmount, originCurrency }} />
          //   </div>
          // </Tooltip>
          <PriceInput value={{ number: originAmount, currency: row.originCurrency }} />
        ),
        sorter: (item, nextItem) => item.originAmount - nextItem.originAmount,
        sortOrder: sortedBills.columnKey === 'originAmount' && sortedBills.order,
      },
      {
        title: 'amount',
        dataIndex: 'amount',
        key: 'amount',
        render: (amount, row) => (
          // <Tooltip title={`${originCurrency}/${currency} ${exchangeRate}`}>
          //   {' '}
          //   <div>
          //     <PriceInput value={{ number: amount, currency: row.currency }} />
          //   </div>
          // </Tooltip>
          <PriceInput value={{ number: amount, currency: row.currency }} />
        ),
        sorter: (item, nextItem) => item.amount - nextItem.amount,
        sortOrder: sortedBills.columnKey === 'amount' && sortedBills.order,
      },
      {
        title: 'action',
        key: 'action',
        width: 130,
        align: 'center',
        render: (_, row) => (
          <Button className={styles.reviewBtn} onClick={() => this.handleReview(row)}>
            {formatMessage({ id: 'bill.review' })}
          </Button>
        ),
      },
    ];

    return columns.map(col => ({
      ...col,
      title: formatMessage({ id: `bill.table.${col.title}` }),
    }));
  }

  render() {
    const {
      list = [],
      disabled,
      type,
      rowSelection: rowSelectionProps,
      pagination: paginationProps,
      loadingBill,
      windowWidth,
      isExpBtnDisabled = false,
      bill: { total = 1, filter: { page = 1 } = {} } = {},
    } = this.props;

    const {
      selectedList: selectedListID = [],
      sortedBills = {},
      expenseDetailVisible,
      expense,
    } = this.state;

    const pagination = {
      showSizeChanger: true,
      showQuickJumper: true,
      // hideOnSinglePage: true,
      // pageSize: 10,
      current: page,
      onChange: this.onChangePagination,
      onShowSizeChange: this.onChangePageSize,
      total,
    };

    const rowSelection = {
      hideDefaultSelections: true,
      onSelect: this.select,
      selectedRowKeys: selectedListID,
      getCheckboxProps: () => ({
        disabled,
      }),
      onSelectAll: (selected, rowsOnPage, changeRows) => {
        let sId = [...selectedListID];
        if (selected) {
          let isChanged = false;
          rowsOnPage.forEach(row => {
            if (!sId.includes(row._id)) {
              isChanged = true;
              sId.push(row._id);
            }
          });
          if (!isChanged) sId = [];
        } else {
          changeRows.forEach(row => {
            sId = sId.filter(id => id !== row._id);
          });
        }
        this.triggerChange(sId || []);
      },
      selections: [
        {
          key: 'all-data',
          text: 'Select All',
          onSelect: () => {
            this.triggerChange(list.map(item => item._id) || []);
          },
        },
        {
          key: 'no-data',
          text: 'Unselect All',
          onSelect: () => {
            this.triggerChange([]);
          },
        },
      ],
    };

    return (
      <div className={styles.root}>
        <Table
          bordered={false}
          size="small"
          locale={{
            emptyText: <Empty description={formatMessage({ id: 'bill.table.empty' })} />,
          }}
          rowSelection={rowSelectionProps === null ? null : rowSelection}
          columns={this.generateColumn(type, sortedBills)}
          dataSource={list}
          pagination={paginationProps === false ? false : pagination}
          rowKey="_id"
          onChange={this.handleChangeTable}
          scroll={{ x: 'max-content' }}
          loading={loadingBill}
        />
        <Drawer
          className={styles.reviewExpenseDrawer}
          title={
            <span className={styles.reviewExpenseRrawerTitle}>
              {formatMessage({ id: 'bill.receipt-photos' })}
            </span>
          }
          visible={expenseDetailVisible}
          onClose={this.closeExpenseDetail}
          width={windowWidth <= 400 ? 'auto' : 400}
          headerStyle={{ padding: '20px 35px 0 25px', border: 'none' }}
          bodyStyle={{ borderRadius: 4, padding: '9px 25px 0 25px' }}
          destroyOnClose
        >
          <BillDetail
            bill={expense}
            closeExpenseDetail={this.closeExpenseDetail}
            isExpBtnDisabled={isExpBtnDisabled}
          />
        </Drawer>
      </div>
    );
  }
}

export default windowSize(ExpenseTable);
