import React, { Fragment } from 'react';
import {
  Button,
  Col,
  Drawer,
  Empty,
  Form,
  Icon,
  Modal,
  notification,
  Row,
  Table,
  Tooltip,
} from 'antd';
import { connect } from 'dva';
import isEqual from 'lodash/isEqual';
import memoizeOne from 'memoize-one';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import Link from 'umi/link';
import BillDetail from '@/components/BillDetail';
import PriceInput from '@/components/PriceInput';
import AvatarText from '../AvatarText';
import ExpenseFilter from '../ExpenseFilter';
import styles from './index.less';

const moment = extendMoment(Moment);

@connect(({ bill: { list, selectedList, totalAmount }, user: { currentUser } }) => ({
  list,
  selectedList,
  currentUser,
  totalAmount,
}))
@Form.create()
class BillTable extends React.PureComponent {
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
      visibleFilter: false,
      pageSelected: 1,
    };
    this.generateColumn = memoizeOne(this.generateColumn, isEqual);
  }

  componentDidMount() {
    const { dispatch, extraList } = this.props;
    let payload;
    if (Array.isArray(extraList)) payload = { extraBills: extraList };
    dispatch({ type: 'bill/fetchActiveBills', payload });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'bill/save', payload: { list: [], filter: {}, selectedList: [] } });
  }

  onChangePagination = pageNumber => {
    this.setState({
      pageSelected: pageNumber,
    });
  };

  setFirstPage = () => {
    this.setState({
      pageSelected: 1,
    });
  };

  checkSameCur = (expCurrency, selectedList) => {
    if (selectedList.length === 0) return true;
    const { list: listProps } = this.props;
    const [firstId] = selectedList;
    const { currency } = listProps.find(exp => exp._id === firstId);
    if (currency !== expCurrency) {
      notification.warn({
        message: formatMessage({ id: 'noitice', defaultMessage: 'Notice' }),
        description: formatMessage({
          id: 'list.match.currency',
          defaultMessage: 'Please select the expense, that has same currency',
        }),
      });
      return false;
    }
    return true;
  };

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
    if (!selected) {
      list = list.filter(id => id !== bill._id);
    } else if (this.checkSameCur(bill.currency, list)) {
      list.push(bill._id);
    }
    this.triggerChange(list);
  };

  handleChangeTable = (_pagination, _filters, sorter) => {
    this.setState({
      sortedBills: sorter,
    });
  };

  closeBillDetail = () => {
    this.setState({ billDetailVisible: false });
  };

  closeFilter = () => {
    this.setState({ visibleFilter: false });
  };

  showFilter = () => {
    this.setState({ visibleFilter: true });
  };

  onVisibleDetailChange = visible => {
    if (!visible) this.setState({ selectedBill: false });
  };

  handleClickRow = bill => {
    const { onRowClick, showDetail } = this.props;
    if (typeof onRowClick === 'function') onRowClick(bill);
    this.setState({ selectedBill: bill, billDetailVisible: showDetail });
  };

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
      type = bill.mileage ? bill.mileage.type : bill.type.type;
    }
    return type;
  };

  generateColumn(type, sortedBills, currency) {
    const columns = [
      {
        title: 'updatedAt',
        dataIndex: 'date',
        key: 'date',
        sorter: (item, nextItem) => moment.utc(item.date).diff(moment.utc(nextItem.date)),
        sortOrder: sortedBills.columnKey === 'date' && sortedBills.order,
        render: date => moment(date).format('MMM DD YYYY'),
      },
      {
        title: 'type',
        dataIndex: 'type',
        key: 'type',
        render: (_, row) => {
          const render = {
            mileage: ({ mileage }) => (
              <AvatarText src="/assets/img/mileage-ic.png" text={mileage && mileage.type} />
            ),
            'customer-product': () => '',
            default: ({ type: typeRow }) => (
              <AvatarText
                src={typeRow.thumbnailUrl}
                text={!typeRow.parent ? typeRow.type : `${typeRow.parent.type} / ${typeRow.type}`}
              />
            ),
          };
          const fnc = render[row.category] || render.default;
          return fnc(row);
        },
        sorter: (item, nextItem) => {
          const typeExpense = this.getType(item);
          const nextType = this.getType(nextItem);
          return typeExpense.localeCompare(nextType);
        },
        sortOrder: sortedBills.columnKey === 'type' && sortedBills.order,
      },
      {
        title: 'group',
        dataIndex: 'group',
        key: 'group',
        render: text => (text ? text.groupName : formatMessage({ id: 'common.non-tag' })),
        sorter: (item, nextItem) =>
          (item.group ? item.group.groupName : '').localeCompare(
            nextItem.group ? nextItem.group.groupName : ''
          ),
        sortOrder: sortedBills.columnKey === 'group' && sortedBills.order,
      },
      {
        title: 'description',
        dataIndex: 'description',
        key: 'description',
        render: text => (
          <Tooltip placement="top" title={text} trigger="hover">
            <div className={styles.description}>{text}</div>
          </Tooltip>
        ),
      },
      {
        title: 'originAmount',
        dataIndex: 'originAmount',
        key: 'originAmount',
        render: (originAmount, row) => (
          <Tooltip title={<PriceInput value={{ number: row.amount, currency }} />}>
            <div>
              <PriceInput value={{ number: originAmount, currency: row.originCurrency }} />
            </div>
          </Tooltip>
        ),
      },
      {
        title: 'amount',
        dataIndex: 'amount',
        key: 'amount',
        render: (amount, { originCurrency, exchangeRate }) => (
          <Tooltip title={`${originCurrency}/${currency} ${exchangeRate}`}>
            {' '}
            <div>
              <PriceInput value={{ number: amount, currency }} />
            </div>
          </Tooltip>
        ),
      },
      {
        title: 'action',
        key: 'action',
        width: 96,
        render: (_, row) => (
          <div style={{ textAlign: 'center', width: 86 }}>
            <span className={styles.btnView} onClick={() => this.handleClickRow(row)}>
              <Icon type="eye" theme="filled" style={{ fontSize: '22px' }} />
            </span>
            {type !== 'input' && (
              <Fragment>
                <Link className={styles.btnView} to={`expense/${row.category}/${row.id}`}>
                  <Icon type="edit" theme="filled" style={{ fontSize: '22px' }} />
                </Link>
                <span
                  onClick={() => this.showConfirm({ type: 'delete', expenseID: row.id })}
                  className={styles.btnDel}
                >
                  <Icon type="delete" theme="filled" style={{ fontSize: '22px' }} />
                </span>
              </Fragment>
            )}
          </div>
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
      currentUser: {
        location: { currency: defaultCurrency },
      },
      disabled,
      showFilter,
      type,
    } = this.props;
    const {
      billDetailVisible,
      selectedBill,
      selectedList: selectedListID = [],
      visibleFilter,
      sortedBills = {},
      pageSelected,
    } = this.state;
    const pagination = {
      showSizeChanger: false,
      showQuickJumper: false,
      hideOnSinglePage: true,
      pageSize: 5,
      current: pageSelected,
      onChange: this.onChangePagination,
    };

    return (
      <div className={styles.root}>
        {showFilter && (
          <Row type="flex" justify="space-between">
            <Col>
              <span style={{ fontSize: '15px', fontWeight: '300' }}>
                {selectedListID.length}/{list.length} <FormattedMessage id="bill.table.selected" />
              </span>
            </Col>
            <Col>
              <Button className={styles.btnSearch} type="default" onClick={this.showFilter}>
                <FormattedMessage id="bill.table.btn.search" />
                <Icon type="search" />
              </Button>
            </Col>
          </Row>
        )}
        <Table
          bordered={false}
          size="small"
          locale={{
            emptyText: <Empty description={formatMessage({ id: 'bill.table.empty' })} />,
          }}
          rowSelection={{
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
          }}
          columns={this.generateColumn(type, sortedBills, defaultCurrency)}
          dataSource={list}
          pagination={{ ...pagination, total: list.length }}
          rowKey="_id"
          onChange={this.handleChangeTable}
          scroll={{ x: 'max-content' }}
        />
        <Drawer
          width={400}
          visible={billDetailVisible}
          onClose={this.closeBillDetail}
          afterVisibleChange={this.onVisibleDetailChange}
          closable={false}
        >
          <BillDetail bill={selectedBill} {...this.props} />
        </Drawer>
        {showFilter && (
          <Drawer
            title={formatMessage({ id: 'common.filter' })}
            placement="right"
            destroyOnClose
            onClose={this.closeFilter}
            visible={visibleFilter}
            width={500}
            bodyStyle={{ height: '100%' }}
          >
            <ExpenseFilter onSearch={this.closeFilter} setFirstPage={this.setFirstPage} />
          </Drawer>
        )}
      </div>
    );
  }
}

export default BillTable;
