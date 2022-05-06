import { Empty, Table } from 'antd';
import React, { Component } from 'react';
import { connect, formatMessage } from 'umi';
import styles from './index.less';

class CommonTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageSelected: 1,
      pageSize: 10,
    };
  }

  onChangePagination = (pageNumber, pageSize) => {
    const { onChangePage = () => {}, isBackendPaging = false } = this.props;

    if (isBackendPaging) {
      onChangePage(pageNumber);
    } else {
      this.setState({
        pageSelected: pageNumber,
        pageSize,
      });
    }
  };

  render() {
    const { pageSelected, pageSize } = this.state;
    const {
      list = [],
      columns,
      loading = false,
      page = 1,
      total: totalProp,
      isBackendPaging = false,
    } = this.props;

    const pagination = {
      position: ['bottomLeft'],
      total: isBackendPaging ? totalProp : list.length,
      showTotal: (total, range) => (
        <span>
          {' '}
          {formatMessage({ id: 'component.directory.pagination.showing' })}{' '}
          <b>
            {range[0]} - {range[1]}
          </b>{' '}
          {formatMessage({ id: 'component.directory.pagination.of' })} {total}{' '}
        </span>
      ),
      showSizeChanger: true,
      pageSizeOptions: ['10', '25', '50', '100'],
      defaultPageSize: pageSize,
      pageSize,
      current: isBackendPaging ? page : pageSelected,
      onChange: this.onChangePagination,
    };

    return (
      <>
        <div className={styles.CommonTable}>
          <Table
            size="small"
            locale={{
              emptyText: <Empty description="No data" />,
            }}
            columns={columns}
            dataSource={list}
            loading={loading}
            // pagination={list.length > rowSize ? { ...pagination, total: list.length } : false}
            pagination={pagination}
            // scroll={{ x: 1000, y: 'max-content' }}
          />
        </div>
      </>
    );
  }
}

// export default CommonTable;
export default connect(() => ({}))(CommonTable);
