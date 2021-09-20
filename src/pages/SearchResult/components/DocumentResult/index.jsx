import React, { useEffect, useState } from 'react';
import filterIcon from '@/assets/offboarding-filter.svg';
import { Table } from 'antd';
import { formatMessage, connect, history } from 'umi';
import styles from '../../index.less';

const DocumentResult = (props) => {
  const {
    keySearch,
    loadTableData,
    dispatch,
    isSearch,
    documnetAdvance,
    documentList,
    totalDocuments,
    loadTableData2,
  } = props;
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  useEffect(() => {
    if (isSearch) {
      if (keySearch) {
        dispatch({
          type: 'searchAdvance/searchGlobalByType',
          payload: {
            keySearch,
            searchType: 'DOCUMENT',
            page,
            limit,
          },
        });
      } else {
        dispatch({
          type: 'searchAdvance/searchDocument',
          payload: { page, limit, ...documnetAdvance },
        });
      }
    }
  }, [isSearch]);

  const clickFilter = () => {
    dispatch({
      type: 'searchAdvance/save',
      payload: { isSearchAdvance: true },
    });
    history.push('documents/advanced-search');
  };

  const columns = [
    {
      title: 'Document',
      dataIndex: 'documnet',
      key: 'name',
    },
    {
      title: 'Owner',
      dataIndex: 'createdBy',
      key: 'createdBy',
    },
    {
      title: 'Created On',
      dataIndex: 'createdOn',
      key: 'createdOn',
    },
    {
      title: 'Last Modified On',
      dataIndex: 'lastModifiedOn',
      key: 'lastModifiedOn',
    },
    {
      title: 'Last Modified By',
      dataIndex: 'lastModifiedBy',
      key: 'lastModifiedBy',
    },
  ];

  const pagination = {
    position: ['bottomLeft'],
    total: totalDocuments,
    showTotal: (total, range) => (
      <span>
        {formatMessage({ id: 'component.directory.pagination.showing' })}{' '}
        <b>
          {range[0]} - {range[1]}
        </b>{' '}
        {formatMessage({ id: 'component.directory.pagination.of' })} {total}{' '}
      </span>
    ),
    defaultPageSize: 10,
    showSizeChanger: true,
    pageSizeOptions: ['10', '25', '50', '100'],
    pageSize: limit,
    current: page,
    onChange: (nextPage, pageSize) => {
      setPage(nextPage);
      setLimit(pageSize);
    },
  };
  return (
    <div className={styles.resultContent}>
      <div className={styles.filter}>
        <img src={filterIcon} alt="filter icon" onClick={clickFilter} />
      </div>
      <div className={styles.result}>
        <Table
          columns={columns}
          dataSource={documentList}
          size="middle"
          pagination={pagination}
          loading={loadTableData || loadTableData2}
        />
      </div>
    </div>
  );
};
export default connect(
  ({
    loading,
    searchAdvance: {
      keySearch = '',
      isSearch,
      isSearchAdvance,
      documnetAdvance,
      globalSearchAdvance: { employees: documentList, totalDocuments },
    },
  }) => ({
    loadTableData: loading.effects['searchAdvance/searchDocument'],
    loadTableData2: loading.effects['searchAdvance/searchGlobalByType'],
    documentList,
    totalDocuments,
    documnetAdvance,
    isSearch,
    isSearchAdvance,
    keySearch,
  }),
)(DocumentResult);
