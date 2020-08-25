import React from 'react';
import PropTypes from 'prop-types';
import { Table, Empty, Icon, Modal } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './index.less';

class ListCard extends React.PureComponent {
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

  constructor(props) {
    super(props);
    const { pagination, list = [] } = props;
    this.state = {
      pagination: { ...pagination, size: list.length },
    };
  }

  showConfirm = ({ type, id }) => {
    const { dispatch } = this.props;
    const action = {
      delete: {
        title: formatMessage({ id: 'creditCard.confirm.delete' }),
        onOk() {
          dispatch({ type: 'creditCard/deleteCard', payload: { id } }).then(() => {
            dispatch({ type: 'creditCard/fetch' });
          });
        },
      },
    };

    Modal.confirm({
      ...action[type],
    });
  };

  handleChangeTable = (_pagination, _filters, sorter) => {
    this.setState({
      sortedBills: sorter,
    });
  };

  handleDetail = id => {
    const { onClickItem } = this.props;
    if (typeof onClickItem === 'function') onClickItem(id);
  };

  handleView = id => {
    const { onClickView } = this.props;
    if (typeof onClickView === 'function') onClickView(id);
  };

  getCreditcardStatus = status => {
    let id;
    switch (status) {
      case 'ACTIVE':
        id = 'common.active';
        break;
      case 'REJECT':
        id = 'common.status.reject';
        break;
      case 'DISABLE':
        id = 'common.button.disable';
        break;
      default:
        id = 'creditCard.pending';
        break;
    }
    return formatMessage({ id });
  };

  render() {
    const { list } = this.props;
    const { pagination, sortedBills = {} } = this.state;

    const columns = [
      {
        title: formatMessage({ id: 'creditCard.table.firstName' }),
        dataIndex: 'firstName',
        key: 'firstName',
        sorter: (item, nextItem) => (item.firstName || '').localeCompare(nextItem.firstName || ''),
        sortOrder: sortedBills.columnKey === 'firstName' && sortedBills.order,
      },
      {
        title: formatMessage({ id: 'creditCard.table.lastName' }),
        dataIndex: 'lastName',
        key: 'lastName',
        sorter: (item, nextItem) => (item.lastName || '').localeCompare(nextItem.lastName || ''),
        sortOrder: sortedBills.columnKey === 'lastName' && sortedBills.order,
      },
      {
        title: formatMessage({ id: 'creditCard.table.type' }),
        dataIndex: 'name',
        key: 'name',
        sorter: (item, nextItem) => (item.name || '').localeCompare(nextItem.name || ''),
        sortOrder: sortedBills.columnKey === 'name' && sortedBills.order,
      },
      {
        title: formatMessage({ id: 'creditCard.table.status' }),
        dataIndex: 'status',
        key: 'status',
        render: item => this.getCreditcardStatus(item),
      },
      {
        title: formatMessage({ id: 'creditCard.table.requester' }),
        dataIndex: 'user',
        key: 'user',
        render: item => (item ? item.fullName : formatMessage({ id: 'creditCard.none' })),
      },
      {
        title: formatMessage({ id: 'creditCard.table.assign' }),
        dataIndex: 'assignEmail',
        key: 'assign',
        render: (_, row) => (
          <div>{row.assignEmail || formatMessage({ id: 'creditCard.unassigned' })}</div>
        ),
        sorter: (item, nextItem) =>
          (item.assignEmail || formatMessage({ id: 'creditCard.unassigned' })).localeCompare(
            nextItem.assignEmail || formatMessage({ id: 'creditCard.unassigned' })
          ),
        sortOrder: sortedBills.columnKey === 'assign' && sortedBills.order,
      },
      {
        title: formatMessage({ id: 'creditCard.table.action' }),
        key: 'action',
        width: 65,
        render: (_, row) => (
          <div style={{ textAlign: 'center' }}>
            {['ACTIVE', 'DISABLE'].indexOf(row.status) > -1 ? (
              <span className={styles.btnView}>
                <Icon
                  type="edit"
                  theme="filled"
                  style={{ fontSize: '22px' }}
                  onClick={() => this.handleDetail(row._id)}
                />
              </span>
            ) : (
              <span className={styles.btnView}>
                <Icon
                  type="eye"
                  theme="filled"
                  style={{ fontSize: '22px' }}
                  onClick={() => this.handleView(row._id)}
                />
              </span>
            )}
            {['ACTIVE', 'DISABLE'].indexOf(row.status) > -1 && (
              <span className={styles.btnDel}>
                <Icon
                  type="delete"
                  theme="filled"
                  style={{ fontSize: '22px' }}
                  onClick={() => this.showConfirm({ type: 'delete', id: row._id })}
                />
              </span>
            )}
          </div>
        ),
      },
    ];

    return (
      <div className={styles.root}>
        <Table
          locale={{
            emptyText: <Empty description={formatMessage({ id: 'common.no-credit-card' })} />,
          }}
          columns={columns}
          dataSource={list}
          pagination={{ ...pagination, total: list.size }}
          rowKey="_id"
          onChange={this.handleChangeTable}
          scroll={{ x: 'fit-content' }}
        />
      </div>
    );
  }
}

export default ListCard;
