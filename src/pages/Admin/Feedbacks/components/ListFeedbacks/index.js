import React from 'react';
import PropTypes from 'prop-types';
import { Table, Empty, Modal, Icon } from 'antd';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './index.less';

const moment = extendMoment(Moment);

@connect(({ loading, customer, feedback }) => ({
  loading: loading.models.user,
  fetchingProject: loading.models.feedback,
  customer,
  feedback,
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

  handleClickRow = row => {
    const { onRowClick } = this.props;
    if (typeof onRowClick === 'function') onRowClick(row);
  };

  render() {
    const { list, fetchingProject, feedback } = this.props;
    const { pagination, sortedBills = {} } = this.state;

    const columns = [
      {
        title: 'feedback.date',
        dataIndex: 'createdAt',
        key: 'createdAt',
        sorter: (item, nextItem) => moment.utc(item.createdAt).diff(moment.utc(nextItem.createdAt)),
        sortOrder: sortedBills.columnKey === 'createdAt' && sortedBills.order,
        render: date => moment(date).format('MMM DD YYYY'),
      },
      {
        title: 'feedback.email',
        dataIndex: 'email',
        key: 'email',
        sorter: (item, nextItem) => item.email.localeCompare(nextItem.email),
        sortOrder: sortedBills.columnKey === 'email' && sortedBills.order,
      },
      {
        title: 'feedback.description',
        dataIndex: 'description',
        key: 'description',
        sorter: (item, nextItem) => item.description.localeCompare(nextItem.description),
        sortOrder: sortedBills.columnKey === 'description' && sortedBills.order,
      },
      {
        title: 'feedback.type',
        dataIndex: 'feedbackFor',
        key: 'feedbackFor',
        sorter: (item, nextItem) => item.feedbackFor.localeCompare(nextItem.feedbackFor),
        sortOrder: sortedBills.columnKey === 'feedbackFor' && sortedBills.order,
      },
      {
        title: 'feedback.office',
        dataIndex: 'office',
        key: 'office',
        sorter: (item, nextItem) => item.office.localeCompare(nextItem.office),
        sortOrder: sortedBills.columnKey === 'office' && sortedBills.order,
      },
      {
        title: 'feedback.status',
        dataIndex: 'status',
        key: 'status',
        sorter: (item, nextItem) => item.status.localeCompare(nextItem.status),
        sortOrder: sortedBills.columnKey === 'status' && sortedBills.order,
      },
      {
        title: 'feedback.action',
        dataIndex: 'action',
        key: 'action',
        render: (_, row) => (
          <div style={{ textAlign: 'center', width: 86 }}>
            <span className={styles.btnView} onClick={() => this.handleClickRow(row)}>
              <Icon type="eye" theme="filled" style={{ fontSize: '22px' }} />
            </span>
          </div>
        ),
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
          pagination={{ ...pagination, total: feedback.total }}
          rowKey="id"
          onChange={this.handleChangeTable}
          scroll={{ x: 'fit-content' }}
        />
      </div>
    );
  }
}

export default ListProject;
