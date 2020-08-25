import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Table, Avatar, Empty, Icon, Popover, Row, Col, Drawer, Tooltip } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import PriceInput from '@/components/PriceInput';
import BillDetail from '@/components/BillDetail';
import styles from './index.less';
import BillForm from '../BillForm';

@connect(({ bill, loading, type }) => ({ bill, loading: loading.models.bill, type }))
class ExpenseTable extends React.PureComponent {
  static propTypes = {
    list: PropTypes.arrayOf(PropTypes.object),
    pagination: PropTypes.shape({
      showSizeChanger: PropTypes.bool,
      showQuickJumper: PropTypes.bool,
      hideOnSinglePage: PropTypes.bool,
      pageSize: PropTypes.number,
      total: PropTypes.number,
    }),
  };

  static defaultProps = {
    list: [],
    pagination: {
      showSizeChanger: false,
      showQuickJumper: false,
      hideOnSinglePage: true,
      pageSize: 5,
      total: 0,
    },
  };

  static getDerivedStateFromProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      return {
        ...({ selectedList: nextProps.value } || {}),
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    const { pagination, list = [] } = props;
    this.state = {
      pagination: { ...pagination, size: list.length },
      billEditVisible: false,
      data: { params: { action: '', type: 'expense' } },
      billDetailVisible: false,
      expenseSelect: {},
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'type/fetch' });
  }

  onClose = () => {
    this.setState({
      billEditVisible: false,
    });
  };

  showDrawer = billId => {
    this.setState({
      data: { params: { action: billId, type: 'expense' } },
      billEditVisible: true,
    });
  };

  showDrawerDetail = bill => {
    this.setState({
      billDetailVisible: true,
      expenseSelect: bill,
    });
  };

  onCloseDetail = () => {
    this.setState({
      billDetailVisible: false,
    });
  };

  render() {
    const { list, titleTable, matchPage, isMatch, loading } = this.props;
    const { pagination, billEditVisible, data, billDetailVisible, expenseSelect } = this.state;
    const titleAdd = <div className={styles.titleAdd}>Bill Detail</div>;
    const textDetail = t => (
      <Row gutter={20} style={{ minWidth: '1000px' }}>
        <Col className={styles.description} span={2}>
          <Tooltip placement="top" title={t.lastName}>
            {t.lastName}
          </Tooltip>
        </Col>
        <Col className={styles.description} span={2}>
          <Tooltip placement="top" title={t.firstName}>
            {t.firstName}
          </Tooltip>
        </Col>
        <Col span={2}>{t.processDate}</Col>
        <Col span={2}>{t.date}</Col>
        <Col className={styles.description} span={4}>
          <Tooltip placement="top" title={t.reference}>
            {t.reference}
          </Tooltip>
        </Col>
        <Col className={styles.description} span={2}>
          <Tooltip placement="top" title={t.amount}>
            {t.amount}
          </Tooltip>
        </Col>

        <Col className={styles.description} span={5}>
          <Tooltip placement="top" title={t.description1}>
            {t.description1}
          </Tooltip>
        </Col>
        <Col className={styles.description} span={5}>
          <Tooltip placement="top" title={t.description2}>
            {t.description2}
          </Tooltip>
        </Col>
      </Row>
    );

    const textDetailError = t =>
      t.length > 0 && t.map(item => <div key={item.key}>{textDetail(item)}</div>);

    const columns = [
      {
        title: formatMessage({ id: 'potential.button.credit-card-last-name' }),
        dataIndex: 'creditCard',
        key: 'lastName',
        width: 120,
        render: item => (item ? item.lastName : formatMessage({ id: 'common.none' })),
      },
      {
        title: formatMessage({ id: 'potential.button.credit-card-first-name' }),
        dataIndex: 'creditCard',
        key: 'firstName',
        width: 120,
        render: item => (item ? item.firstName : formatMessage({ id: 'common.none' })),
      },
      {
        title: formatMessage({ id: 'bill.table.updatedAt' }),
        dataIndex: 'date',
        key: 'date',
        width: 120,
        render: date => moment(date).format('MMM DD YYYY'),
      },
      {
        title: formatMessage({ id: 'bill.table.type' }),
        dataIndex: 'type',
        key: 'type',
        render: (_, row) => {
          const render = {
            mileage: (
              <div>
                <Avatar className={styles.avatar} src="/assets/img/mileage-ic.png" />
                {row.mileage && row.mileage.type}
              </div>
            ),
            'customer-product': formatMessage({ id: 'category.customer-product' }),
          };
          return (
            render[row.category] || (
              <div>
                <Avatar
                  className={styles.avatar}
                  alt="logo"
                  src={row.type && row.type.thumbnailUrl}
                />
                {row.type &&
                  (!row.type.parent ? row.type.type : `${row.type.parent.type} / ${row.type.type}`)}
              </div>
            )
          );
        },
      },
      {
        title: formatMessage({ id: 'bill.table.group' }),
        dataIndex: 'group',
        key: 'group',
        width: 120,
        render: text => (text && text.groupName) || formatMessage({ id: 'common.non-tag' }),
      },
      {
        title: formatMessage({ id: 'bill.table.amount' }),
        dataIndex: 'amount',
        key: 'amount',
        width: 170,
        render: (amount, row) => <PriceInput value={{ number: amount, currency: row.currency }} />,
      },
      matchPage
        ? {
            title: formatMessage({ id: 'bill.table.match' }),
            dataIndex: 'detail',
            key: 'detail',
            width: 50,
            render: (_, row) =>
              isMatch ? (
                <Popover
                  placement="bottom"
                  trigger="hover"
                  content={textDetail(row.transaction)}
                  overlayClassName={styles.popoverCheck}
                >
                  <Icon type="check-circle" style={{ fontSize: '18px', color: '#23de0d' }} />
                </Popover>
              ) : (
                <Popover
                  placement="bottom"
                  trigger="hover"
                  content={textDetailError(row.transEror.slice(0, 2))}
                  overlayClassName={styles.popoverCheck}
                >
                  <Icon type="close-circle" style={{ fontSize: '18px', color: 'red' }} />
                </Popover>
              ),
          }
        : {},
      !isMatch && matchPage
        ? {
            title: '',
            key: 'action',
            width: 100,
            render: (_, row) => (
              <div>
                <span onClick={() => this.showDrawerDetail(row)} style={{ paddingRight: '10px' }}>
                  <Icon type="eye" theme="filled" style={{ fontSize: '22px' }} />
                </span>
                {row.category !== 'mileage' && (
                  <span onClick={() => this.showDrawer(row.id)}>
                    <Icon type="edit" theme="filled" style={{ fontSize: '22px' }} />
                  </span>
                )}
              </div>
            ),
          }
        : {
            title: '',
            width: 100,
            key: 'action',
            render: (_, row) => (
              <span onClick={() => this.showDrawerDetail(row)}>
                <Icon type="eye" theme="filled" style={{ fontSize: '22px' }} />
              </span>
            ),
          },
    ];

    return (
      <div className={styles.root}>
        <div style={{ fontSize: '20px', fontWeight: '600' }}>{titleTable}</div>
        <div style={{ fontSize: '16px', fontWeight: '300' }}>
          {formatMessage({ id: 'potential.bill.table.count' }, { count: list.length })}
        </div>
        <Table
          locale={{
            emptyText: (
              <Empty description={formatMessage({ id: 'common.no-expense' }, { format: 0 })} />
            ),
          }}
          columns={columns}
          dataSource={list}
          pagination={{ ...pagination, total: list.size }}
          rowKey="id"
          loading={loading}
          onChange={this.handleChangeTable}
          scroll={{ x: 'fit-content' }}
        />
        <Drawer
          title={titleAdd}
          placement="right"
          onClose={this.onClose}
          visible={billEditVisible}
          width={650}
          bodyStyle={{ height: '100%' }}
        >
          <BillForm match={data} handleCloseModal={() => this.onClose()} />
        </Drawer>
        <Drawer
          width={400}
          visible={billDetailVisible}
          onClose={this.onCloseDetail}
          closable={false}
        >
          <BillDetail bill={expenseSelect} />
        </Drawer>
      </div>
    );
  }
}

export default ExpenseTable;
