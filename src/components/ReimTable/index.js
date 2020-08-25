import React from 'react';
import Moment from 'moment';
import isEqual from 'lodash/isEqual';
import { extendMoment } from 'moment-range';
import { Table, Input, Row, Col, Button, Icon, Modal, DatePicker, Empty, Tooltip } from 'antd';
import Link from 'umi/link';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import Review from '@/components/Review';
import StatusBox from '@/components/StatusBox';
import check from '@/components/Authorized/CheckPermissions';
import PriceInput from '../PriceInput';
import styles from './index.less';

const ButtonGroup = Button.Group;
const { Search } = Input;
const { RangePicker } = DatePicker;
const moment = extendMoment(Moment);

@connect(({ reimbursement, loading }) => ({
  reimbursement,
  loading: loading.models.reimbursement,
}))
class ReimTable extends React.Component {
  state = {
    visible: false,
    active: 0,
    pageSelected: 1,
  };

  static getDerivedStateFromProps(nextProps) {
    if ('list' in nextProps) return { list: nextProps.list };
    return null;
  }

  componentDidMount() {
    const { dispatch, type = 'request' } = this.props;
    dispatch({ type: 'reimbursement/fetch', payload: { method: type } });
    dispatch({ type: 'reimbursement/selectReimbursement', payload: { [type]: [] } });
  }

  componentDidUpdate(_preProps, { q: prevQ, date: prevDate }) {
    const { date, q } = this.state;
    const { dispatch, type = 'request' } = this.props;

    if (prevQ !== q || !isEqual(date, prevDate)) {
      let filterDate = date;
      if (filterDate && filterDate.type === 'range') {
        const { from, to } = filterDate;
        filterDate = {
          ...filterDate,
          from: `${moment(from.clone().toString()).format('YYYY-MM-DD')}T00:00:00`,
          to: `${moment(to.clone().toString()).format('YYYY-MM-DD')}T23:59:59`,
        };
      }
      dispatch({
        type: 'reimbursement/fetch',
        payload: { method: type, q, date: filterDate },
      });
    }
  }

  select = (reim, selected) => {
    const { dispatch, selectedList, type, isPotential } = this.props;
    let list = !isPotential ? [...selectedList] : [];
    if (!selected) list = list.filter(b => b.id !== reim.id);
    else list.push(reim);
    dispatch({ type: 'reimbursement/selectReimbursement', payload: { [type]: list } });
  };

  handleChangeTable = (_pagination, _filters, sorter) => {
    this.setState({
      sortedReims: sorter,
    });
  };

  handleSearch = value => {
    this.setState({ q: value, pageSelected: 1 });
  };

  openModel = () => {
    this.setState({ visible: true });
  };

  handleCloseModal = () => {
    const { visible } = this.state;
    this.setState({ visible: !visible });
  };

  showConfirm = ({ type, reId }) => {
    const { dispatch } = this.props;
    const action = {
      delete: {
        title: formatMessage({ id: 'reimbursement.delete.confirm' }),
        onOk() {
          dispatch({ type: 'reimbursement/removeItem', payload: { reId } });
        },
      },
    };

    Modal.confirm({
      ...action[type],
    });
  };

  onChangePagination = pageNumber => {
    this.setState({
      pageSelected: pageNumber,
    });
  };

