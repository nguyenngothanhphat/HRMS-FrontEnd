import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import { Row, Col, Table, Empty } from 'antd';
import ItemActive from '@/components/ItemActive';
import numeral from 'numeral';
import styles from './index.less';

@connect(({ bill, reimbursement, currency: { list = [] }, user: { currentUser = {} } }) => ({
  reimbursement,
  bill,
  currency: list,
  currentUser,
}))
class Summary extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: 'Category',
      sortedInfo: null,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'bill/fetchListAllActive' });
  }

  selectItem = item => {
    this.setState({ activeItem: item, sortedInfo: null });
  };

  handleChange = (_pagination, _filters, sorter) => {
    this.setState({
      sortedInfo: sorter,
    });
  };

  totalAmount = list => {
    let result = 0;
    list.forEach(item => {
      result += item.amount;
    });
    return result;
  };

  getList = selectedList => {
    const {
      bill: { listAll = [] },
      totalList = [],
    } = this.props;
    const ls = [...listAll, ...totalList];
    if (listAll.length > 0 && selectedList.length > 0) {
      let arr = [];
      selectedList.map(item => {
        arr = [
          ...arr,
          ...ls.filter(nItem => {
            return nItem._id === item;
          }),
        ];
        return arr;
      });
      return arr;
    }
    if (listAll.length <= 0 && selectedList.length > 0) {
      let arr = [];
      selectedList.map(item => {
        arr = [
          ...arr,
          ...ls.filter(nItem => {
            return nItem._id === item;
          }),
        ];
        return arr;
      });
      return arr;
    }
    return [];
  };

  filterCategories = (list, key) => {
    let newList = [];
    const newkey = key.toLowerCase();

    switch (newkey) {
      case 'project':
        list.forEach(item => {
          if (item.project) {
            const index = newList.findIndex(nItem => nItem.name === item.project.name);
            if (index !== -1) {
              newList[index].number += 1;
              newList[index].total += item.amount;
            } else {
              newList = [...newList, { name: item.project.name, number: 1, total: item.amount }];
            }
          }
        });

        break;
      case 'currency':
        list.forEach(item => {
          const index = newList.findIndex(nItem => nItem.name === item.originCurrency);
          if (index !== -1) {
            newList[index].number += 1;
            newList[index].total += item.amount;
          } else {
            newList = [...newList, { name: item.originCurrency, number: 1, total: item.amount }];
          }
        });

        break;
      case 'reimbursable & billable':
        {
          const listReim = list.filter(nItem => nItem.reimbursable === true);
          const listBill = list.filter(nItem => nItem.billable === true);
          const listNonReim = list.filter(nItem => !nItem.reimbursable);
          const reim =
            listReim.length > 0
              ? [
                  {
                    name: 'Reimbursable',
                    number: listReim.length,
                    total: this.totalAmount(listReim),
                  },
                ]
              : [];
          const bill =
            listBill.length > 0
              ? [
                  {
                    name: 'Client Billable',
                    number: listBill.length,
                    total: this.totalAmount(listBill),
                  },
                ]
              : [];
          const nonReim =
            listNonReim.length > 0
              ? [
                  {
                    name: 'Non-Reimbursable',
                    number: listNonReim.length,
                    total: this.totalAmount(listNonReim),
                  },
                ]
              : [];
          newList = [...newList, ...reim, ...bill, ...nonReim];
        }
        // code block
        break;

      default:
        list.forEach(item => {
          const index = newList.findIndex(nItem => {
            return nItem.name === ((item.type && item.type.name) || 'Other');
          });
          if (index !== -1) {
            newList[index].number += 1;
            newList[index].total += item.amount;
          } else {
            newList = [
              ...newList,
              { name: (item.type && item.type.name) || 'Other', number: 1, total: item.amount },
            ];
          }
        });
      // code block
    }
    return newList;
  };

  render() {
    const {
      listExpenses = [],
      currentUser: {
        location: {
          currency: { symbol = '$' },
        },
      },
    } = this.props;
    const { activeItem } = this.state;
    let { sortedInfo } = this.state;
    sortedInfo = sortedInfo || {};
    const expenseList = this.getList(listExpenses);

    const list = ['Category', 'Project', 'Currency', 'Reimbursable & Billable'];

    const columns = [
      {
        title: formatMessage({ id: `report.${activeItem}` }),
        width: 165,
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) => a.name.length - b.name.length,
        sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
      },
      {
        title: formatMessage({ id: 'report.noOfExpenses' }),
        width: 125,
        dataIndex: 'number',
        key: 'number',
        sorter: (a, b) => a.number - b.number,
        sortOrder: sortedInfo.columnKey === 'number' && sortedInfo.order,
      },
      {
        title: formatMessage({ id: 'report.total' }),
        dataIndex: 'total',
        key: 'total',
        sorter: (a, b) => a.total - b.total,
        sortOrder: sortedInfo.columnKey === 'total' && sortedInfo.order,
        render: total => (
          <span>
            {symbol} {numeral(total).format('0,0[.]00')}
          </span>
        ),
      },
    ];

    return (
      <div
        style={{ paddingBottom: '10px', minWidth: '600px' }}
        className={styles.expenseSummary_container}
      >
        <div className={styles.title}>{formatMessage({ id: 'report.summary' })}</div>
        <Row gutter={8}>
          <Col span={7} style={{ paddingRight: '2px' }}>
            <p className={styles.expense}>
              {listExpenses.length || 0} {formatMessage({ id: 'report.expenses' })}
            </p>
            <div className={styles.containerSelect}>
              {list.map((item, index) => (
                <Fragment key={item}>
                  <div key={item} onClick={() => this.selectItem(item)}>
                    <ItemActive item={item} selectedItemId={activeItem} />
                  </div>
                  {list.length - 1 !== index && <div className={styles.line} />}
                </Fragment>
              ))}
            </div>
          </Col>
          <Col span={17} style={{ paddingLeft: '0' }}>
            <Table
              className={styles.tableContainer}
              locale={{
                emptyText: (
                  <Empty
                    style={{ height: '188px' }}
                    description={formatMessage({ id: 'bill.table.empty' })}
                  />
                ),
              }}
              rowKey="name"
              dataSource={this.filterCategories(expenseList, activeItem)}
              columns={columns}
              onChange={this.handleChange}
              pagination={{
                showSizeChanger: false,
                showQuickJumper: false,
                hideOnSinglePage: true,
                pageSize: 5,
                total: list.length,
              }}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default Summary;
