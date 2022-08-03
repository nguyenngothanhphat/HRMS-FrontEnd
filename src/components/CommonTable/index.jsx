import { Table } from 'antd';
import React, { useState } from 'react';
import { connect, formatMessage } from 'umi';
import Empty from '@/components/Empty';
import styles from './index.less';

const CommonTable = ({
  onChangePage = () => {},
  isBackendPaging = false,
  list = [],
  columns = [],
  loading = false,
  page = 1,
  limit = 10,
  total: totalProp,
  selectable = false,
  rowKey = '', // work with selectable
  showPagination = true,
  selectedRowKeys = [], // work with selectable
  setSelectedRowKeys = () => {}, // work with selectable
  components,
  scrollable = false,
  width = '100%', // work with scroll
  height = 400, // work with scroll
  pageSizeOptions = ['10', '25', '50', '100'],
  ...props
}) => {
  const [pageSelected, setPageSelected] = useState(1);
  const [rowSize, setRowSize] = useState(10);

  const onChangePagination = (pageNumber, pageSize) => {
    if (isBackendPaging) {
      onChangePage(pageNumber, pageSize);
    } else {
      setPageSelected(pageNumber);
      setRowSize(pageSize);
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
    defaultPageSize: 10,
    showSizeChanger: true,
    pageSizeOptions,
    pageSize: isBackendPaging ? limit : rowSize,
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
          {...props}
          components={components}
          size="middle"
          locale={{
            emptyText: <Empty description="No data" />,
          }}
          rowSelection={selectable ? rowSelection : null}
          columns={columns}
          dataSource={list}
          loading={loading}
          pagination={showPagination ? pagination : { position: ['none', 'none'] }}
          scroll={scrollable ? { x: width, y: height } : {}}
          rowKey={rowKey ? (record) => record[rowKey] : null}
        />
      </div>
    </>
  );
};

// export default CommonTable;
export default connect(() => ({}))(CommonTable);
