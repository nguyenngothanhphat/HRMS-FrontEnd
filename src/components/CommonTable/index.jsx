import { Empty, Table } from 'antd';
import React, { useState } from 'react';
import { connect, formatMessage } from 'umi';
import styles from './index.less';

const CommonTable = (props) => {
  const {
    onChangePage = () => {},
    isBackendPaging = false,
    list = [],
    columns,
    loading = false,
    page = 1,
    limit = 10,
    total: totalProp,
    selectable = false,
    rowKey = '',
    scrollable = false,
    showPagination = true,
    selectedRowKeys = [],
    setSelectedRowKeys = () => {},
    components,
  } = props;
  const [pageSelected, setPageSelected] = useState(1);

  const onChangePagination = (pageNumber) => {
    if (isBackendPaging) {
      onChangePage(pageNumber);
    } else {
      setPageSelected(pageNumber);
    }
  };

  const onSelectChange = (values) => {
    setSelectedRowKeys(values);
  };

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
    pageSize: limit,
    current: isBackendPaging ? page : pageSelected,
    onChange: onChangePagination,
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <>
      <div className={styles.CommonTable}>
        <Table
          // eslint-disable-next-line react/jsx-props-no-spreading
          components={components}
          size="middle"
          locale={{
            emptyText: <Empty description="No data" />,
          }}
          rowSelection={selectable ? rowSelection : null}
          columns={columns}
          dataSource={list}
          loading={loading}
          // pagination={list.length > rowSize ? { ...pagination, total: list.length } : false}
          pagination={showPagination ? pagination : {}}
          scroll={scrollable ? { x: '101%', y: 'fit-content' } : {}}
          rowKey={rowKey ? (record) => record[rowKey] : null}
        />
      </div>
    </>
  );
};

// export default CommonTable;
export default connect(() => ({}))(CommonTable);
