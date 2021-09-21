/* eslint-disable react/destructuring-assignment */
import React, { useEffect, useState } from 'react';
import filterIcon from '@/assets/offboarding-filter.svg';
import { Table } from 'antd';
import { formatMessage, connect, history } from 'umi';
import iconPDF from '@/assets/pdf-2.svg';
import ViewDocumentModal from '@/components/ViewDocumentModal';
import moment from 'moment';
import styles from '../../index.less';

const DocumentResult = React.memo((props) => {
  const {
    keySearch,
    loadTableData,
    dispatch,
    isSearch,
    documnetAdvance,
    documentList,
    isSearchAdvance,
    totalDocuments,
    loadTableData2,
    tabName,
  } = props;
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  useEffect(() => {
    if (isSearch && tabName === 'documents') {
      if (isSearchAdvance) {
        dispatch({
          type: 'searchAdvance/searchDocument',
          payload: { page, limit, ...documnetAdvance },
        });
      } else if (keySearch) {
        dispatch({
          type: 'searchAdvance/searchGlobalByType',
          payload: {
            keySearch,
            searchType: 'DOCUMENT',
            page,
            limit,
          },
        });
      }
    }
  }, [isSearch]);

  const dateFormat = 'DD.MM.YY';
  const [visable, setVisiable] = useState(false);
  const [urlDocument, setUrlDocument] = useState('');
  const [displayDocumentName, setDisplayDocumentName] = useState('');
  const viewDocument = (document) => {
    const { name: attachmentName = '', url: attachmentUrl = '' } = document;
    setVisiable(true);
    setUrlDocument(attachmentUrl);
    setDisplayDocumentName(attachmentName);
  };

  const clickFilter = () => {
    history.push('documents/advanced-search');
  };

  const columns = [
    {
      title: 'Document',
      dataIndex: 'key',
      key: 'name',
      width: 400,
      fixed: 'left',
      render: (key, record) => (
        <div className={styles.document} onClick={() => viewDocument(record.attachment)}>
          <div className={styles.text}>{key}</div>
          <img alt="pdf-img" src={iconPDF} />
        </div>
      ),
    },
    {
      title: 'Owner',
      dataIndex: 'ownerInfo',
      key: 'ownerInfo',
      render: (ownerInfo) => <div>{ownerInfo.name}</div>,
    },
    {
      title: 'Created On',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt) => <div>{moment(createdAt).format(dateFormat)}</div>,
    },
    {
      title: 'Last Modified On',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (updatedAt) => <div>{moment(updatedAt).format(dateFormat)}</div>,
    },
    {
      title: 'Last Modified By',
      dataIndex: 'ownerInfo',
      key: 'ownerInfo',
      render: (ownerInfo) => <div>{ownerInfo.name}</div>,
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
      <ViewDocumentModal
        visible={visable}
        fileName={displayDocumentName}
        url={urlDocument}
        onClose={() => setVisiable(false)}
      />
    </div>
  );
});
export default connect(
  ({
    loading,
    searchAdvance: {
      keySearch = '',
      isSearch,
      isSearchAdvance,
      documnetAdvance,
      globalSearchAdvance: { employeeDoc: documentList, totalDocuments },
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
