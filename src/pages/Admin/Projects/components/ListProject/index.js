import React from 'react';
import PropTypes from 'prop-types';
import { Table, Empty, Icon, Modal } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './index.less';

@connect(({ loading, customer }) => ({
  loading: loading.models.user,
  fetchingProject: loading.models.project,
  customer,
}))
class ListProject extends React.PureComponent {
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
      pageSize: 10,
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

  handleChangeTable = (_pagination, _filters, sorter) => {
    this.setState({
      sortedBills: sorter,
    });
  };

  showConfirm = ({ type, id }) => {
    const { dispatch } = this.props;
    const action = {
      delete: {
        title: formatMessage({ id: 'customer.project.delete.confirm' }),
        onOk() {
          dispatch({ type: 'project/deleteProject', payload: { id } });
        },
      },
    };

    Modal.confirm({
      ...action[type],
    });
  };

  render() {
    const { list, onClickItem, fetchingProject } = this.props;
    const { pagination, sortedBills = {} } = this.state;

    const columns = [
      {
        title: 'project.name',
        dataIndex: 'name',
        key: 'name',
        sorter: (item, nextItem) => item.name.localeCompare(nextItem.name),
        sortOrder: sortedBills.columnKey === 'name' && sortedBills.order,
      },
      {
        title: 'project.description',
        dataIndex: 'description',
        key: 'description',
        sorter: (item, nextItem) =>
          (item.description || '').localeCompare(nextItem.description || ''),
        sortOrder: sortedBills.columnKey === 'description' && sortedBills.order,
      },
      {
        title: 'project.visibility',
        key: 'visibility',
        render: (_, record) => {
          const { isVisibleAll, members } = record;
          if (isVisibleAll) return formatMessage({ id: 'project.all-employee' });
          return members.map(item => <div key={record.id}>{item}</div>);
        },
      },
      {
        title: 'project.status',
        dataIndex: 'status',
        key: 'status',
        sorter: (item, nextItem) => (item.status || '').localeCompare(nextItem.status || ''),
        sortOrder: sortedBills.columnKey === 'status' && sortedBills.order,
      },
      {
        title: 'common.table.action',
        key: 'action',
        dataIndex: '_id',
        width: 65,
        render: (_, record) => {
          return (
            <div style={{ textAlign: 'center' }}>
              <span className={styles.btnView}>
                <Icon
                  type="edit"
                  theme="filled"
                  style={{ fontSize: '22px' }}
                  onClick={() => onClickItem(record)}
                />
              </span>
              <span className={styles.btnDel}>
                <Icon
                  type="delete"
                  theme="filled"
                  style={{ fontSize: '22px' }}
                  onClick={() => this.showConfirm({ type: 'delete', id: record._id })}
                />
              </span>
            </div>
          );
        },
      },
    ];

    return (
      <div className={styles.root}>
        <Table
          loading={fetchingProject}
          locale={{
            emptyText: <Empty description={formatMessage({ id: 'common.no-customer' })} />,
          }}
          columns={columns.map(col => ({
            ...col,
            title: formatMessage({ id: col.title, defaultMessage: col.title }).toUpperCase(),
          }))}
          dataSource={list}
          pagination={{ ...pagination, total: list.size }}
          rowKey="id"
          onChange={this.handleChangeTable}
          scroll={{ x: 'fit-content' }}
        />
      </div>
    );
  }
}

export default ListProject;