  render() {
    const {
      reimbursement,
      dispatch,
      selectedList,
      onRowClick,
      type = 'request',
      loading,
      isPotential,
    } = this.props;
    const list = reimbursement.list[type];
    const { date: { from, to } = {}, visible, active, pageSelected } = this.state;
    const { sortedReims = {} } = this.state;
    const pagination = {
      showSizeChanger: false,
      showQuickJumper: false,
      hideOnSinglePage: true,
      pageSize: 5,
      current: pageSelected,
      onChange: this.onChangePagination,
    };

    const columns = [
      {
        title: formatMessage({ id: 'reimbursement.table.createdAt' }),
        dataIndex: 'createdAt',
        key: 'createdAt',
        sorter: (item, nextItem) => moment.utc(item.createdAt).diff(moment.utc(nextItem.createdAt)),
        sortOrder: sortedReims.columnKey === 'createdAt' && sortedReims.order,
        render: createdAt => moment(createdAt).format('MMM DD YYYY'),
      },
      type === 'request'
        ? {
            title: formatMessage({ id: 'reimbursement.table.currentAssign' }),
            dataIndex: 'currentAssign',
            key: 'currentAssign',
            render: text =>
              text === 'DRAFT' ? formatMessage({ id: 'reimbursement.status.draft' }) : text,
            sorter: (item, nextItem) => item.currentAssign.localeCompare(nextItem.currentAssign),
            sortOrder: sortedReims.columnKey === 'currentAssign' && sortedReims.order,
          }
        : {
            title: formatMessage({ id: 'reimbursement.table.requester' }),
            dataIndex: 'currentRequest',
            key: 'currentRequest',
            sorter: (item, nextItem) => item.currentRequest.localeCompare(nextItem.currentRequest),
            sortOrder: sortedReims.columnKey === 'currentRequest' && sortedReims.order,
          },
      {
        title: formatMessage({ id: 'reimbursement.table.amount' }),
        dataIndex: 'amount',
        key: 'amount',
        render: (_, row) => <PriceInput value={{ currency: row.currency, number: _ }} />,
        sorter: (item, nextItem) => item.amount - nextItem.amount,
        sortOrder: sortedReims.columnKey === 'amount' && sortedReims.order,
      },
      {
        title: formatMessage({ id: 'reimbursement.table.title' }),
        dataIndex: 'title',
        key: 'title',
        render: text => (
          <Tooltip placement="top" title={text} trigger="hover">
            <div className={styles.title}>{text}</div>
          </Tooltip>
        ),
        sorter: (item, nextItem) => item.title.localeCompare(nextItem.title),
        sortOrder: sortedReims.columnKey === 'title' && sortedReims.order,
      },
      {
        title: formatMessage({ id: 'reimbursement.table.status' }),
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        render: text => (
          <Tooltip placement="top" title={formatMessage({ id: 'record' })} trigger="hover">
            <div>
              <StatusBox status={text} />
            </div>
          </Tooltip>
        ),
        sorter: (item, nextItem) => item.status.localeCompare(nextItem.status),
        sortOrder: sortedReims.columnKey === 'status' && sortedReims.order,
      },
      !isPotential
        ? {
            title: formatMessage({ id: 'reimbursement.table.action' }),
            key: 'action',
            width: 96,
            render: (_, row) =>
              type === 'request' ? (
                <div style={{ width: 86 }}>
                  <Link className={styles.btnView} to={`/report/view/${row.id}`}>
                    <Icon type="eye" theme="filled" style={{ fontSize: '22px' }} />
                  </Link>
                  {['DRAFT', 'PENDING'].indexOf(row.status) > -1 && (
                    <span>
                      <Link className={styles.btnEdit} to={`/report/update/${row.id}`}>
                        <Icon type="edit" theme="filled" style={{ fontSize: '22px' }} />
                      </Link>
                      <span
                        onClick={() => this.showConfirm({ type: 'delete', reId: row.id })}
                        className={styles.btnDel}
                      >
                        <Icon type="delete" theme="filled" style={{ fontSize: '22px' }} />
                      </span>
                    </span>
                  )}
                </div>
              ) : (
                <div>
                  <Link className={styles.btnAction} to={`/report/review/${row.id}`}>
                    <Icon type="eye" theme="filled" style={{ fontSize: '22px' }} />
                  </Link>
                  <Review dispatch={dispatch} reId={row.id} type={type} list={reimbursement.list} />
                </div>
              ),
          }
        : {},
    ];

    if (check(['customer'], true, false)) {
      columns.splice(4, 1);
    }

    return (
      <div className={styles.root}>
        <Row type="flex" justify="space-between">
          <Col sm={8}>
            <Search
              placeholder={
                type === 'request'
                  ? formatMessage({ id: 'reimbursement.table.search.assign.placeholder' })
                  : formatMessage({ id: 'reimbursement.table.search.request.placeholder' })
              }
              onSearch={value => this.handleSearch(value)}
            />
          </Col>
          <Col>
            <ButtonGroup>
              <Button
                type={active === 0 ? 'primary' : 'default'}
                onClick={() => {
                  this.setState({ date: undefined, active: 0, pageSelected: 1 });
                }}
              >
                <FormattedMessage id="reimbursement.filter.all" />
              </Button>
              <Button
                type={active === 1 ? 'primary' : 'default'}
                onClick={() => {
                  this.setState({
                    date: { type: 'month', time: moment().format('M') },
                    active: 1,
                    pageSelected: 1,
                  });
                }}
              >
                <FormattedMessage id="reimbursement.filter.thisMonth" />
              </Button>
              <Button
                type={active === 2 ? 'primary' : 'default'}
                onClick={() => {
                  this.setState({
                    date: {
                      type: 'month',
                      time: moment()
                        .subtract(1, 'month')
                        .format('M'),
                    },
                    active: 2,
                    pageSelected: 1,
                  });
                }}
              >
                <FormattedMessage id="reimbursement.filter.lastMonth" />
              </Button>
              <Button type={active === 3 ? 'primary' : 'default'} onClick={this.openModel}>
                <Icon type="calendar" />
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
        <Table
          loading={loading}
          locale={{
            emptyText: <Empty description={formatMessage({ id: 'reimbursement.empty' })} />,
          }}
          rowSelection={{
            selectedRowKeys: selectedList.map(reim => reim.id),
            onSelect: (record, selected) => this.select(record, selected),

            onSelectAll: (selected, rowsOnPage) => {
              const reims = selected ? rowsOnPage : [];
              const currentReim = [...selectedList];
              dispatch({
                type: 'reimbursement/selectReimbursement',
                payload: { [type]: !isPotential ? reims : currentReim },
              });
            },
          }}
          onRow={reim => ({
            onClick: ({ target: { nodeName } }) => {
              if (nodeName !== 'TD') return;
              if (typeof onRowClick === 'function') onRowClick(reim);
              this.select(reim, !selectedList.find(b => b.id === reim.id));
            },
          })}
          columns={columns}
          dataSource={list}
          pagination={{ ...pagination, total: list.length }}
          rowKey="id"
          onChange={this.handleChangeTable}
          scroll={{ x: 'fit-content' }}
        />

        <Modal
          title={formatMessage({ id: 'reimbursement.filter.date.range' })}
          visible={visible}
          onCancel={() => {
            this.setState({ visible: false });
          }}
          style={{ textAlign: 'center' }}
          footer={false}
        >
          <RangePicker
            format="MMM DD YYYY"
            value={from && to && [from, to]}
            onChange={(dates, dateStrings = []) => {
              if (dateStrings.length > 1) {
                const [newFrom, newTo] = dates;
                this.setState({
                  date: (newFrom || newTo) && { type: 'range', from: newFrom, to: newTo },
                  visible: false,
                  active: 3,
                  pageSelected: 1,
                });
              }
            }}
          />
        </Modal>
      </div>
    );
  }
}

export default ReimTable;
